import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient();

// Check if ANTHROPIC_API_KEY is set
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is required');
  console.error('Please set it with: export ANTHROPIC_API_KEY=your_key_here');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

// Function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#xb1;/g, '±')
    .replace(/&#x2013;/g, '–')
    .replace(/&#x2014;/g, '—')
    .replace(/&#x2019;/g, "'")
    .replace(/&#x201c;/g, '"')
    .replace(/&#x201d;/g, '"')
    .replace(/&#xa0;/g, ' ')
    .replace(/&#x3c;/g, '<')
    .replace(/&#x3e;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

const EXTRACTION_PROMPT = `Analyze this medical AI model abstract and extract ALL available structured information. Return ONLY valid JSON.

Model: "{name}"
Abstract: "{description}"

Extract this comprehensive JSON structure (use null for missing values, empty arrays if no items found):
{
  "objective": "one sentence describing the main goal",

  "dataset": {
    "description": "brief description of data used",
    "totalSamples": number_or_null,
    "trainingSamples": number_or_null,
    "validationSamples": number_or_null,
    "testSamples": number_or_null,
    "details": [{"name": "dataset name", "total": number_or_null, "breakdown": [{"class": "class name", "count": number}]}],
    "source": "where data came from (hospital names, public datasets like TCGA, ImageNet, etc.)"
  },

  "methodology": {
    "approach": "main approach (e.g., Transfer Learning, End-to-end Training, Ensemble)",
    "architecture": "model architecture (e.g., ResNet-50, VGG-16, U-Net, Transformer, LSTM)",
    "baseModel": "pre-trained model used if transfer learning (e.g., ImageNet, RadImageNet)",
    "fineTuning": true/false/null,
    "segmentation": true/false/null,
    "classification": true/false/null,
    "detection": true/false/null,
    "parameters": "number of parameters if mentioned (e.g., '25M', '100M')",
    "techniques": ["technique1", "technique2"],
    "framework": "deep learning framework if mentioned (PyTorch, TensorFlow, Keras)"
  },

  "validation": {
    "type": "internal/external/both/cross-validation/null",
    "crossValidation": "k-fold number if mentioned (e.g., '5-fold', '10-fold')",
    "externalDataset": "name of external validation dataset if used",
    "prospective": true/false/null,
    "multiCenter": true/false/null,
    "comparisonWithExperts": true/false/null
  },

  "results": {
    "accuracy": number_as_percentage_or_null,
    "sensitivity": number_as_percentage_or_null,
    "specificity": number_as_percentage_or_null,
    "auc": number_between_0_and_1_or_null,
    "aucCI": "confidence interval if mentioned (e.g., '0.94-0.98')",
    "f1Score": number_or_null,
    "precision": number_or_null,
    "recall": number_or_null,
    "npv": number_or_null,
    "ppv": number_or_null,
    "diceScore": number_or_null,
    "iou": number_or_null,
    "summary": "brief results summary with key findings"
  },

  "clinicalImplications": ["implication1", "implication2"],
  "limitations": ["limitation1", "limitation2"],

  "modality": "imaging modality (CT/MRI/X-ray/Chest X-ray/Histopathology/Dermoscopy/ECG/Echocardiography/Ultrasound/Fundus/OCT/PET/PET-CT/Mammography/Endoscopy/Colonoscopy/etc.)",
  "bodyPart": "body part examined (e.g., chest, brain, heart, skin, eye, colon)",
  "targetCondition": "primary condition being detected/analyzed",
  "secondaryConditions": ["other conditions analyzed if any"]
}

IMPORTANT:
- Extract ALL metrics mentioned in the abstract
- For AUC, use decimal format (0.96 not 96%)
- For accuracy/sensitivity/specificity, use percentage (96.5 not 0.965)
- Return ONLY the JSON object, no markdown code blocks or explanations`;

async function extractMetadata(model: { id: string; name: string; description: string }) {
  // Decode HTML entities in the description
  const cleanDescription = decodeHtmlEntities(model.description);
  const cleanName = decodeHtmlEntities(model.name);

  const prompt = EXTRACTION_PROMPT
    .replace('{name}', cleanName)
    .replace('{description}', cleanDescription);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Clean the response - remove markdown code blocks if present
    let jsonStr = content.text.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    // Parse to validate JSON
    const metadata = JSON.parse(jsonStr);
    return metadata;
  } catch (error) {
    console.error(`Error extracting metadata for ${model.id}:`, error);
    return null;
  }
}

// Helper to safely extract numeric value
function getNumericValue(value: any): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  // If it's an object (e.g., multiple AUC values), try to get the first/highest value
  if (typeof value === 'object') {
    const values = Object.values(value).filter(v => typeof v === 'number') as number[];
    if (values.length > 0) {
      return Math.max(...values); // Return the highest value
    }
  }
  return null;
}

async function updateModelMetrics(modelId: string, results: any) {
  if (!results) return;

  const updates: any = {};

  const sensitivity = getNumericValue(results.sensitivity);
  if (sensitivity != null) {
    updates.sensitivity = sensitivity > 1 ? sensitivity / 100 : sensitivity;
  }

  const specificity = getNumericValue(results.specificity);
  if (specificity != null) {
    updates.specificity = specificity > 1 ? specificity / 100 : specificity;
  }

  const accuracy = getNumericValue(results.accuracy);
  if (accuracy != null) {
    updates.accuracy = accuracy > 1 ? accuracy / 100 : accuracy;
  }

  const auc = getNumericValue(results.auc);
  if (auc != null) {
    // AUC should be decimal (0.96), but handle if given as percentage
    updates.auc = auc > 1 ? auc / 100 : auc;
  }

  const f1Score = getNumericValue(results.f1Score);
  if (f1Score != null) {
    updates.f1Score = f1Score > 1 ? f1Score / 100 : f1Score;
  }

  const ppv = getNumericValue(results.ppv);
  if (ppv != null) {
    updates.ppv = ppv > 1 ? ppv / 100 : ppv;
  }

  const npv = getNumericValue(results.npv);
  if (npv != null) {
    updates.npv = npv > 1 ? npv / 100 : npv;
  }

  if (Object.keys(updates).length > 0) {
    try {
      await prisma.modelMetrics.upsert({
        where: { modelId },
        create: { modelId, ...updates },
        update: updates
      });
    } catch (error) {
      console.error(`  Warning: Could not update metrics for ${modelId}:`, error);
    }
  }
}

async function updateValidationInfo(modelId: string, validation: any) {
  if (!validation) return;

  const updates: any = {};

  if (validation.type && typeof validation.type === 'string') {
    updates.validationType = validation.type;
  }
  if (validation.externalDataset) {
    updates.externalValidation = true;
    // Convert array to string if needed
    if (Array.isArray(validation.externalDataset)) {
      updates.externalValidationSites = validation.externalDataset.join(', ');
    } else if (typeof validation.externalDataset === 'string') {
      updates.externalValidationSites = validation.externalDataset;
    }
  }
  if (validation.multiCenter) {
    updates.externalValidation = true;
  }

  if (Object.keys(updates).length > 0) {
    try {
      await prisma.validationInfo.upsert({
        where: { modelId },
        create: { modelId, ...updates },
        update: updates
      });
    } catch (error) {
      console.error(`  Warning: Could not update validation info for ${modelId}`);
    }
  }
}

async function main() {
  const batchSize = parseInt(process.env.BATCH_SIZE || '50');
  const startFrom = parseInt(process.env.START_FROM || '0');
  const reprocess = process.env.REPROCESS === 'true';

  console.log(`Starting extraction (batch size: ${batchSize}, starting from: ${startFrom}, reprocess: ${reprocess})`);

  // Get models to process
  const whereClause = reprocess ? {} : { metadata: null };
  const models = await prisma.medicalModel.findMany({
    where: whereClause,
    select: { id: true, name: true, description: true },
    skip: startFrom,
    take: batchSize
  });

  console.log(`Found ${models.length} models to process`);

  let processed = 0;
  let success = 0;
  let failed = 0;

  for (const model of models) {
    processed++;
    console.log(`[${processed}/${models.length}] Processing: ${model.name.substring(0, 50)}...`);

    const metadata = await extractMetadata(model);

    if (metadata) {
      // Save metadata
      await prisma.medicalModel.update({
        where: { id: model.id },
        data: { metadata: JSON.stringify(metadata) }
      });

      // Update metrics if available
      if (metadata.results) {
        await updateModelMetrics(model.id, metadata.results);
      }

      // Update validation info if available
      if (metadata.validation) {
        await updateValidationInfo(model.id, metadata.validation);
      }

      success++;
      console.log(`  ✓ Success`);
    } else {
      failed++;
      console.log(`  ✗ Failed`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\nCompleted: ${success} success, ${failed} failed out of ${processed} total`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
