import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Info, Database, Brain, BarChart3, Stethoscope, AlertTriangle, Target, Microscope, ExternalLink } from "lucide-react";
import { Metadata } from "next";

// Hugging Face Logo SVG component
function HuggingFaceLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 95 88" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.21 76.5c-2.82 0-5.4-.57-7.74-1.72-2.34-1.14-4.22-2.75-5.64-4.83-1.42-2.08-2.13-4.5-2.13-7.26 0-2.64.64-4.97 1.93-6.99 1.29-2.02 3.06-3.6 5.31-4.74 2.25-1.14 4.78-1.71 7.59-1.71 2.7 0 5.13.57 7.29 1.71 2.16 1.14 3.87 2.72 5.13 4.74 1.26 2.02 1.89 4.35 1.89 6.99 0 2.76-.69 5.18-2.07 7.26-1.38 2.08-3.24 3.69-5.58 4.83-2.34 1.15-4.95 1.72-7.83 1.72h1.85z"/>
      <path d="M93.5 51.16c-2.01-5.04-6.33-9.97-6.33-9.97s-3.09-3.87-4.53-5.13c-1.44-1.26-3.48-2.52-3.48-2.52s-1.68-.9-3.36-1.44c-1.68-.54-4.38-.9-4.38-.9s-2.7-.18-5.04 0c-2.34.18-5.04.9-5.04.9s-2.34.72-4.68 1.98c-2.34 1.26-4.68 3.42-4.68 3.42s-3.24 2.88-5.4 6.3c-2.16 3.42-3.6 7.92-3.6 7.92s-.72 2.7-.9 5.4c-.18 2.7.36 5.58.36 5.58"/>
      <path d="M1.5 51.16c2.01-5.04 6.33-9.97 6.33-9.97s3.09-3.87 4.53-5.13c1.44-1.26 3.48-2.52 3.48-2.52s1.68-.9 3.36-1.44c1.68-.54 4.38-.9 4.38-.9s2.7-.18 5.04 0c2.34.18 5.04.9 5.04.9s2.34.72 4.68 1.98c2.34 1.26 4.68 3.42 4.68 3.42s3.24 2.88 5.4 6.3c2.16 3.42 3.6 7.92 3.6 7.92s.72 2.7.9 5.4c.18 2.7-.36 5.58-.36 5.58"/>
      <ellipse cx="31.09" cy="37.3" rx="4.5" ry="6.3"/>
      <ellipse cx="63.91" cy="37.3" rx="4.5" ry="6.3"/>
      <path d="M33.5 20c0 0 2.7-4.5 6.3-7.2 3.6-2.7 8.1-3.6 8.1-3.6s4.5.9 8.1 3.6c3.6 2.7 6.3 7.2 6.3 7.2"/>
      <path d="M27.5 23c0 0-2.7-3.6-4.5-5.4-1.8-1.8-5.4-4.5-5.4-4.5"/>
      <path d="M67.5 23c0 0 2.7-3.6 4.5-5.4 1.8-1.8 5.4-4.5 5.4-4.5"/>
    </svg>
  );
}

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

  // If no publication link, try to find from ScrapedPaper via PMID in slug
  if (publicationLink === "#" || !publicationLink) {
    // Extract PMID from slug (format: "model-name-12345678")
    const pmidMatch = slug.match(/(\d{7,8})$/);
    if (pmidMatch) {
      const pmid = pmidMatch[1];
      const paper = await prisma.scrapedPaper.findUnique({
        where: { pmid },
        select: { doi: true, pubmedUrl: true }
      });
      if (paper?.doi) {
        publicationLink = `https://doi.org/${paper.doi}`;
      } else if (paper?.pubmedUrl) {
        publicationLink = paper.pubmedUrl;
      } else {
        // Fallback to PubMed URL with PMID
        publicationLink = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
      }
    }
  }

  // Convert DOI to full URL if needed
  if (publicationLink && publicationLink !== "#") {
    // Handle DOI formats: "10.xxxx/xxx" or "doi:10.xxxx/xxx"
    if (publicationLink.startsWith("10.") || publicationLink.startsWith("doi:")) {
      const doi = publicationLink.replace(/^doi:/, "").trim();
      publicationLink = `https://doi.org/${doi}`;
    }
    // Ensure URL has protocol
    else if (!publicationLink.startsWith("http://") && !publicationLink.startsWith("https://")) {
      publicationLink = `https://${publicationLink}`;
    }
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

  // Check if this is a Hugging Face model
  const isHuggingFaceModel = slug.startsWith('hf-');
  let huggingFaceId: string | null = null;
  if (isHuggingFaceModel && extractedData) {
    huggingFaceId = (extractedData as any).huggingfaceId || null;
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
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/models" className="hover:text-foreground">Models</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{model.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Hugging Face Model Badge */}
        {isHuggingFaceModel && (
          <div className="rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm border border-yellow-200">
                <HuggingFaceLogo className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-yellow-800">Hugging Face Model</span>
                  <span className="rounded-full bg-yellow-400/30 px-2 py-0.5 text-xs font-medium text-yellow-800">Open Source</span>
                </div>
                <p className="text-xs text-yellow-700">
                  This model is hosted on Hugging Face and may be available for download and use.
                  {huggingFaceId && (
                    <a
                      href={`https://huggingface.co/${huggingFaceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 ml-2 font-medium text-yellow-800 hover:text-yellow-900 underline"
                    >
                      View on Hugging Face
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
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
              <h1 className="text-2xl font-bold text-foreground leading-tight mb-3">
                {model.name}
              </h1>

              {/* Journal */}
              {model.journal && (
                <p className="text-sm text-muted-foreground mb-4">
                  Published in <span className="font-medium text-foreground">{model.journal}</span>
                </p>
              )}

              {/* Quick Details Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                {extractedData?.modality && (
                  <div>
                    <span className="text-muted-foreground">Modality: </span>
                    <span className="font-medium text-foreground">{extractedData.modality}</span>
                  </div>
                )}
                {extractedData?.bodyPart && (
                  <div>
                    <span className="text-muted-foreground">Body Part: </span>
                    <span className="font-medium text-foreground">{extractedData.bodyPart}</span>
                  </div>
                )}
                {extractedData?.targetCondition && (
                  <div>
                    <span className="text-muted-foreground">Target: </span>
                    <span className="font-medium text-foreground">{extractedData.targetCondition}</span>
                  </div>
                )}
                {(extractedData?.methodology?.architecture || model.architecture) && (
                  <div>
                    <span className="text-muted-foreground">Architecture: </span>
                    <span className="font-medium text-foreground">{extractedData?.methodology?.architecture || model.architecture}</span>
                  </div>
                )}
              </div>
            </div>

            {/* View Original Article / Hugging Face Button */}
            <a
              href={publicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors shrink-0 ${
                isHuggingFaceModel
                  ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-400'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isHuggingFaceModel ? (
                <>
                  <HuggingFaceLogo className="h-4 w-4" />
                  View on Hugging Face
                </>
              ) : (
                <>
                  View Original Article
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </>
              )}
            </a>
          </div>

          {/* Results Section */}
          {extractedData?.results && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Results</h2>
              </div>

              <div className="grid md:grid-cols-[auto_1fr] gap-4">
                {/* Metrics - Left */}
                <div className="flex flex-wrap md:flex-col gap-2">
                  {(extractedData.results.auc || extractedData.results.bestAuc) && (
                    <div className="rounded-lg bg-emerald-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-emerald-600 font-medium uppercase">AUC</span>
                      <span className="text-lg font-bold text-emerald-700">
                        <MetricValue value={extractedData.results.auc || extractedData.results.bestAuc} />
                      </span>
                    </div>
                  )}
                  {(extractedData.results.accuracy || extractedData.results.bestAccuracy) && (
                    <div className="rounded-lg bg-blue-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-blue-600 font-medium uppercase">Accuracy</span>
                      <span className="text-lg font-bold text-blue-700">
                        <MetricValue value={extractedData.results.accuracy || extractedData.results.bestAccuracy} />
                      </span>
                    </div>
                  )}
                  {(extractedData.results.sensitivity || extractedData.results.bestSensitivity || extractedData.results.recall) && (
                    <div className="rounded-lg bg-purple-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-purple-600 font-medium uppercase">Sensitivity</span>
                      <span className="text-lg font-bold text-purple-700">
                        <MetricValue value={extractedData.results.sensitivity || extractedData.results.bestSensitivity || extractedData.results.recall} />
                      </span>
                    </div>
                  )}
                  {(extractedData.results.specificity || extractedData.results.bestSpecificity) && (
                    <div className="rounded-lg bg-orange-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-orange-600 font-medium uppercase">Specificity</span>
                      <span className="text-lg font-bold text-orange-700">
                        <MetricValue value={extractedData.results.specificity || extractedData.results.bestSpecificity} />
                      </span>
                    </div>
                  )}
                  {extractedData.results.f1Score && (
                    <div className="rounded-lg bg-pink-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-pink-600 font-medium uppercase">F1</span>
                      <span className="text-lg font-bold text-pink-700">
                        <MetricValue value={extractedData.results.f1Score} />
                      </span>
                    </div>
                  )}
                  {(extractedData.results.precision || extractedData.results.ppv) && (
                    <div className="rounded-lg bg-indigo-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-indigo-600 font-medium uppercase">PPV</span>
                      <span className="text-lg font-bold text-indigo-700">
                        <MetricValue value={extractedData.results.precision || extractedData.results.ppv} />
                      </span>
                    </div>
                  )}
                  {extractedData.results.diceScore && (
                    <div className="rounded-lg bg-cyan-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-cyan-600 font-medium uppercase">Dice</span>
                      <span className="text-lg font-bold text-cyan-700">
                        <MetricValue value={extractedData.results.diceScore} />
                      </span>
                    </div>
                  )}
                  {extractedData.results.iou && (
                    <div className="rounded-lg bg-sky-50 px-3 py-2 flex items-center gap-3">
                      <span className="text-xs text-sky-600 font-medium uppercase">IoU</span>
                      <span className="text-lg font-bold text-sky-700">
                        <MetricValue value={extractedData.results.iou} />
                      </span>
                    </div>
                  )}
                </div>

                {/* Summary Text - Right */}
                {extractedData.results.summary && (
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {extractedData.results.summary}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Study Overview - Combined Section */}
        {(extractedData?.objective || extractedData?.dataset || extractedData?.methodology || extractedData?.validation) && (
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Objective */}
              {extractedData?.objective && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Objective</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {extractedData.objective}
                  </p>
                </div>
              )}

              {/* Dataset */}
              {extractedData?.dataset && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Dataset</h3>
                  </div>
                  {extractedData.dataset.description && (
                    <p className="text-sm text-muted-foreground mb-2">{extractedData.dataset.description}</p>
                  )}
                  {(extractedData.dataset.totalSamples || extractedData.dataset.trainingSamples || extractedData.dataset.testSamples) && (
                    <div className="flex flex-wrap gap-2">
                      {extractedData.dataset.totalSamples && (
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                          <span className="text-muted-foreground">Total:</span> <span className="font-semibold">{extractedData.dataset.totalSamples.toLocaleString()}</span>
                        </span>
                      )}
                      {extractedData.dataset.trainingSamples && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          Train: <span className="font-semibold">{extractedData.dataset.trainingSamples.toLocaleString()}</span>
                        </span>
                      )}
                      {extractedData.dataset.testSamples && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                          Test: <span className="font-semibold">{extractedData.dataset.testSamples.toLocaleString()}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Methodology & Validation merged */}
              {(extractedData?.methodology || extractedData?.validation) && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Methodology</h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {extractedData?.methodology?.approach && (
                      <div><span className="text-muted-foreground">Approach:</span> <span className="text-foreground">{extractedData.methodology.approach}</span></div>
                    )}
                    {extractedData?.methodology?.architecture && (
                      <div><span className="text-muted-foreground">Architecture:</span> <span className="text-foreground">{extractedData.methodology.architecture}</span></div>
                    )}
                    {extractedData?.methodology?.baseModel && (
                      <div><span className="text-muted-foreground">Pre-trained:</span> <span className="text-foreground">{extractedData.methodology.baseModel}</span></div>
                    )}
                    {extractedData?.validation?.crossValidation && (
                      <div><span className="text-muted-foreground">Validation:</span> <span className="text-foreground">{extractedData.validation.crossValidation}</span></div>
                    )}
                    {extractedData?.validation?.type && !extractedData?.validation?.crossValidation && (
                      <div><span className="text-muted-foreground">Validation:</span> <span className="text-foreground capitalize">{extractedData.validation.type}</span></div>
                    )}
                  </div>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {extractedData?.methodology?.classification && (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">Classification</span>
                    )}
                    {extractedData?.methodology?.segmentation && (
                      <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">Segmentation</span>
                    )}
                    {extractedData?.methodology?.detection && (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">Detection</span>
                    )}
                    {extractedData?.validation?.prospective && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Prospective</span>
                    )}
                    {extractedData?.validation?.multiCenter && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Multi-Center</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clinical Implications Section */}
        {extractedData?.clinicalImplications && extractedData.clinicalImplications.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Clinical Implications</h2>
            </div>
            <ul className="space-y-2 text-sm">
              {extractedData.clinicalImplications.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Remaining Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6">

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

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Source & Copyright */}
            {isHuggingFaceModel ? (
              <div className="rounded-lg border border-yellow-300 bg-yellow-50/50 p-4">
                <div className="flex items-start gap-3">
                  <HuggingFaceLogo className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium mb-1">Hugging Face Model</p>
                    <p className="text-yellow-800 text-xs">
                      This model is sourced from <span className="font-medium">Hugging Face</span>, an open-source platform for machine learning models.
                      Please check the original model card for licensing, usage restrictions, and citation requirements.
                      <Link href="/disclaimer" className="ml-1 underline hover:text-yellow-900">
                        View disclaimer
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
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
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
