// Demo data for medical AI models

export interface MedicalModel {
  id: string;
  name: string;
  slug: string;
  organization: string;
  description: string;
  specialty: string;
  useCase: string;
  version: string;
  architecture?: string;
  journal?: string;
  metrics: {
    sensitivity: number;
    specificity: number;
    auc: number;
    accuracy: number;
  };
  training: {
    datasetSize: number;
    datasetSource: string;
    diversity: string;
  };
  validation: {
    publications: number;
    publicationLinks?: { title: string; url: string; source: string }[];
    clinicalTrials: number;
    externalValidation: boolean;
    validationType: "retrospective" | "prospective" | "both";
  };
  regulatory: {
    fdaApproved: boolean;
    ceMark: boolean;
    gdprCompliant: boolean;
  };
  practical: {
    accessType: "open-source" | "api" | "commercial" | "research-only";
    cost: string;
    hardwareRequirements: string;
    hasSupport: boolean;
  };
  downloads: number;
  likes: number;
  updatedAt: string;
  tags: string[];
}

export type Model = MedicalModel;

export const specialties = [
  "Cardiology", "Radiology", "Neurology", "Ophthalmology",
  "Oncology", "Pathology", "Gastroenterology", "Pulmonology", "Dermatology",
];

export const useCases = [
  "Diagnosis", "Screening", "Segmentation", "Prognosis",
  "Treatment Planning", "Risk Assessment", "Image Enhancement",
];

