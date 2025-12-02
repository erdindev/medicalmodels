/**
 * Hugging Face Medical Models Scraper
 *
 * Fetches medical/healthcare AI models from Hugging Face API
 * and stores them in the database.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface HFModel {
  id: string;
  modelId: string;
  likes: number;
  downloads: number;
  tags: string[];
  pipeline_tag?: string;
  library_name?: string;
  createdAt: string;
  private: boolean;
}

interface HFModelDetails {
  id: string;
  modelId: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  gated: boolean;
  pipeline_tag?: string;
  tags: string[];
  downloads: number;
  likes: number;
  library_name?: string;
  cardData?: {
    license?: string;
    datasets?: string[];
    metrics?: { name: string; type: string; value: number }[];
    model_name?: string;
    base_model?: string;
  };
  siblings?: { rfilename: string }[];
}

// Medical-related search terms
const MEDICAL_SEARCHES = [
  'medical',
  'clinical',
  'healthcare',
  'radiology',
  'pathology',
  'x-ray',
  'ct-scan',
  'mri',
  'ultrasound',
  'ecg',
  'eeg',
  'diagnosis',
  'biomedical',
  'chest-xray',
  'skin-lesion',
  'retinal',
  'mammography',
  'covid',
  'tumor',
  'cancer',
  'pneumonia',
  'diabetic-retinopathy',
];

// Map HF pipeline tags to our specialties
const PIPELINE_TO_SPECIALTY: Record<string, string> = {
  'image-classification': 'Radiology',
  'image-segmentation': 'Radiology',
  'object-detection': 'Radiology',
  'image-to-text': 'Radiology',
  'text-classification': 'General Medicine',
  'text-generation': 'General Medicine',
  'question-answering': 'General Medicine',
  'fill-mask': 'General Medicine',
};

// Map tags to specialties
const TAG_TO_SPECIALTY: Record<string, string> = {
  'radiology': 'Radiology',
  'pathology': 'Pathology',
  'dermatology': 'Dermatology',
  'ophthalmology': 'Ophthalmology',
  'cardiology': 'Cardiology',
  'neurology': 'Neurology',
  'oncology': 'Oncology',
  'pulmonology': 'Pulmonology',
  'x-ray': 'Radiology',
  'ct': 'Radiology',
  'mri': 'Radiology',
  'ultrasound': 'Radiology',
  'ecg': 'Cardiology',
  'eeg': 'Neurology',
  'retinal': 'Ophthalmology',
  'fundus': 'Ophthalmology',
  'skin': 'Dermatology',
  'chest': 'Pulmonology',
  'brain': 'Neurology',
  'heart': 'Cardiology',
  'cancer': 'Oncology',
  'tumor': 'Oncology',
};

async function fetchModels(search: string, limit = 100): Promise<HFModel[]> {
  const url = `https://huggingface.co/api/models?search=${encodeURIComponent(search)}&limit=${limit}&sort=downloads&direction=-1`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch models for "${search}": ${response.status}`);
    return [];
  }

  return response.json();
}

async function fetchModelDetails(modelId: string): Promise<HFModelDetails | null> {
  const url = `https://huggingface.co/api/models/${modelId}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch details for "${modelId}": ${response.status}`);
    return null;
  }

  return response.json();
}

function inferSpecialty(model: HFModel): string {
  // Check tags first
  for (const tag of model.tags) {
    const tagLower = tag.toLowerCase();
    for (const [keyword, specialty] of Object.entries(TAG_TO_SPECIALTY)) {
      if (tagLower.includes(keyword)) {
        return specialty;
      }
    }
  }

  // Check pipeline tag
  if (model.pipeline_tag && PIPELINE_TO_SPECIALTY[model.pipeline_tag]) {
    return PIPELINE_TO_SPECIALTY[model.pipeline_tag];
  }

  // Check model ID
  const idLower = model.modelId.toLowerCase();
  for (const [keyword, specialty] of Object.entries(TAG_TO_SPECIALTY)) {
    if (idLower.includes(keyword)) {
      return specialty;
    }
  }

  return 'General Medicine';
}

function inferModality(model: HFModel): string {
  const tags = model.tags.map(t => t.toLowerCase()).join(' ');
  const id = model.modelId.toLowerCase();
  const combined = `${tags} ${id}`;

  if (combined.includes('x-ray') || combined.includes('xray') || combined.includes('chest')) {
    return 'X-ray';
  }
  if (combined.includes('ct') || combined.includes('computed tomography')) {
    return 'CT';
  }
  if (combined.includes('mri') || combined.includes('magnetic resonance')) {
    return 'MRI';
  }
  if (combined.includes('ultrasound') || combined.includes('echo')) {
    return 'Ultrasound';
  }
  if (combined.includes('ecg') || combined.includes('electrocardiogram')) {
    return 'ECG';
  }
  if (combined.includes('eeg') || combined.includes('electroencephalogram')) {
    return 'EEG';
  }
  if (combined.includes('pathology') || combined.includes('histopathology') || combined.includes('microscopy')) {
    return 'Histopathology';
  }
  if (combined.includes('retinal') || combined.includes('fundus') || combined.includes('oct')) {
    return 'Fundus Photography';
  }
  if (combined.includes('dermoscopy') || combined.includes('skin')) {
    return 'Dermoscopy';
  }
  if (combined.includes('mammograph')) {
    return 'Mammography';
  }
  if (combined.includes('text') || combined.includes('nlp') || combined.includes('bert')) {
    return 'Clinical Text/NLP';
  }

  return 'Medical Imaging';
}

function generateSlug(modelId: string): string {
  return modelId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

async function getOrCreateSpecialty(name: string): Promise<string> {
  let specialty = await prisma.specialty.findFirst({
    where: { name }
  });

  if (!specialty) {
    specialty = await prisma.specialty.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `${name} related AI models`
      }
    });
  }

  return specialty.id;
}

async function getOrCreateUseCase(name: string): Promise<string> {
  let useCase = await prisma.useCase.findFirst({
    where: { name }
  });

  if (!useCase) {
    useCase = await prisma.useCase.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `${name} AI models`
      }
    });
  }

  return useCase.id;
}

async function processModel(model: HFModel): Promise<boolean> {
  const slug = `hf-${generateSlug(model.modelId)}`;

  // Check if already exists
  const existing = await prisma.medicalModel.findUnique({
    where: { slug }
  });

  if (existing) {
    return false; // Skip existing
  }

  // Infer specialty and modality
  const specialtyName = inferSpecialty(model);
  const modality = inferModality(model);
  const specialtyId = await getOrCreateSpecialty(specialtyName);

  // Determine use case from pipeline tag
  let useCaseName = 'Classification';
  if (model.pipeline_tag?.includes('segmentation')) {
    useCaseName = 'Segmentation';
  } else if (model.pipeline_tag?.includes('detection')) {
    useCaseName = 'Detection';
  } else if (model.pipeline_tag?.includes('generation') || model.pipeline_tag?.includes('text')) {
    useCaseName = 'Text Analysis';
  }
  const useCaseId = await getOrCreateUseCase(useCaseName);

  // Extract architecture from tags or model ID
  let architecture = model.library_name || 'Unknown';
  for (const tag of model.tags) {
    if (['resnet', 'vit', 'bert', 'gpt', 'llama', 'efficientnet', 'unet', 'yolo', 'detr', 'swin', 'convnext'].some(a => tag.toLowerCase().includes(a))) {
      architecture = tag;
      break;
    }
  }

  // Build metadata
  const metadata = {
    source: 'huggingface',
    huggingfaceId: model.modelId,
    modality,
    methodology: {
      architecture,
      framework: model.library_name,
    },
    downloads: model.downloads,
    likes: model.likes,
    tags: model.tags,
  };

  // Create the model
  const created = await prisma.medicalModel.create({
    data: {
      name: model.modelId.split('/').pop() || model.modelId,
      slug,
      version: '1.0',
      description: `Hugging Face model: ${model.modelId}. Tags: ${model.tags.slice(0, 10).join(', ')}`,
      architecture,
      specialtyId,
      useCaseId,
      downloads: model.downloads,
      likes: model.likes,
      metadata: JSON.stringify(metadata),
      publishedAt: new Date(model.createdAt),
      validation: {
        create: {
          publicationLinks: JSON.stringify([
            { url: `https://huggingface.co/${model.modelId}`, type: 'huggingface' }
          ]),
          peerReviewed: false,
        }
      }
    }
  });

  console.log(`✓ Created: ${created.name}`);
  return true;
}

async function main() {
  console.log('🔍 Fetching medical models from Hugging Face...\n');

  const allModels = new Map<string, HFModel>();

  // Fetch models for each search term
  for (const search of MEDICAL_SEARCHES) {
    console.log(`Searching: "${search}"...`);
    const models = await fetchModels(search, 50);

    for (const model of models) {
      if (!model.private && !allModels.has(model.modelId)) {
        allModels.set(model.modelId, model);
      }
    }

    // Rate limiting - 2 seconds between requests
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n📊 Found ${allModels.size} unique models\n`);

  // Process each model
  let created = 0;
  let skipped = 0;

  for (const model of allModels.values()) {
    try {
      const wasCreated = await processModel(model);
      if (wasCreated) {
        created++;
      } else {
        skipped++;
      }

      // Rate limiting
      await new Promise(r => setTimeout(r, 100));
    } catch (error) {
      console.error(`✗ Error processing ${model.modelId}:`, error);
    }
  }

  console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
