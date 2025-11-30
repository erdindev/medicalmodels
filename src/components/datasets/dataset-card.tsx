"use client";

import Link from "next/link";
import { Download, Database, FileText, ExternalLink, User } from "lucide-react";

export interface Dataset {
    id: string;
    title: string;
    description: string;
    author: string;
    size: string;
    modality: string;
    license: string;
    downloadUrl: string;
    updatedAt: string;
    likes: number;
    downloads: number;
}

interface DatasetCardProps {
    dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div>
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Database className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground line-clamp-1">
                                {dataset.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{dataset.author}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {dataset.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {dataset.modality}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {dataset.size}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {dataset.license}
                    </span>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {dataset.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                        Updated {dataset.updatedAt}
                    </span>
                </div>

                <Link
                    href={dataset.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    Download
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}
