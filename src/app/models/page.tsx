"use client";

import { useState, useMemo, useEffect } from "react";
import { demoModels, specialties, MedicalModel } from "@/lib/data";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

type ValidationFilter = "" | "retrospective" | "prospective" | "external";
type AccessFilter = "" | "open-source" | "api" | "commercial" | "research-only";

export default function ModelsPage() {
  const [models, setModels] = useState<MedicalModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models');
        const data = await res.json();
        const mapped = data.map((m: any) => ({
          ...m,
          specialty: m.specialty?.name || 'General',
          useCase: m.useCase?.name || 'General',
          tags: m.tags?.map((t: any) => t.tag.name) || [],
          metrics: {
            sensitivity: m.metrics?.sensitivity ?? 0,
            specificity: m.metrics?.specificity ?? 0,
            auc: m.metrics?.auc ?? 0,
            accuracy: m.metrics?.accuracy ?? 0
          },
          validation: m.validation || { validationType: 'retrospective', externalValidation: false },
          regulatory: m.regulatory || { fdaApproved: false, ceMark: false, gdprCompliant: false },
          practical: m.practical || { accessType: 'research-only' },
          training: {
            ...m.training,
            datasetSize: m.training?.datasetSize ?? 0
          }
        }));
        setModels(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchModels();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedValidation, setSelectedValidation] = useState<ValidationFilter>("");
  const [selectedAccess, setSelectedAccess] = useState<AccessFilter>("");
  const [fdaOnly, setFdaOnly] = useState(false);
  const [ceOnly, setCeOnly] = useState(false);
  const [gdprOnly, setGdprOnly] = useState(false);
  const [minAuc, setMinAuc] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedArchitecture, setSelectedArchitecture] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          model.name.toLowerCase().includes(q) ||
          model.description.toLowerCase().includes(q) ||
          model.specialty.toLowerCase().includes(q) ||
          model.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Specialty filter
      if (selectedSpecialty && model.specialty !== selectedSpecialty) return false;

      // Architecture filter
      if (selectedArchitecture) {
        const q = selectedArchitecture.toLowerCase();
        const matchesArch =
          model.name.toLowerCase().includes(q) ||
          model.description.toLowerCase().includes(q) ||
          model.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesArch) return false;
      }

      // Parameter Size filter (Text based approximation for now)
      if (selectedSize) {
        // This is a placeholder logic as we don't have structured parameter data yet
        // We'll just check if the description mentions the size category keywords
        // In a real app, this would use a structured field
        return true;
      }

      // Validation filter
      if (selectedValidation === "retrospective" && model.validation.validationType !== "retrospective" && model.validation.validationType !== "both") return false;
      if (selectedValidation === "prospective" && model.validation.validationType !== "prospective" && model.validation.validationType !== "both") return false;
      if (selectedValidation === "external" && !model.validation.externalValidation) return false;

      // Access filter
      if (selectedAccess && model.practical.accessType !== selectedAccess) return false;

      // Regulatory filters
      if (fdaOnly && !model.regulatory.fdaApproved) return false;
      if (ceOnly && !model.regulatory.ceMark) return false;
      if (gdprOnly && !model.regulatory.gdprCompliant) return false;

      // Min AUC filter
      if (model.metrics.auc < minAuc) return false;

      return true;
    });
  }, [searchQuery, selectedSpecialty, selectedValidation, selectedAccess, fdaOnly, ceOnly, gdprOnly, minAuc]);

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-lg font-semibold text-primary">Filters</h2>

              {/* Specialty */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">SPECIALTY</h3>
                <div className="space-y-2">
                  {specialties.map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="specialty"
                        checked={selectedSpecialty === s}
                        onChange={() => setSelectedSpecialty(selectedSpecialty === s ? "" : s)}
                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                      />
                      <span className="text-muted-foreground hover:text-foreground">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Architecture */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">ARCHITECTURE</h3>
                <div className="space-y-2">
                  {["CNN", "Transformer", "ResNet", "U-Net", "VGG", "Inception", "Ensemble"].map((arch) => (
                    <label key={arch} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="architecture"
                        checked={selectedArchitecture === arch}
                        onChange={() => setSelectedArchitecture(selectedArchitecture === arch ? "" : arch)}
                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                      />
                      <span className="text-muted-foreground hover:text-foreground">{arch}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Parameter Size */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">PARAMETER SIZE</h3>
                <div className="space-y-2">
                  {["< 10M", "10M - 100M", "> 100M"].map((size) => (
                    <label key={size} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="size"
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(selectedSize === size ? "" : size)}
                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                      />
                      <span className="text-muted-foreground hover:text-foreground">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Validation */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">VALIDATION</h3>
                <div className="space-y-2">
                  {[
                    { value: "retrospective", label: "Retrospective" },
                    { value: "prospective", label: "Prospective" },
                    { value: "external", label: "External" },
                  ].map((v) => (
                    <label key={v.value} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="validation"
                        checked={selectedValidation === v.value}
                        onChange={() => setSelectedValidation(selectedValidation === v.value ? "" : v.value as ValidationFilter)}
                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                      />
                      <span className="text-muted-foreground hover:text-foreground">{v.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regulatory */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">REGULATORY</h3>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={fdaOnly}
                      onChange={(e) => setFdaOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground hover:text-foreground">FDA Approved</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={ceOnly}
                      onChange={(e) => setCeOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground hover:text-foreground">CE Marked</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={gdprOnly}
                      onChange={(e) => setGdprOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground hover:text-foreground">GDPR Compliant</span>
                  </label>
                </div>
              </div>

              {/* Access */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">ACCESS</h3>
                <div className="space-y-2">
                  {[
                    { value: "open-source", label: "Open-Source" },
                    { value: "api", label: "Api" },
                    { value: "commercial", label: "Commercial" },
                  ].map((a) => (
                    <label key={a.value} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="access"
                        checked={selectedAccess === a.value}
                        onChange={() => setSelectedAccess(selectedAccess === a.value ? "" : a.value as AccessFilter)}
                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                      />
                      <span className="text-muted-foreground hover:text-foreground">{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min AUC Slider */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">MIN AUC</h3>
                <div className="text-2xl font-semibold text-primary">{minAuc.toFixed(2)}</div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={minAuc}
                  onChange={(e) => setMinAuc(parseFloat(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredModels.length}</span> models found
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Model Cards Grid */}
            <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} viewMode={viewMode} />
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">No models match your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialty("");
                    setSelectedArchitecture("");
                    setSelectedSize("");
                    setSelectedValidation("");
                    setSelectedAccess("");
                    setFdaOnly(false);
                    setCeOnly(false);
                    setGdprOnly(false);
                    setMinAuc(0);
                  }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ModelCard({ model, viewMode }: { model: MedicalModel; viewMode: "grid" | "list" }) {
  const specialtyColors: Record<string, string> = {
    Radiology: "bg-primary/15 text-primary",
    Dermatology: "bg-amber-100 text-amber-700",
    Cardiology: "bg-rose-100 text-rose-700",
    Pathology: "bg-purple-100 text-purple-700",
    Ophthalmology: "bg-blue-100 text-blue-700",
    Neurology: "bg-indigo-100 text-indigo-700",
    Oncology: "bg-pink-100 text-pink-700",
    "General Practice": "bg-gray-100 text-gray-700",
  };

  if (viewMode === "list") {
    return (
      <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{model.name}</h3>
              <span className="text-sm text-muted-foreground">Version {model.version}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${specialtyColors[model.specialty] || "bg-gray-100 text-gray-700"}`}>
                {model.specialty}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{model.description}</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{(model.metrics.sensitivity * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Sensitivity</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{(model.metrics.specificity * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Specificity</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{model.metrics.auc.toFixed(3)}</div>
              <div className="text-xs text-muted-foreground">AUC</div>
            </div>
            <Link
              href={`/compare?models=${model.id}`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Compare Models
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary">{model.name}</h3>
          <p className="text-sm text-muted-foreground">Version {model.version}</p>
        </div>
        <div className="flex gap-1">
          {model.validation.externalValidation && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary" title="External Validation">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {model.regulatory.fdaApproved && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary" title="FDA Approved">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Specialty Tag */}
      <div className="mt-3">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${specialtyColors[model.specialty] || "bg-gray-100 text-gray-700"}`}>
          {model.specialty}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{model.description}</p>

      {/* Metrics */}
      <div className="mt-4 rounded-lg bg-secondary/50 p-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{(model.metrics.sensitivity * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Sensitivity</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{(model.metrics.specificity * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Specificity</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{model.metrics.auc.toFixed(3)}</div>
            <div className="text-xs text-muted-foreground">AUC</div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {model.validation.externalValidation && (
          <span className="rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
            external
          </span>
        )}
        <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {model.practical.accessType}
        </span>
        <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {formatNumber(model.training.datasetSize)} images
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/compare?models=${model.id}`}
          className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Compare Models
        </Link>
        <Link
          href={`/models/${model.slug}`}
          className="rounded-lg border border-border p-2 text-muted-foreground hover:border-primary/30 hover:text-primary"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
