"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Filter, X } from "lucide-react";

type ValidationFilter = "" | "retrospective" | "prospective" | "external";
type AccessFilter = "" | "open-source" | "api" | "commercial" | "research-only";

interface ModelData {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  architecture: string | null;
  journal: string | null;
  specialty: string;
  useCase: string;
  tags: string[];
  metrics: {
    sensitivity: number;
    specificity: number;
    auc: number;
    accuracy: number;
  };
  validation: {
    validationType: string;
    externalValidation: boolean;
  };
  regulatory: {
    fdaApproved: boolean;
    ceMark: boolean;
    gdprCompliant: boolean;
  };
  practical: {
    accessType: string;
  };
}

interface ModelsClientProps {
  initialModels: ModelData[];
  specialties: string[];
  journals: string[];
}

export function ModelsClient({ initialModels, specialties, journals }: ModelsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedValidation, setSelectedValidation] = useState<ValidationFilter>("");
  const [selectedAccess, setSelectedAccess] = useState<AccessFilter>("");
  const [fdaOnly, setFdaOnly] = useState(false);
  const [ceOnly, setCeOnly] = useState(false);
  const [gdprOnly, setGdprOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedArchitecture, setSelectedArchitecture] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredModels = useMemo(() => {
    return initialModels.filter((model) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          model.name.toLowerCase().includes(q) ||
          model.description.toLowerCase().includes(q) ||
          model.specialty.toLowerCase().includes(q) ||
          model.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      if (selectedSpecialty && model.specialty !== selectedSpecialty) return false;

      if (selectedArchitecture) {
        if (!model.architecture?.toLowerCase().includes(selectedArchitecture.toLowerCase())) return false;
      }

      if (selectedValidation === "retrospective" && model.validation.validationType !== "retrospective" && model.validation.validationType !== "both") return false;
      if (selectedValidation === "prospective" && model.validation.validationType !== "prospective" && model.validation.validationType !== "both") return false;
      if (selectedValidation === "external" && !model.validation.externalValidation) return false;

      if (selectedAccess && model.practical.accessType !== selectedAccess) return false;

      if (fdaOnly && !model.regulatory.fdaApproved) return false;
      if (ceOnly && !model.regulatory.ceMark) return false;
      if (gdprOnly && !model.regulatory.gdprCompliant) return false;

      if (selectedJournal && model.journal !== selectedJournal) return false;

      return true;
    });
  }, [initialModels, searchQuery, selectedSpecialty, selectedArchitecture, selectedSize, selectedValidation, selectedAccess, fdaOnly, ceOnly, gdprOnly, selectedJournal]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
    setSelectedArchitecture("");
    setSelectedSize("");
    setSelectedValidation("");
    setSelectedAccess("");
    setSelectedJournal("");
    setFdaOnly(false);
    setCeOnly(false);
    setGdprOnly(false);
  };

  return (
    <div className="min-h-screen bg-background bg-dot-grid overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4">
          <div className="relative">
            <svg
              className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground"
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
              className="w-full rounded-xl border border-border bg-background py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-card shadow-xl overflow-y-auto">
                <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-4">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="rounded-lg p-2 hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  {/* Specialty */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">SPECIALTY</h3>
                    <div className="space-y-2">
                      {specialties.map((s) => (
                        <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="specialty-mobile"
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
                      {["CNN", "Transformer", "ResNet", "U-Net", "VGG", "Inception", "DenseNet", "LSTM"].map((arch) => (
                        <label key={arch} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="architecture-mobile"
                            checked={selectedArchitecture === arch}
                            onChange={() => setSelectedArchitecture(selectedArchitecture === arch ? "" : arch)}
                            className="h-4 w-4 border-border text-primary focus:ring-primary"
                          />
                          <span className="text-muted-foreground hover:text-foreground">{arch}</span>
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
                            name="validation-mobile"
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

                  {/* Journal */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">JOURNAL</h3>
                    <select
                      value={selectedJournal}
                      onChange={(e) => setSelectedJournal(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">All Journals</option>
                      {journals.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>

                  {/* Apply button */}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Sidebar - Desktop */}
          <aside className="w-64 shrink-0 hidden lg:block">
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
                  {["CNN", "Transformer", "ResNet", "U-Net", "VGG", "Inception", "DenseNet", "LSTM"].map((arch) => (
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

              {/* Journal */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">JOURNAL</h3>
                <select
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Journals</option>
                  {journals.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full overflow-hidden">
            {/* Results Header */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredModels.length}</span> models found
              </p>
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-1.5 sm:p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-1.5 sm:p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Model Cards Grid */}
            <div className={viewMode === "grid" ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4 sm:space-y-6"}>
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} viewMode={viewMode} />
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">No models match your filters.</p>
                <button
                  onClick={clearFilters}
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

function ModelCard({ model, viewMode }: { model: ModelData; viewMode: "grid" | "list" }) {
  const specialtyColors: Record<string, string> = {
    Radiology: "bg-primary/15 text-primary",
    Dermatology: "bg-amber-100 text-amber-700",
    Cardiology: "bg-rose-100 text-rose-700",
    Pathology: "bg-purple-100 text-purple-700",
    Ophthalmology: "bg-blue-100 text-blue-700",
    Neurology: "bg-indigo-100 text-indigo-700",
    Oncology: "bg-pink-100 text-pink-700",
    Gastroenterology: "bg-orange-100 text-orange-700",
    Pulmonology: "bg-cyan-100 text-cyan-700",
  };

  if (viewMode === "list") {
    return (
      <Link href={`/models/${model.slug}`} className="block">
        <div className="cursor-pointer rounded-xl border-2 border-border p-3 sm:p-4 transition-all hover:border-primary/30 hover:shadow-md hover:bg-[#C0EFFF] overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h3 className="font-semibold text-foreground text-sm sm:text-base break-words">{model.name}</h3>
                <span className={`rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${specialtyColors[model.specialty] || "bg-gray-100 text-gray-700"}`}>
                  {model.specialty}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{model.description}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/models/${model.slug}`} className="h-full block">
      <div className="group flex h-full cursor-pointer flex-col rounded-xl border-2 border-border p-4 sm:p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:bg-[#C0EFFF] overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary line-clamp-2 text-sm sm:text-base break-words">{model.name}</h3>
            {model.journal && (
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">{model.journal}</p>
            )}
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            {model.validation.externalValidation && (
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/5" title="External Validation">
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {model.regulatory.fdaApproved && (
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/5" title="FDA Approved">
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Specialty Tag */}
        <div className="mt-3 sm:mt-4 flex-grow">
          <span className={`inline-block rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium ${specialtyColors[model.specialty] || "bg-gray-100 text-gray-700"}`}>
            {model.specialty}
          </span>
        </div>

        {/* Tags - always at bottom */}
        <div className="mt-4 sm:mt-5 flex flex-wrap gap-1 sm:gap-1.5">
          {model.architecture && (
            <span className="rounded-md border border-blue-200 bg-blue-50 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-blue-700">
              {model.architecture}
            </span>
          )}
          {model.metrics?.auc > 0 && (
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-emerald-700">
              AUC {(model.metrics.auc * 100).toFixed(0)}%
            </span>
          )}
          {model.metrics?.accuracy > 0 && !model.metrics?.auc && (
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-emerald-700">
              Acc {(model.metrics.accuracy * 100).toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
