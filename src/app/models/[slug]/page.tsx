import { notFound } from "next/navigation";
import { getModelBySlug, demoModels } from "@/lib/data";
import Link from "next/link";

export function generateStaticParams() {
  return demoModels.map((model) => ({
    slug: model.slug,
  }));
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/models" className="hover:text-foreground">Models</Link>
            <span>/</span>
            <span className="text-foreground">{model.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground">{model.name}</h1>
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                      v{model.version}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{model.organization}</p>
                </div>
                <div className="flex gap-2">
                  {model.regulatory.fdaApproved && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">FDA</span>
                  )}
                  {model.regulatory.ceMark && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">CE</span>
                  )}
                  {model.regulatory.gdprCompliant && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">GDPR</span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-foreground">{model.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {model.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <MetricCard label="Sensitivity" value={model.metrics.sensitivity} isPercent />
                <MetricCard label="Specificity" value={model.metrics.specificity} isPercent />
                <MetricCard label="AUC" value={model.metrics.auc} />
                <MetricCard label="Accuracy" value={model.metrics.accuracy} isPercent />
              </div>

              {/* Placeholder for ROC Curve */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">ROC CURVE</h3>
                <div className="aspect-square max-w-md rounded-lg bg-secondary/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <svg className="mx-auto h-12 w-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p className="text-sm">ROC Curve Visualization</p>
                    <p className="text-xs mt-1">AUC: {model.metrics.auc.toFixed(3)}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Training Data */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Training Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Dataset Size</p>
                  <p className="text-2xl font-bold text-foreground">{model.training.datasetSize.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="text-lg font-semibold text-foreground">{model.training.datasetSource}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diversity</p>
                  <p className="text-sm text-foreground">{model.training.diversity}</p>
                </div>
              </div>
            </section>

            {/* Validation */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Validation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Publications</p>
                  <p className="text-2xl font-bold text-foreground">{model.validation.publications}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clinical Trials</p>
                  <p className="text-2xl font-bold text-foreground">{model.validation.clinicalTrials}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Validation Type</p>
                  <p className="text-lg font-semibold text-foreground capitalize">{model.validation.validationType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">External Validation</p>
                  <p className="text-lg font-semibold text-foreground">{model.validation.externalValidation ? "Yes" : "No"}</p>
                </div>
              </div>

              {/* Publication Links */}
              {model.validation.publicationLinks && model.validation.publicationLinks.length > 0 && (
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">KEY PUBLICATIONS</h3>
                  <div className="space-y-3">
                    {model.validation.publicationLinks.map((pub, idx) => (
                      <a
                        key={idx}
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50 group"
                      >
                        <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                            {pub.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {pub.source} • <span className="underline">Read Paper</span>
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Bias Analysis Placeholder */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Bias Analysis</h2>
              <div className="rounded-lg bg-secondary/50 p-8 text-center">
                <p className="text-muted-foreground">Bias analysis data will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">Population, Gender, Age subgroup performance</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-semibold text-foreground">{model.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-semibold text-foreground">{model.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-semibold text-foreground">{model.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Access Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Implementation</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Access Type</p>
                  <p className="font-semibold text-foreground capitalize">{model.practical.accessType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-semibold text-foreground">{model.practical.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hardware</p>
                  <p className="text-sm text-foreground">{model.practical.hardwareRequirements}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Support</p>
                  <p className="font-semibold text-foreground">{model.practical.hasSupport ? "Available" : "Community only"}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={`/compare?models=${model.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Compare with other models
              </Link>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 font-medium text-foreground hover:bg-secondary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save to Collection
              </button>
            </div>

            {/* Specialty & Use Case */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Classification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Specialty</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{model.specialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Use Case</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">{model.useCase}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, isPercent = false }: { label: string; value: number; isPercent?: boolean }) {
  const displayValue = isPercent ? `${(value * 100).toFixed(1)}%` : value.toFixed(3);
  const isGood = value >= 0.9;
  const isMedium = value >= 0.8 && value < 0.9;

  return (
    <div className="text-center">
      <p className={`text-3xl font-bold ${isGood ? "text-green-600" : isMedium ? "text-amber-600" : "text-foreground"}`}>
        {displayValue}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
