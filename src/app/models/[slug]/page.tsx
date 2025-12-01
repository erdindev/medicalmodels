import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Info, Database, Brain, BarChart3, Stethoscope, AlertTriangle, Target, Microscope } from "lucide-react";
import { Metadata } from "next";

const prisma = new PrismaClient();

// Types for extracted metadata
interface DatasetBreakdown {
  class: string;
  count: number;
}

interface DatasetDetail {
  name: string;
  total: number | null;
  breakdown: DatasetBreakdown[];
}

interface ExtractedMetadata {
  objective?: string;
  dataset?: {
    description?: string;
    totalSamples?: number | null;
    trainingSamples?: number | null;
    validationSamples?: number | null;
    testSamples?: number | null;
    details?: DatasetDetail[];
    source?: string;
  };
  methodology?: {
    approach?: string;
    architecture?: string;
    baseModel?: string;
    fineTuning?: boolean | null;
    segmentation?: boolean | null;
    classification?: boolean | null;
    detection?: boolean | null;
    parameters?: string;
    techniques?: string[];
    framework?: string;
  };
  validation?: {
    type?: string;
    crossValidation?: string;
    externalDataset?: string;
    prospective?: boolean | null;
    multiCenter?: boolean | null;
    comparisonWithExperts?: boolean | null;
  };
  results?: {
    accuracy?: any;
    sensitivity?: any;
    specificity?: any;
    auc?: any;
    aucCI?: string;
    f1Score?: any;
    precision?: any;
    recall?: any;
    npv?: any;
    ppv?: any;
    diceScore?: any;
    iou?: any;
    summary?: string;
    // Legacy fields for backward compatibility
    bestAccuracy?: number;
    bestSensitivity?: number;
    bestSpecificity?: number;
    bestAuc?: number;
  };
  clinicalImplications?: string[];
  limitations?: string[];
  modality?: string;
  bodyPart?: string;
  targetCondition?: string;
  secondaryConditions?: string[];
  comparators?: string[];
}