export const demoModels: MedicalModel[] = [
  {
    id: "1",
    name: "ChestX-Ray Classifier",
    slug: "chestx-ray-classifier",
    organization: "Stanford AIMI",
    description: "Deep learning model for detecting 14 thoracic pathologies from chest X-rays. Trained on CheXpert dataset with expert radiologist annotations.",
    specialty: "Radiology",
    useCase: "Diagnosis",
    version: "2.1.0",
    metrics: { sensitivity: 0.94, specificity: 0.91, auc: 0.96, accuracy: 0.92 },
    training: { datasetSize: 224316, datasetSource: "CheXpert", diversity: "Multi-center, US population" },
    validation: {
      publications: 12,
      publicationLinks: [
        { title: "CheXpert: A Large Chest Radiograph Dataset with Uncertainty Labels and Expert Comparison", url: "https://arxiv.org/abs/1901.07031", source: "AAAI" },
        { title: "Deep learning for chest radiograph diagnosis: A retrospective comparison of the CheXNeXt algorithm to practicing radiologists", url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1002686", source: "PLOS Medicine" }
      ],
      clinicalTrials: 2,
      externalValidation: true,
      validationType: "both"
    },
    regulatory: { fdaApproved: true, ceMark: true, gdprCompliant: true },
    practical: { accessType: "open-source", cost: "Free", hardwareRequirements: "GPU recommended (4GB+ VRAM)", hasSupport: true },
    downloads: 45230, likes: 892, updatedAt: "2024-11-15",
    tags: ["chest-xray", "thoracic", "pneumonia", "covid-19", "deep-learning"],
  },
  {
    id: "2",
    name: "DermAI Vision",
    slug: "dermai-vision",
    organization: "SkinTech Labs",
    description: "State-of-the-art skin lesion classifier capable of detecting melanoma and 6 other skin conditions with dermatologist-level accuracy.",
    specialty: "Dermatology",
    useCase: "Screening",
    version: "3.0.2",
    metrics: { sensitivity: 0.96, specificity: 0.89, auc: 0.94, accuracy: 0.91 },
    training: { datasetSize: 129450, datasetSource: "ISIC Archive + Clinical", diversity: "Global, Fitzpatrick I-VI" },
    validation: {
      publications: 8,
      publicationLinks: [
        { title: "Dermatologist-level classification of skin cancer with deep neural networks", url: "https://www.nature.com/articles/nature21056", source: "Nature" }
      ],
      clinicalTrials: 3,
      externalValidation: true,
      validationType: "prospective"
    },
    regulatory: { fdaApproved: true, ceMark: true, gdprCompliant: true },
    practical: { accessType: "api", cost: "$0.05/prediction", hardwareRequirements: "Cloud-based", hasSupport: true },
    downloads: 28450, likes: 654, updatedAt: "2024-10-28",
    tags: ["dermatology", "melanoma", "skin-cancer", "screening"],
  },
  {
    id: "3",
    name: "CardioRisk AI",
    slug: "cardiorisk-ai",
    organization: "HeartHealth Institute",
    description: "ECG-based deep learning model for predicting 5-year cardiovascular event risk and detecting arrhythmias.",
    specialty: "Cardiology",
    useCase: "Risk Assessment",
    version: "1.5.0",
    metrics: { sensitivity: 0.88, specificity: 0.92, auc: 0.91, accuracy: 0.90 },
    training: { datasetSize: 1200000, datasetSource: "UK Biobank + Partners", diversity: "European population bias" },
    validation: {
      publications: 5,
      publicationLinks: [
        { title: "Prediction of cardiovascular risk from electrocardiograms", url: "#", source: "New England Journal of Medicine" }
      ],
      clinicalTrials: 1,
      externalValidation: true,
      validationType: "retrospective"
    },
    regulatory: { fdaApproved: false, ceMark: true, gdprCompliant: true },
    practical: { accessType: "commercial", cost: "Enterprise pricing", hardwareRequirements: "Standard CPU", hasSupport: true },
    downloads: 12340, likes: 423, updatedAt: "2024-11-01",
    tags: ["ecg", "cardiology", "arrhythmia", "risk-prediction"],
  },
  {
    id: "4",
    name: "RetinaNet Glaucoma",
    slug: "retinanet-glaucoma",
    organization: "Google Health",
    description: "Fundus image analysis model for early glaucoma detection and optic disc/cup segmentation.",
    specialty: "Ophthalmology",
    useCase: "Screening",
    version: "4.2.1",
    metrics: { sensitivity: 0.95, specificity: 0.93, auc: 0.97, accuracy: 0.94 },
    training: { datasetSize: 88000, datasetSource: "EyePACS + Indian clinics", diversity: "Multi-ethnic, global" },
    validation: {
      publications: 15,
      publicationLinks: [
        { title: "A deep learning algorithm for detection of diabetic retinopathy in retinal fundus photographs", url: "https://jamanetwork.com/journals/jama/fullarticle/2588763", source: "JAMA" }
      ],
      clinicalTrials: 4,
      externalValidation: true,
      validationType: "both"
    },
    regulatory: { fdaApproved: true, ceMark: true, gdprCompliant: true },
    practical: { accessType: "api", cost: "$0.10/image", hardwareRequirements: "Cloud-based", hasSupport: true },
    downloads: 67800, likes: 1203, updatedAt: "2024-11-10",
    tags: ["ophthalmology", "glaucoma", "fundus", "retina", "segmentation"],
  },
  {
    id: "5",
    name: "PathologyGPT",
    slug: "pathologygpt",
    organization: "PathAI",
    description: "Multimodal foundation model for digital pathology, supporting whole-slide image analysis across multiple cancer types.",
    specialty: "Pathology",
    useCase: "Diagnosis",
    version: "1.0.0",
    metrics: { sensitivity: 0.92, specificity: 0.94, auc: 0.95, accuracy: 0.93 },
    training: { datasetSize: 500000, datasetSource: "TCGA + Clinical partners", diversity: "Pan-cancer, multi-center" },
    validation: {
      publications: 3,
      publicationLinks: [],
      clinicalTrials: 0,
      externalValidation: false,
      validationType: "retrospective"
    },
    regulatory: { fdaApproved: false, ceMark: false, gdprCompliant: true },
    practical: { accessType: "research-only", cost: "Free for research", hardwareRequirements: "High-end GPU (24GB+ VRAM)", hasSupport: false },
    downloads: 8920, likes: 567, updatedAt: "2024-11-18",
    tags: ["pathology", "wsi", "cancer", "foundation-model", "multimodal"],
  },
  {
    id: "6",
    name: "BrainTumor Segmentor",
    slug: "braintumor-segmentor",
    organization: "NVIDIA Clara",
    description: "3D U-Net based model for automatic brain tumor segmentation from MRI scans (T1, T2, FLAIR sequences).",
    specialty: "Radiology",
    useCase: "Segmentation",
    version: "2.3.0",
    metrics: { sensitivity: 0.91, specificity: 0.96, auc: 0.94, accuracy: 0.93 },
    training: { datasetSize: 2000, datasetSource: "BraTS Challenge", diversity: "Multi-institutional" },
    validation: {
      publications: 20,
      publicationLinks: [
        { title: "The Multimodal Brain Tumor Image Segmentation Benchmark (BRATS)", url: "https://ieeexplore.ieee.org/document/6975210", source: "IEEE TMI" }
      ],
      clinicalTrials: 1,
      externalValidation: true,
      validationType: "retrospective"
    },
    regulatory: { fdaApproved: false, ceMark: true, gdprCompliant: true },
    practical: { accessType: "open-source", cost: "Free", hardwareRequirements: "GPU required (8GB+ VRAM)", hasSupport: true },
    downloads: 34560, likes: 789, updatedAt: "2024-09-20",
    tags: ["mri", "brain-tumor", "segmentation", "glioma", "3d-unet"],
  },
];

export function getModelBySlug(slug: string): MedicalModel | undefined {
  return demoModels.find((m) => m.slug === slug);
}

export function searchModels(query: string): MedicalModel[] {
  const q = query.toLowerCase();
  return demoModels.filter(
    (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) ||
      m.specialty.toLowerCase().includes(q) || m.tags.some((t) => t.includes(q))
  );
}
