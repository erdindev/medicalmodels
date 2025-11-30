import { Metadata } from "next";
import { DatasetCard, Dataset } from "@/components/datasets/dataset-card";
import { Search } from "lucide-react";

export const metadata: Metadata = {
    title: "Medical Datasets | MedicalModels",
    description: "Explore and download high-quality medical datasets contributed by the community.",
};

// Mock data for datasets
const MOCK_DATASETS: Dataset[] = [
    {
        id: "1",
        title: "Chest X-Ray Pneumonia",
        description: "A dataset of 5,863 X-Ray images (JPEG) and 2 categories (Pneumonia/Normal). Selected from retrospective cohorts of pediatric patients.",
        author: "Kermany et al.",
        size: "1.2 GB",
        modality: "X-Ray",
        license: "CC BY 4.0",
        downloadUrl: "https://data.mendeley.com/datasets/rscbjbr9sj/2",
        updatedAt: "2024-01-15",
        likes: 1240,
        downloads: 5430,
    },
    {
        id: "2",
        title: "Brain MRI Segmentation",
        description: "This dataset contains 110 patients with MRI images and manual segmentation masks for brain tumors.",
        author: "Mateusz Buda",
        size: "850 MB",
        modality: "MRI",
        license: "CC0",
        downloadUrl: "https://www.kaggle.com/datasets/mateuszbuda/lgg-mri-segmentation",
        updatedAt: "2023-11-20",
        likes: 890,
        downloads: 3200,
    },
    {
        id: "3",
        title: "Skin Cancer MNIST: HAM10000",
        description: "A large collection of multi-source dermatoscopic images of common pigmented skin lesions.",
        author: "Tschandl et al.",
        size: "2.8 GB",
        modality: "Dermoscopy",
        license: "CC BY-NC 4.0",
        downloadUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/DBW86T",
        updatedAt: "2024-02-01",
        likes: 2100,
        downloads: 8900,
    },
    {
        id: "4",
        title: "CT-KIDNEY-DATASET-Normal-Cyst-Tumor-Stone",
        description: "12,446 CT images of whole abdomen and cropped images of kidney with Normal, Cyst, Tumor and Stone findings.",
        author: "Islam et al.",
        size: "3.5 GB",
        modality: "CT",
        license: "CC BY 4.0",
        downloadUrl: "https://www.kaggle.com/datasets/nazmul0087/ct-kidney-dataset-normal-cyst-tumor-stone",
        updatedAt: "2024-03-10",
        likes: 450,
        downloads: 1200,
    },
    {
        id: "5",
        title: "Diabetic Retinopathy Detection",
        description: "A large set of high-resolution retina images taken under a variety of imaging conditions.",
        author: "EyePACS",
        size: "82 GB",
        modality: "Fundus Photography",
        license: "Custom",
        downloadUrl: "https://www.kaggle.com/c/diabetic-retinopathy-detection/data",
        updatedAt: "2023-12-05",
        likes: 3400,
        downloads: 15000,
    },
    {
        id: "6",
        title: "COVID-19 Radiography Database",
        description: "A team of researchers from Qatar University, Doha, Qatar, and the University of Dhaka, Bangladesh along with their collaborators from Malaysia, Italy, and Pakistan have created a database of chest X-ray images for COVID-19 positive cases along with Normal and Viral Pneumonia images.",
        author: "Chowdhury et al.",
        size: "780 MB",
        modality: "X-Ray",
        license: "CC BY 4.0",
        downloadUrl: "https://www.kaggle.com/datasets/tawsifurrahman/covid19-radiography-database",
        updatedAt: "2024-01-20",
        likes: 1800,
        downloads: 6700,
    },
];

export default function DatasetsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Medical Datasets
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover and download high-quality medical datasets contributed by the community for research and development.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl mx-auto">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-lg border border-input py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="Search datasets by name, modality, or author..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {MOCK_DATASETS.map((dataset) => (
                        <DatasetCard key={dataset.id} dataset={dataset} />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                        Have a dataset to share?
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Contribute to the medical AI community by sharing your curated datasets.
                    </p>
                    <button className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                        Submit a Dataset
                    </button>
                </div>
            </div>
        </div>
    );
}
