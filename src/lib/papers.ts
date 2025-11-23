// Demo papers for medical AI research

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  year: number;
  doi?: string;
  arxivId?: string;
  citations: number;
  specialty: string;
  tags: string[];
  modelNames?: string[];
  datasetNames?: string[];
}

export const demoPapers: Paper[] = [
  {
    id: "1",
    title: "CheXNet: Radiologist-Level Pneumonia Detection on Chest X-Rays with Deep Learning",
    authors: ["Pranav Rajpurkar", "Jeremy Irvin", "Kaylie Zhu", "et al."],
    abstract: "We develop an algorithm that can detect pneumonia from chest X-rays at a level exceeding practicing radiologists. Our algorithm, CheXNet, is a 121-layer convolutional neural network trained on ChestX-ray14, currently the largest publicly available chest X-ray dataset.",
    journal: "arXiv preprint",
    year: 2017,
    arxivId: "1711.05225",
    citations: 3500,
    specialty: "Radiology",
    tags: ["chest-xray", "pneumonia", "deep-learning", "cnn"],
    modelNames: ["CheXNet"],
    datasetNames: ["ChestX-ray14"],
  },
  {
    id: "2",
    title: "Dermatologist-level classification of skin cancer with deep neural networks",
    authors: ["Andre Esteva", "Brett Kuprel", "Roberto A. Novoa", "et al."],
    abstract: "Here we demonstrate classification of skin lesions using a single CNN, trained end-to-end from images directly, using only pixels and disease labels as inputs. We train a CNN using a dataset of 129,450 clinical images.",
    journal: "Nature",
    year: 2017,
    doi: "10.1038/nature21056",
    citations: 4200,
    specialty: "Dermatology",
    tags: ["skin-cancer", "melanoma", "deep-learning", "classification"],
    datasetNames: ["ISIC"],
  },
  {
    id: "3",
    title: "Deep learning for chest radiograph diagnosis: A retrospective comparison of algorithms",
    authors: ["John R. Zech", "Marcus A. Badgeley", "Manway Liu", "et al."],
    abstract: "We compared the performance of a deep learning algorithm to practicing radiologists and other machine learning approaches for detecting clinically significant findings on chest radiographs.",
    journal: "PLOS Medicine",
    year: 2018,
    doi: "10.1371/journal.pmed.1002683",
    citations: 890,
    specialty: "Radiology",
    tags: ["chest-xray", "comparison", "validation", "deep-learning"],
    datasetNames: ["MIMIC-CXR", "CheXpert"],
  },
  {
    id: "4",
    title: "Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy",
    authors: ["Varun Gulshan", "Lily Peng", "Marc Coram", "et al."],
    abstract: "We created and validated a deep learning algorithm for automated detection of diabetic retinopathy and diabetic macular edema in retinal fundus photographs.",
    journal: "JAMA",
    year: 2016,
    doi: "10.1001/jama.2016.17216",
    citations: 3800,
    specialty: "Ophthalmology",
    tags: ["diabetic-retinopathy", "fundus", "screening", "deep-learning"],
  },
  {
    id: "5",
    title: "End-to-End Lung Cancer Screening with Three-dimensional Deep Learning on Low-Dose Chest CT",
    authors: ["Diego Ardila", "Atilla P. Kiraly", "Sujeeth Bharadwaj", "et al."],
    abstract: "We developed a deep learning algorithm that uses a patient's current and prior computed tomography volumes to predict the risk of lung cancer. The model achieves state-of-the-art performance.",
    journal: "Nature Medicine",
    year: 2019,
    doi: "10.1038/s41591-019-0447-x",
    citations: 1500,
    specialty: "Radiology",
    tags: ["lung-cancer", "ct-scan", "screening", "3d-cnn"],
  },
  {
    id: "6",
    title: "Cardiologist-level arrhythmia detection and classification in ambulatory electrocardiograms using a deep neural network",
    authors: ["Awni Y. Hannun", "Pranav Rajpurkar", "Masoumeh Haghpanahi", "et al."],
    abstract: "We develop a deep neural network to classify 12 rhythm classes using 91,232 single-lead ECGs from 53,549 patients who used a single-lead ambulatory ECG monitoring device.",
    journal: "Nature Medicine",
    year: 2019,
    doi: "10.1038/s41591-018-0268-3",
    citations: 1800,
    specialty: "Cardiology",
    tags: ["ecg", "arrhythmia", "deep-learning", "classification"],
  },
];

export const paperSpecialties = [
  "Radiology", "Dermatology", "Cardiology", "Ophthalmology",
  "Pathology", "Neurology", "Oncology"
];
