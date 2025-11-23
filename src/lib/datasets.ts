// Demo datasets for medical AI research

export interface Dataset {
  id: string;
  name: string;
  slug: string;
  description: string;
  organization: string;
  modality: string;
  specialty: string;
  size: {
    samples: number;
    sizeGB?: number;
  };
  access: "open" | "restricted" | "commercial";
  license: string;
  annotations: string[];
  demographics?: {
    regions: string[];
    ageRange?: string;
  };
  publications: number;
  url?: string;
  updatedAt: string;
}

export const demoDatasets: Dataset[] = [
  {
    id: "1",
    name: "CheXpert",
    slug: "chexpert",
    description: "Large dataset of chest X-rays with uncertainty labels and radiologist annotations for 14 observations.",
    organization: "Stanford ML Group",
    modality: "X-Ray",
    specialty: "Radiology",
    size: { samples: 224316, sizeGB: 439 },
    access: "open",
    license: "Stanford CheXpert License",
    annotations: ["Multi-label", "Uncertainty labels", "Radiologist validated"],
    demographics: { regions: ["United States"], ageRange: "18-90" },
    publications: 500,
    updatedAt: "2024-06-15",
  },
  {
    id: "2",
    name: "ISIC Archive",
    slug: "isic-archive",
    description: "International Skin Imaging Collaboration archive containing dermoscopic images of skin lesions.",
    organization: "ISIC Consortium",
    modality: "Dermoscopy",
    specialty: "Dermatology",
    size: { samples: 70000, sizeGB: 85 },
    access: "open",
    license: "CC BY-NC 4.0",
    annotations: ["Diagnosis", "Segmentation masks", "Metadata"],
    demographics: { regions: ["Global"], ageRange: "All ages" },
    publications: 300,
    updatedAt: "2024-09-01",
  },
  {
    id: "3",
    name: "MIMIC-CXR",
    slug: "mimic-cxr",
    description: "Large publicly available database of chest radiographs with free-text radiology reports.",
    organization: "MIT / Beth Israel",
    modality: "X-Ray",
    specialty: "Radiology",
    size: { samples: 377110, sizeGB: 4700 },
    access: "restricted",
    license: "PhysioNet Credentialed",
    annotations: ["Free-text reports", "DICOM metadata", "NLP labels"],
    demographics: { regions: ["United States"] },
    publications: 400,
    updatedAt: "2024-03-20",
  },
  {
    id: "4",
    name: "UK Biobank Imaging",
    slug: "uk-biobank",
    description: "Large-scale biomedical database with MRI, DXA, and other imaging modalities linked to genetic and health data.",
    organization: "UK Biobank",
    modality: "MRI / Multi-modal",
    specialty: "Multi-specialty",
    size: { samples: 100000 },
    access: "restricted",
    license: "UK Biobank Access",
    annotations: ["Phenotype data", "Genetic data", "Longitudinal"],
    demographics: { regions: ["United Kingdom"], ageRange: "40-69" },
    publications: 2000,
    updatedAt: "2024-10-01",
  },
  {
    id: "5",
    name: "BraTS Challenge",
    slug: "brats",
    description: "Brain Tumor Segmentation challenge dataset with multi-modal MRI scans and expert segmentations.",
    organization: "CBICA / UPenn",
    modality: "MRI",
    specialty: "Radiology",
    size: { samples: 2000, sizeGB: 150 },
    access: "open",
    license: "CC BY 4.0",
    annotations: ["Tumor segmentation", "Multi-sequence", "Expert validated"],
    demographics: { regions: ["Global"] },
    publications: 800,
    updatedAt: "2024-07-15",
  },
  {
    id: "6",
    name: "TCGA - The Cancer Genome Atlas",
    slug: "tcga",
    description: "Comprehensive multi-dimensional maps of genomic changes in 33 types of cancer with pathology images.",
    organization: "NCI / NIH",
    modality: "Histopathology",
    specialty: "Pathology",
    size: { samples: 30000 },
    access: "open",
    license: "Open Access",
    annotations: ["Genomic data", "Clinical outcomes", "Whole-slide images"],
    demographics: { regions: ["Global"] },
    publications: 5000,
    updatedAt: "2024-01-10",
  },
];

export const modalities = [
  "X-Ray", "MRI", "CT", "Dermoscopy", "Histopathology",
  "Fundus", "OCT", "Ultrasound", "ECG", "Multi-modal"
];

export const accessTypes = ["open", "restricted", "commercial"];