export async function generateStaticParams() {
  const models = await prisma.medicalModel.findMany({
    select: { slug: true },
  });
  return models.map((model) => ({
    slug: model.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const model = await prisma.medicalModel.findUnique({
    where: { slug },
    include: {
      specialty: true,
    }
  });

  if (!model) {
    return {
      title: "Model Not Found",
    };
  }

  const title = model.name;
  const description = model.description?.slice(0, 160) || `${model.name} - Medical AI model for ${model.specialty?.name || 'healthcare'} applications.`;

  return {
    title,
    description,
    keywords: [
      model.name,
      model.specialty?.name || "medical AI",
      model.architecture || "deep learning",
      "medical model",
      "AI healthcare",
      model.journal || "peer-reviewed",
    ].filter(Boolean),
    openGraph: {
      title: `${model.name} | MedicalModels`,
      description,
      type: "article",
      url: `https://medicalmodels.co/models/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${model.name} | MedicalModels`,
      description,
    },
    alternates: {
      canonical: `/models/${slug}`,
    },
  };
}

const formatValue = (val: any): string => {
  if (typeof val === 'number') {
    return (val <= 1 && val > 0 ? val * 100 : val).toFixed(1) + '%';
  }
  if (typeof val === 'string' && !val.includes('%') && !isNaN(Number(val))) {
    const num = Number(val);
    return (num <= 1 && num > 0 ? num * 100 : num).toFixed(1) + '%';
  }
  return String(val);
};

function MetricValue({ value }: { value: any }) {
  if (value === null || value === undefined) return null;

  if (typeof value === 'object') {
    return (
      <div className="flex flex-col text-xs font-normal mt-1 space-y-1 w-full">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex flex-col w-full">
            <div className="flex justify-between gap-2 w-full items-baseline">
              <span className="opacity-80 text-left truncate" title={k}>{k}:</span>
              {typeof v !== 'object' && <span className="font-mono text-right shrink-0">{formatValue(v)}</span>}
            </div>
            {typeof v === 'object' && (
              <div className="pl-2 border-l border-current/20 ml-1 mt-0.5">
                <MetricValue value={v} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <>{formatValue(value)}</>;
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const model = await prisma.medicalModel.findUnique({
    where: { slug },
    include: {
      specialty: true,
      useCase: true,
      validation: true,
      metrics: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!model) {
    notFound();
  }

  // Parse publication links
  let publicationLink = "#";
  try {
    if (model.validation?.publicationLinks) {
      const links = JSON.parse(model.validation.publicationLinks);
      if (Array.isArray(links) && links.length > 0) {
        publicationLink = links[0].url;
      }
    }
  } catch (e) {
    // Fallback if not JSON
    publicationLink = model.validation?.publicationLinks || "#";
  }

  // Parse extracted metadata
  let extractedData: ExtractedMetadata | null = null;
  try {
    if (model.metadata) {
      extractedData = JSON.parse(model.metadata);
    }
  } catch (e) {
    extractedData = null;
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": model.name,
    "description": model.description,
    "applicationCategory": "HealthApplication",
    "applicationSubCategory": model.specialty?.name || "Medical AI",
    "operatingSystem": "Any",
    "url": `https://medicalmodels.co/models/${slug}`,
    "author": {
      "@type": "Organization",
      "name": model.journal || "Research Institution"
    },
    "keywords": [
      model.specialty?.name,
      model.architecture,
      "medical AI",
      "healthcare",
      "machine learning"
    ].filter(Boolean).join(", "),
  };

  const hasMetrics = model.metrics && (
    model.metrics.accuracy ||
    model.metrics.auc ||
    model.metrics.sensitivity ||
    model.metrics.specificity
  );

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/models" className="hover:text-foreground">Models</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{model.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mb-6">
          {/* Tags Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {model.specialty?.name || "General"}
            </span>
            {extractedData?.modality && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {extractedData.modality}
              </span>
            )}
            {model.architecture && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                {model.architecture}
              </span>
            )}
            {extractedData?.targetCondition && (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 border border-rose-200">
                {extractedData.targetCondition}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">
            {model.name}
          </h1>

          {/* Journal */}
          {model.journal && (
            <p className="text-sm text-muted-foreground mb-4">
              Published in <span className="font-medium text-foreground">{model.journal}</span>
            </p>
          )}

          {/* Quick Metrics Bar */}
          {hasMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {model.metrics?.auc && model.metrics.auc > 0 && (
                <div className="rounded-lg bg-emerald-50 p-3 text-center">
                  <div className="text-xs text-emerald-600 font-medium uppercase">AUC</div>
                  <div className="text-xl font-bold text-emerald-700">{(model.metrics.auc * 100).toFixed(1)}%</div>
                </div>
              )}
              {model.metrics?.accuracy && model.metrics.accuracy > 0 && (
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium uppercase">Accuracy</div>
                  <div className="text-xl font-bold text-blue-700">{(model.metrics.accuracy * 100).toFixed(1)}%</div>
                </div>
              )}
              {model.metrics?.sensitivity && model.metrics.sensitivity > 0 && (
                <div className="rounded-lg bg-purple-50 p-3 text-center">
                  <div className="text-xs text-purple-600 font-medium uppercase">Sensitivity</div>
                  <div className="text-xl font-bold text-purple-700">{(model.metrics.sensitivity * 100).toFixed(1)}%</div>
                </div>
              )}
              {model.metrics?.specificity && model.metrics.specificity > 0 && (
                <div className="rounded-lg bg-orange-50 p-3 text-center">
                  <div className="text-xs text-orange-600 font-medium uppercase">Specificity</div>
                  <div className="text-xl font-bold text-orange-700">{(model.metrics.specificity * 100).toFixed(1)}%</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6">

            {/* Objective Section */}
            {extractedData?.objective && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Objective</h2>
                </div>
                <p className="text-foreground leading-relaxed">
                  {extractedData.objective}
                </p>
              </section>
            )}

            {/* Dataset Section */}
            {extractedData?.dataset && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Dataset</h2>
                </div>

                {extractedData.dataset.description && (
                  <p className="text-muted-foreground mb-4">{extractedData.dataset.description}</p>
                )}

                {/* Sample counts */}
                {(extractedData.dataset.totalSamples || extractedData.dataset.trainingSamples || extractedData.dataset.testSamples) && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {extractedData.dataset.totalSamples && (
                      <div className="rounded-lg bg-slate-100 px-3 py-2 text-center">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="font-semibold text-foreground">{extractedData.dataset.totalSamples.toLocaleString()}</div>
                      </div>
                    )}
                    {extractedData.dataset.trainingSamples && (
                      <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                        <div className="text-xs text-blue-600">Training</div>
                        <div className="font-semibold text-blue-700">{extractedData.dataset.trainingSamples.toLocaleString()}</div>
                      </div>
                    )}
                    {extractedData.dataset.validationSamples && (
                      <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
                        <div className="text-xs text-amber-600">Validation</div>
                        <div className="font-semibold text-amber-700">{extractedData.dataset.validationSamples.toLocaleString()}</div>
                      </div>
                    )}
                    {extractedData.dataset.testSamples && (
                      <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
                        <div className="text-xs text-emerald-600">Test</div>
                        <div className="font-semibold text-emerald-700">{extractedData.dataset.testSamples.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                )}

                {extractedData.dataset.details && extractedData.dataset.details.length > 0 && extractedData.dataset.details.map((dataset, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      {dataset.name} {dataset.total && <span className="text-muted-foreground font-normal">({dataset.total.toLocaleString()} samples)</span>}
                    </h3>
                    {dataset.breakdown && dataset.breakdown.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dataset.breakdown.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm">
                            <span className="text-muted-foreground">{item.class}:</span>
                            <span className="font-medium text-foreground">{item.count?.toLocaleString()}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {extractedData.dataset.source && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Source: {extractedData.dataset.source}
                  </p>
                )}
              </section>
            )}

            {/* Methodology Section */}
            {extractedData?.methodology && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Methodology</h2>
                </div>

                <div className="space-y-3">
                  {extractedData.methodology.approach && (
                    <div>
                      <span className="text-sm text-muted-foreground">Approach: </span>
                      <span className="font-medium text-foreground">{extractedData.methodology.approach}</span>
                    </div>
                  )}
                  {extractedData.methodology.architecture && (
                    <div>
                      <span className="text-sm text-muted-foreground">Architecture: </span>
                      <span className="font-medium text-foreground">{extractedData.methodology.architecture}</span>
                    </div>
                  )}
                  {extractedData.methodology.baseModel && (
                    <div>
                      <span className="text-sm text-muted-foreground">Pre-trained Model: </span>
                      <span className="font-medium text-foreground">{extractedData.methodology.baseModel}</span>
                    </div>
                  )}
                  {extractedData.methodology.framework && (
                    <div>
                      <span className="text-sm text-muted-foreground">Framework: </span>
                      <span className="font-medium text-foreground">{extractedData.methodology.framework}</span>
                    </div>
                  )}
                  {extractedData.methodology.parameters && (
                    <div>
                      <span className="text-sm text-muted-foreground">Parameters: </span>
                      <span className="font-medium text-foreground">{extractedData.methodology.parameters}</span>
                    </div>
                  )}

                  {/* Task type badges */}
                  {(extractedData.methodology.classification || extractedData.methodology.segmentation || extractedData.methodology.detection || extractedData.methodology.fineTuning) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {extractedData.methodology.classification && (
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200">Classification</span>
                      )}
                      {extractedData.methodology.segmentation && (
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 border border-cyan-200">Segmentation</span>
                      )}
                      {extractedData.methodology.detection && (
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 border border-orange-200">Detection</span>
                      )}
                      {extractedData.methodology.fineTuning && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">Fine-tuned</span>
                      )}
                    </div>
                  )}

                  {extractedData.methodology.techniques && extractedData.methodology.techniques.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-2">Techniques:</span>
                      <div className="flex flex-wrap gap-2">
                        {extractedData.methodology.techniques.map((tech, i) => (
                          <span key={i} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Validation Section */}
            {extractedData?.validation && (extractedData.validation.type || extractedData.validation.crossValidation || extractedData.validation.externalDataset) && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-foreground">Validation</h2>
                </div>

                <div className="space-y-3">
                  {extractedData.validation.type && (
                    <div>
                      <span className="text-sm text-muted-foreground">Type: </span>
                      <span className="font-medium text-foreground capitalize">{extractedData.validation.type}</span>
                    </div>
                  )}
                  {extractedData.validation.crossValidation && (
                    <div>
                      <span className="text-sm text-muted-foreground">Cross-Validation: </span>
                      <span className="font-medium text-foreground">{extractedData.validation.crossValidation}</span>
                    </div>
                  )}
                  {extractedData.validation.externalDataset && (
                    <div>
                      <span className="text-sm text-muted-foreground">External Dataset: </span>
                      <span className="font-medium text-foreground">{extractedData.validation.externalDataset}</span>
                    </div>
                  )}

                  {/* Validation badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {extractedData.validation.prospective && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">Prospective</span>
                    )}
                    {extractedData.validation.multiCenter && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">Multi-Center</span>
                    )}
                    {extractedData.validation.comparisonWithExperts && (
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200">Compared with Experts</span>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Results Section */}
            {extractedData?.results && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Results</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {/* AUC */}
                  {(extractedData.results.auc || extractedData.results.bestAuc) && (
                    <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-emerald-600 font-medium uppercase mb-1">AUC</div>
                      <div className="text-lg font-bold text-emerald-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.auc || extractedData.results.bestAuc} />
                      </div>
                      {extractedData.results.aucCI && (
                        <div className="text-xs text-emerald-500 mt-1">CI: {extractedData.results.aucCI}</div>
                      )}
                    </div>
                  )}
                  {/* Accuracy */}
                  {(extractedData.results.accuracy || extractedData.results.bestAccuracy) && (
                    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-blue-600 font-medium uppercase mb-1">Accuracy</div>
                      <div className="text-lg font-bold text-blue-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.accuracy || extractedData.results.bestAccuracy} />
                      </div>
                    </div>
                  )}
                  {/* Sensitivity/Recall */}
                  {(extractedData.results.sensitivity || extractedData.results.bestSensitivity || extractedData.results.recall) && (
                    <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-purple-600 font-medium uppercase mb-1">Sensitivity</div>
                      <div className="text-lg font-bold text-purple-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.sensitivity || extractedData.results.bestSensitivity || extractedData.results.recall} />
                      </div>
                    </div>
                  )}
                  {/* Specificity */}
                  {(extractedData.results.specificity || extractedData.results.bestSpecificity) && (
                    <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-orange-600 font-medium uppercase mb-1">Specificity</div>
                      <div className="text-lg font-bold text-orange-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.specificity || extractedData.results.bestSpecificity} />
                      </div>
                    </div>
                  )}
                  {/* F1 Score */}
                  {extractedData.results.f1Score && (
                    <div className="rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-pink-600 font-medium uppercase mb-1">F1 Score</div>
                      <div className="text-lg font-bold text-pink-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.f1Score} />
                      </div>
                    </div>
                  )}
                  {/* Precision/PPV */}
                  {(extractedData.results.precision || extractedData.results.ppv) && (
                    <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-indigo-600 font-medium uppercase mb-1">PPV/Precision</div>
                      <div className="text-lg font-bold text-indigo-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.precision || extractedData.results.ppv} />
                      </div>
                    </div>
                  )}
                  {/* NPV */}
                  {extractedData.results.npv && (
                    <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-teal-600 font-medium uppercase mb-1">NPV</div>
                      <div className="text-lg font-bold text-teal-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.npv} />
                      </div>
                    </div>
                  )}
                  {/* Dice Score (for segmentation) */}
                  {extractedData.results.diceScore && (
                    <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-cyan-600 font-medium uppercase mb-1">Dice Score</div>
                      <div className="text-lg font-bold text-cyan-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.diceScore} />
                      </div>
                    </div>
                  )}
                  {/* IoU (for segmentation) */}
                  {extractedData.results.iou && (
                    <div className="rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 p-3 text-center flex flex-col items-center">
                      <div className="text-xs text-sky-600 font-medium uppercase mb-1">IoU</div>
                      <div className="text-lg font-bold text-sky-700 w-full flex justify-center">
                        <MetricValue value={extractedData.results.iou} />
                      </div>
                    </div>
                  )}
                </div>

                {extractedData.results.summary && (
                  <p className="text-foreground leading-relaxed bg-slate-50 rounded-lg p-4 text-sm">
                    {extractedData.results.summary}
                  </p>
                )}
              </section>
            )}

            {/* Clinical Implications Section */}
            {extractedData?.clinicalImplications && extractedData.clinicalImplications.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Clinical Implications</h2>
                </div>
                <ul className="space-y-2">
                  {extractedData.clinicalImplications.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Limitations Section */}
            {extractedData?.limitations && extractedData.limitations.length > 0 && (
              <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-amber-900">Limitations</h2>
                </div>
                <ul className="space-y-2">
                  {extractedData.limitations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1.5">•</span>
                      <span className="text-amber-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Original Abstract (collapsed by default if structured data exists) */}
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Microscope className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {extractedData ? "Original Abstract" : "Abstract / Description"}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {model.description}
              </p>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Quick Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Specialty</dt>
                  <dd className="font-medium text-foreground">{model.specialty?.name || "General"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Use Case</dt>
                  <dd className="font-medium text-foreground">{model.useCase?.name || "General"}</dd>
                </div>
                {extractedData?.modality && (
                  <div>
                    <dt className="text-muted-foreground">Modality</dt>
                    <dd className="font-medium text-foreground">{extractedData.modality}</dd>
                  </div>
                )}
                {extractedData?.bodyPart && (
                  <div>
                    <dt className="text-muted-foreground">Body Part</dt>
                    <dd className="font-medium text-foreground">{extractedData.bodyPart}</dd>
                  </div>
                )}
                {extractedData?.targetCondition && (
                  <div>
                    <dt className="text-muted-foreground">Target Condition</dt>
                    <dd className="font-medium text-foreground">{extractedData.targetCondition}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Architecture</dt>
                  <dd className="font-medium text-foreground">{extractedData?.methodology?.architecture || model.architecture || "Not specified"}</dd>
                </div>
                {extractedData?.methodology?.baseModel && (
                  <div>
                    <dt className="text-muted-foreground">Pre-trained On</dt>
                    <dd className="font-medium text-foreground">{extractedData.methodology.baseModel}</dd>
                  </div>
                )}
                {extractedData?.methodology?.framework && (
                  <div>
                    <dt className="text-muted-foreground">Framework</dt>
                    <dd className="font-medium text-foreground">{extractedData.methodology.framework}</dd>
                  </div>
                )}
                {extractedData?.secondaryConditions && extractedData.secondaryConditions.length > 0 && (
                  <div>
                    <dt className="text-muted-foreground">Also Detects</dt>
                    <dd className="font-medium text-foreground">{extractedData.secondaryConditions.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Source & Copyright */}
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Source & Copyright</p>
                  <p className="text-blue-800 text-xs">
                    {model.journal ? (
                      <>Data sourced from <span className="font-medium">{model.journal}</span>. </>
                    ) : (
                      <>Data sourced from peer-reviewed publication. </>
                    )}
                    All research data, metrics, and methodologies remain the intellectual property of the original authors.
                    <Link href="/disclaimer" className="ml-1 underline hover:text-blue-900">
                      View disclaimer
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* View Original Article Button */}
            <a
              href={publicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors w-full"
            >
              View Original Article
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
