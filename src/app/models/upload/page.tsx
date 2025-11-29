
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

interface Specialty {
    id: string;
    name: string;
}

interface UseCase {
    id: string;
    name: string;
}

export default function UploadPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [useCases, setUseCases] = useState<UseCase[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        version: "1.0.0",
        description: "",
        specialtyId: "",
        useCaseId: "",
        repositoryUrl: "",
        documentationUrl: "",
    });

    useEffect(() => {
        // Fetch specialties and use cases for the dropdowns
        // In a real app, these would be separate API calls or passed as props
        // For MVP, we'll fetch from a hypothetical API or just hardcode if API not ready
        // Let's try to fetch if we had endpoints, but for now we might need to rely on what's available.
        // Since we don't have dedicated endpoints for these yet, let's assume we might need to add them or
        // just use some common ones if the DB is seeded.
        // To make this robust, let's fetch from a new helper endpoint or just use empty and let user know.

        // Actually, let's just fetch them. We can add a simple GET to /api/models/metadata later or now.
        // For now, let's just hardcode some IDs if we can't fetch, OR better, let's fetch from the data.ts if it was an API.
        // But since we are in client component, we need an API.
        // Let's skip fetching for a second and just show a "Loading..." or similar if we were doing it right.
        // To unblock, I will create a simple server action or API route for metadata, OR just hardcode for the MVP demo if the user hasn't seeded.
        // Wait, the user has a seed.ts. Let's assume there are some in DB.

        async function fetchData() {
            // This is a placeholder. In a real implementation we need endpoints for these.
            // For this MVP step, I will create a quick API endpoint for metadata next.
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to create model");
            }

            const model = await res.json();
            router.push(`/models/${model.slug}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background bg-dot-grid container max-w-2xl py-10">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Upload a Model</h1>
                    <p className="text-muted-foreground">
                        Share your medical AI model with the community.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Model Name
                            </label>
                            <input
                                id="name"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. Chest X-Ray Pneumonia Detector"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="version" className="text-sm font-medium">
                                Version
                            </label>
                            <input
                                id="version"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="1.0.0"
                                value={formData.version}
                                onChange={(e) =>
                                    setFormData({ ...formData, version: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                required
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe what your model does, its intended use cases, and limitations."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="specialty" className="text-sm font-medium">
                                    Specialty ID (Temporary)
                                </label>
                                <input
                                    id="specialty"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter ID from DB"
                                    value={formData.specialtyId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, specialtyId: e.target.value })
                                    }
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    For MVP, please enter a valid Specialty ID.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="useCase" className="text-sm font-medium">
                                    Use Case ID (Temporary)
                                </label>
                                <input
                                    id="useCase"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter ID from DB"
                                    value={formData.useCaseId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, useCaseId: e.target.value })
                                    }
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    For MVP, please enter a valid Use Case ID.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="repo" className="text-sm font-medium">
                                Repository URL
                            </label>
                            <input
                                id="repo"
                                type="url"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="https://github.com/username/repo"
                                value={formData.repositoryUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, repositoryUrl: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="docs" className="text-sm font-medium">
                                Documentation URL
                            </label>
                            <input
                                id="docs"
                                type="url"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="https://..."
                                value={formData.documentationUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, documentationUrl: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Model...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Model
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
