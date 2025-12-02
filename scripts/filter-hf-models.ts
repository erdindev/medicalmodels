/**
 * Filter Hugging Face Models
 *
 * Uses Claude API to identify and remove:
 * - Reviews/tutorials/introductions (not original research)
 * - Models without proper publication links
 *
 * Two-pass approach:
 * 1. Filter by title patterns
 * 2. Use Claude API to analyze remaining models
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const anthropic = new Anthropic();

// Obvious non-research patterns in titles
const EXCLUDE_TITLE_PATTERNS = [
  /tutorial/i,
  /introduction/i,
  /intro[-\s]/i,
  /getting[-\s]started/i,
  /how[-\s]to/i,
  /guide/i,
  /demo/i,
  /example/i,
  /sample/i,
  /test[-\s]?model/i,
  /playground/i,
  /experiment/i,
  /practice/i,
  /learning/i,
  /course/i,
  /workshop/i,
  /bootcamp/i,
  /exercise/i,
  /homework/i,
  /assignment/i,
  /my[-_]?awesome/i,
  /my[-_]?first/i,
  /hello[-_]?world/i,
  /fine[-_]?tun(ed|ing)[-_]?(test|demo|example)/i,
];

// Patterns that suggest it's a real model (not a tutorial)
const INCLUDE_PATTERNS = [
  /clinical/i,
  /medical/i,
  /biomedical/i,
  /diagnosis/i,
  /detection/i,
  /classification/i,
  /segmentation/i,
  /ner/i,
  /bert/i,
  /llama/i,
  /gpt/i,
  /transformer/i,
];

interface HFModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  metadata: string | null;
}

async function getHFModels(): Promise<HFModel[]> {
  return prisma.medicalModel.findMany({
    where: {
      slug: { startsWith: 'hf-' }
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      metadata: true,
    }
  });
}

function filterByTitlePatterns(models: HFModel[]): { keep: HFModel[], remove: HFModel[] } {
  const keep: HFModel[] = [];
  const remove: HFModel[] = [];

  for (const model of models) {
    const name = model.name.toLowerCase();

    // Check for exclude patterns
    let shouldExclude = false;
    for (const pattern of EXCLUDE_TITLE_PATTERNS) {
      if (pattern.test(name)) {
        shouldExclude = true;
        break;
      }
    }

    // If it matches an include pattern, keep it even if it matches exclude
    if (shouldExclude) {
      let hasIncludePattern = false;
      for (const pattern of INCLUDE_PATTERNS) {
        if (pattern.test(name)) {
          hasIncludePattern = true;
          break;
        }
      }
      if (!hasIncludePattern) {
        remove.push(model);
        continue;
      }
    }

    keep.push(model);
  }

  return { keep, remove };
}

async function classifyWithClaude(models: HFModel[]): Promise<{ keep: string[], remove: string[] }> {
  const BATCH_SIZE = 50;
  const keepIds: string[] = [];
  const removeIds: string[] = [];

  for (let i = 0; i < models.length; i += BATCH_SIZE) {
    const batch = models.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(models.length / BATCH_SIZE)}...`);

    const modelList = batch.map((m, idx) => {
      let metadata: Record<string, unknown> = {};
      try {
        if (m.metadata) metadata = JSON.parse(m.metadata);
      } catch {}

      return `${idx + 1}. ID: ${m.id}
   Name: ${m.name}
   Description: ${m.description}
   HuggingFace ID: ${metadata.huggingfaceId || 'N/A'}
   Tags: ${Array.isArray(metadata.tags) ? metadata.tags.slice(0, 10).join(', ') : 'N/A'}`;
    }).join('\n\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are classifying medical AI models from Hugging Face.

KEEP models that are:
- Original research models (published or pre-trained for medical use)
- Medical NLP models (NER, classification, embeddings)
- Medical imaging models (classification, segmentation, detection)
- Clinical decision support models
- Biomedical language models

REMOVE models that are:
- Tutorials, demos, examples, or learning exercises
- Test uploads or experiments (e.g., "my_test_model", "experiment1")
- Duplicate quantized versions (GGUF, GPTQ, AWQ, i1-GGUF, etc.) - keep ONE version per base model
- Non-medical models that happen to have medical keywords
- Clearly incomplete or broken models
- Personal fine-tuning experiments without research value

For each model, respond with ONLY the ID followed by KEEP or REMOVE. One per line.

Models to classify:

${modelList}

Respond in format:
<model_id> KEEP
<model_id> REMOVE
...`
      }]
    });

    // Parse response
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const lines = text.split('\n').filter(l => l.trim());

    for (const line of lines) {
      const match = line.match(/^(\S+)\s+(KEEP|REMOVE)/i);
      if (match) {
        const [, id, action] = match;
        if (action.toUpperCase() === 'KEEP') {
          keepIds.push(id);
        } else {
          removeIds.push(id);
        }
      }
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  return { keep: keepIds, remove: removeIds };
}

async function main() {
  console.log('🔍 Fetching Hugging Face models...\n');

  const allModels = await getHFModels();
  console.log(`Found ${allModels.length} HF models\n`);

  // Pass 1: Filter by title patterns
  console.log('📋 Pass 1: Filtering by title patterns...');
  const { keep: afterTitleFilter, remove: titleRemoved } = filterByTitlePatterns(allModels);
  console.log(`  Removed ${titleRemoved.length} models by title pattern`);
  console.log(`  Remaining: ${afterTitleFilter.length} models\n`);

  // Show some examples of what was removed
  if (titleRemoved.length > 0) {
    console.log('Examples of title-filtered models:');
    titleRemoved.slice(0, 5).forEach(m => console.log(`  - ${m.name}`));
    console.log('');
  }

  // Pass 2: Use Claude to classify remaining models
  console.log('🤖 Pass 2: Classifying with Claude API...');
  const { keep: claudeKeep, remove: claudeRemove } = await classifyWithClaude(afterTitleFilter);
  console.log(`  Claude marked ${claudeKeep.length} to keep, ${claudeRemove.length} to remove\n`);

  // Combine removal lists
  const allToRemove = [
    ...titleRemoved.map(m => m.id),
    ...claudeRemove
  ];

  console.log(`\n📊 Summary:`);
  console.log(`  Total HF models: ${allModels.length}`);
  console.log(`  Removed by title: ${titleRemoved.length}`);
  console.log(`  Removed by Claude: ${claudeRemove.length}`);
  console.log(`  Total to remove: ${allToRemove.length}`);
  console.log(`  Remaining: ${allModels.length - allToRemove.length}`);

  // Ask for confirmation before deleting
  console.log('\n⚠️  Ready to delete models. Run with --delete flag to proceed.');

  if (process.argv.includes('--delete')) {
    console.log('\n🗑️  Deleting models...');

    // Delete in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < allToRemove.length; i += BATCH_SIZE) {
      const batch = allToRemove.slice(i, i + BATCH_SIZE);
      await prisma.medicalModel.deleteMany({
        where: { id: { in: batch } }
      });
      console.log(`  Deleted ${Math.min(i + BATCH_SIZE, allToRemove.length)}/${allToRemove.length}`);
    }

    console.log('\n✅ Done!');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
