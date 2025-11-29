import Link from "next/link";
import { type Model } from "@/lib/data";

interface ModelsGridProps {
    models: Model[];
}

export function ModelsGrid({ models }: ModelsGridProps) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{models.length} models</p>
                <Link href="/compare" className="text-sm text-primary hover:underline">
                    Compare models
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {models.map((model) => (
                    <Link
                        key={model.id}
                        href={`/models/${model.slug}`}
                        className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40"
                    >
                        <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-foreground group-hover:text-primary">
                                    {model.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{model.specialty}</p>
                            </div>
                            <div className="ml-3 text-right">
                                <p className="text-lg font-semibold text-primary">{(model.metrics.auc * 100).toFixed(0)}%</p>
                                <p className="text-xs text-muted-foreground">AUC</p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{(model.metrics.sensitivity * 100).toFixed(0)}% sens</span>
                            <span>{(model.metrics.specificity * 100).toFixed(0)}% spec</span>
                            {model.regulatory.fdaApproved && (
                                <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700">FDA</span>
                            )}
                            {model.validation.externalValidation && (
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">validated</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
