"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Filter, X, Loader2, ChevronDown, ArrowUpDown } from "lucide-react";

type ValidationFilter = "" | "retrospective" | "prospective" | "external";
type AccessFilter = "" | "open-source" | "api" | "commercial" | "research-only";
type SortOption = "date" | "auc" | "accuracy" | "name";

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
  specialties: string[];
  journals: string[];
  totalCount: number;
}

interface ApiResponse {
  models: ModelData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Modalities with their search terms
const MODALITIES = [
  { label: "CT", terms: ["CT"], count: 1565 },
  { label: "ECG/EKG", terms: ["ECG", "EKG"], count: 253 },
  { label: "OCT", terms: ["OCT"], count: 153 },
  { label: "MRI", terms: ["MRI"], count: 147 },
  { label: "Fundus", terms: ["Fundus"], count: 117 },
  { label: "X-ray", terms: ["X-ray", "Xray"], count: 112 },
  { label: "Endoscopy", terms: ["Endoscopy", "Colonoscopy"], count: 78 },
  { label: "Histopathology", terms: ["Histopathology", "Pathology"], count: 76 },
  { label: "Ultrasound", terms: ["Ultrasound"], count: 61 },
  { label: "PET", terms: ["PET"], count: 60 },
  { label: "Echocardiography", terms: ["Echocardiography", "Echo"], count: 41 },
  { label: "Mammography", terms: ["Mammography"], count: 11 },
  { label: "Dermoscopy", terms: ["Dermoscopy"], count: 7 },
];

export function ModelsClient({ specialties, journals, totalCount }: ModelsClientProps) {
  const [models, setModels] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(totalCount);

  // Existing Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedValidation, setSelectedValidation] = useState<ValidationFilter>("");
  const [selectedAccess, setSelectedAccess] = useState<AccessFilter>("");
  const [fdaOnly, setFdaOnly] = useState(false);
  const [ceOnly, setCeOnly] = useState(false);
  const [gdprOnly, setGdprOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedArchitecture, setSelectedArchitecture] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // New Filters
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [aucRange, setAucRange] = useState<[number, number]>([0, 100]);
  const [accRange, setAccRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut "F" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.getAttribute('contenteditable') === 'true';

        if (!isInputFocused && searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Build query string from filters
  const buildQueryString = useCallback((pageNum: number) => {
    const params = new URLSearchParams();
    params.set("page", String(pageNum));
    if (searchQuery) params.set("q", searchQuery);
    if (selectedSpecialty) params.set("specialty", selectedSpecialty);
    if (selectedArchitecture) params.set("architecture", selectedArchitecture);
    if (selectedValidation) params.set("validation", selectedValidation);
    if (selectedAccess) params.set("access", selectedAccess);
    if (selectedJournal) params.set("journal", selectedJournal);
    if (fdaOnly) params.set("fda", "true");
    if (ceOnly) params.set("ce", "true");
    if (gdprOnly) params.set("gdpr", "true");

    // New filters
    if (selectedModalities.length > 0) {
      const terms = selectedModalities.flatMap(m =>
        MODALITIES.find(mod => mod.label === m)?.terms || [m]
      );
      params.set("modality", terms.join(","));
    }
    if (aucRange[0] > 0 || aucRange[1] < 100) {
      params.set("aucMin", String(aucRange[0] / 100));
      params.set("aucMax", String(aucRange[1] / 100));
    }
    if (accRange[0] > 0 || accRange[1] < 100) {
      params.set("accMin", String(accRange[0] / 100));
      params.set("accMax", String(accRange[1] / 100));
    }
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    return params.toString();
  }, [searchQuery, selectedSpecialty, selectedArchitecture, selectedValidation, selectedAccess, selectedJournal, fdaOnly, ceOnly, gdprOnly, selectedModalities, aucRange, accRange, sortBy, sortOrder]);

  // Fetch models from API
  const fetchModels = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`/api/models?${buildQueryString(pageNum)}`);
      const data: ApiResponse = await response.json();

      if (append) {
        setModels(prev => [...prev, ...data.models]);
      } else {
        setModels(data.models);
      }

      setTotal(data.pagination.total);
      setHasMore(data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [buildQueryString]);

  // Initial load and filter changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchModels(1, false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedSpecialty, selectedArchitecture, selectedValidation, selectedAccess, selectedJournal, fdaOnly, ceOnly, gdprOnly, selectedModalities, aucRange, accRange, sortBy, sortOrder]);

  // Load more function
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    fetchModels(page + 1, true);
  }, [isLoadingMore, hasMore, page, fetchModels]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
    setSelectedArchitecture("");
    setSelectedValidation("");
    setSelectedAccess("");
    setSelectedJournal("");
    setFdaOnly(false);
    setCeOnly(false);
    setGdprOnly(false);
    setSelectedModalities([]);
    setAucRange([0, 100]);
    setAccRange([0, 100]);
    setSortBy("date");
    setSortOrder("desc");
  };

  const toggleModality = (modality: string) => {
    setSelectedModalities(prev =>
      prev.includes(modality)
        ? prev.filter(m => m !== modality)
        : [...prev, modality]
    );
  };

  // Filter sidebar content (shared between mobile and desktop)
  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      {!isMobile && <h2 className="text-lg font-semibold text-primary">Filters</h2>}

      {/* Imaging Modality */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">IMAGING MODALITY</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {MODALITIES.map((mod) => (
            <label key={mod.label} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedModalities.includes(mod.label)}
                onChange={() => toggleModality(mod.label)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground hover:text-foreground">{mod.label}</span>
              <span className="text-xs text-muted-foreground/60">({mod.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* AUC Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">AUC RANGE</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={aucRange[0]}
              onChange={(e) => setAucRange([Number(e.target.value), aucRange[1]])}
              className="w-16 rounded border border-border px-2 py-1 text-sm"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              min="0"
              max="100"
              value={aucRange[1]}
              onChange={(e) => setAucRange([aucRange[0], Number(e.target.value)])}
              className="w-16 rounded border border-border px-2 py-1 text-sm"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={aucRange[0]}
            onChange={(e) => setAucRange([Number(e.target.value), aucRange[1]])}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Accuracy Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">ACCURACY RANGE</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={accRange[0]}
              onChange={(e) => setAccRange([Number(e.target.value), accRange[1]])}
              className="w-16 rounded border border-border px-2 py-1 text-sm"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              min="0"
              max="100"
              value={accRange[1]}
              onChange={(e) => setAccRange([accRange[0], Number(e.target.value)])}
              className="w-16 rounded border border-border px-2 py-1 text-sm"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={accRange[0]}
            onChange={(e) => setAccRange([Number(e.target.value), accRange[1]])}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Specialty */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">SPECIALTY</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {specialties.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name={`specialty${isMobile ? '-mobile' : ''}`}
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
                name={`architecture${isMobile ? '-mobile' : ''}`}
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
                name={`validation${isMobile ? '-mobile' : ''}`}
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
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Journals</option>
          {journals.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col overflow-hidden">
      {/* Header - Search Bar */}
      <div className="shrink-0 border-b border-border bg-card shadow-sm">
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
              ref={searchInputRef}
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border py-2.5 sm:py-3 pl-10 sm:pl-12 pr-12 sm:pr-14 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <kbd className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-muted text-xs font-medium text-muted-foreground">
              F
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full h-full">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedModalities.length > 0 || aucRange[0] > 0 || accRange[1] < 100) && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {selectedModalities.length + (aucRange[0] > 0 ? 1 : 0) + (accRange[1] < 100 ? 1 : 0)}
              </span>
            )}
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
                <div className="p-4">
                  <FilterContent isMobile />
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full mt-6 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Sidebar - Desktop */}
          <aside className="w-72 shrink-0 hidden lg:block h-full overflow-y-auto">
            <div className="pr-4">
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full h-full flex flex-col overflow-hidden">
            {/* Results Header with Sort */}
            <div className="shrink-0 mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    Showing <span className="font-semibold text-foreground">{models.length}</span> of <span className="font-semibold text-foreground">{total}</span> models
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split('-');
                      setSortBy(by as SortOption);
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="appearance-none rounded-lg border border-border bg-card pl-3 pr-8 py-1.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="auc-desc">Highest AUC</option>
                    <option value="auc-asc">Lowest AUC</option>
                    <option value="accuracy-desc">Highest Accuracy</option>
                    <option value="accuracy-asc">Lowest Accuracy</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-1.5 sm:p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-1.5 sm:p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(selectedModalities.length > 0 || selectedSpecialty || selectedArchitecture || aucRange[0] > 0 || accRange[1] < 100) && (
              <div className="shrink-0 mb-4 flex flex-wrap gap-2">
                {selectedModalities.map(m => (
                  <span key={m} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {m}
                    <button onClick={() => toggleModality(m)} className="hover:text-primary/70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedSpecialty && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {selectedSpecialty}
                    <button onClick={() => setSelectedSpecialty("")} className="hover:text-primary/70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedArchitecture && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {selectedArchitecture}
                    <button onClick={() => setSelectedArchitecture("")} className="hover:text-primary/70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(aucRange[0] > 0 || aucRange[1] < 100) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    AUC: {aucRange[0]}-{aucRange[1]}%
                    <button onClick={() => setAucRange([0, 100])} className="hover:text-emerald-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(accRange[0] > 0 || accRange[1] < 100) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    Acc: {accRange[0]}-{accRange[1]}%
                    <button onClick={() => setAccRange([0, 100])} className="hover:text-blue-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Loading State */}
              {isLoading && (
                <div className="py-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Model Cards Grid */}
              {!isLoading && (
                <div className={viewMode === "grid" ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4 sm:space-y-6"}>
                  {models.map((model) => (
                    <ModelCard key={model.id} model={model} viewMode={viewMode} />
                  ))}
                </div>
              )}

              {/* Infinite scroll trigger */}
              {!isLoading && hasMore && (
                <div ref={loadMoreRef} className="py-8 flex justify-center">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    <button
                      onClick={loadMore}
                      className="px-6 py-2 rounded-lg border border-border hover:bg-secondary text-sm text-muted-foreground"
                    >
                      Load more
                    </button>
                  )}
                </div>
              )}

              {!isLoading && models.length === 0 && (
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Detect modality from model name/description
function detectModality(model: ModelData): string | null {
  const text = `${model.name} ${model.description}`.toLowerCase();

  if (text.includes('echocardiograph') || text.includes('echo ')) return 'Echo';
  if (text.includes('mri') || text.includes('magnetic resonance')) return 'MRI';
  if (text.includes(' ct ') || text.includes('computed tomography')) return 'CT';
  if (text.includes('x-ray') || text.includes('xray') || text.includes('radiograph')) return 'X-ray';
  if (text.includes('ultrasound') || text.includes('ultrason')) return 'US';
  if (text.includes('fundus')) return 'Fundus';
  if (text.includes(' oct ') || text.includes('optical coherence')) return 'OCT';
  if (text.includes('ecg') || text.includes('ekg') || text.includes('electrocardiog')) return 'ECG';
  if (text.includes('pet ') || text.includes('positron')) return 'PET';
  if (text.includes('mammograph')) return 'Mammo';
  if (text.includes('endoscop') || text.includes('colonoscop')) return 'Endo';
  if (text.includes('dermoscop')) return 'Dermo';
  if (text.includes('histopath') || text.includes('patholog')) return 'Histo';

  return null;
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

  const modality = detectModality(model);

  if (viewMode === "list") {
    return (
      <Link href={`/models/${model.slug}`} className="block">
        <div className="cursor-pointer rounded-xl border-2 border-border p-3 sm:p-4 transition-all hover:border-primary/30 hover:shadow-md hover:bg-[rgba(200,50,255,0.1)] overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h3 className="font-semibold text-foreground text-sm sm:text-base break-words">{model.name}</h3>
                <span className={`rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${specialtyColors[model.specialty] || "bg-gray-100 text-gray-700"}`}>
                  {model.specialty}
                </span>
                {modality && (
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                    {modality}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {model.metrics?.auc > 0 && (
                  <span className="text-xs text-emerald-600 font-medium">AUC: {(model.metrics.auc * 100).toFixed(1)}%</span>
                )}
                {model.metrics?.accuracy > 0 && (
                  <span className="text-xs text-blue-600 font-medium">Acc: {(model.metrics.accuracy * 100).toFixed(1)}%</span>
                )}
                {model.metrics?.sensitivity > 0 && (
                  <span className="text-xs text-purple-600 font-medium">Sens: {(model.metrics.sensitivity * 100).toFixed(1)}%</span>
                )}
                {model.metrics?.specificity > 0 && (
                  <span className="text-xs text-orange-600 font-medium">Spec: {(model.metrics.specificity * 100).toFixed(1)}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/models/${model.slug}`} className="h-full block">
      <div className="group flex h-full cursor-pointer flex-col rounded-xl border-2 border-border p-4 sm:p-5 transition-all hover:border-primary/20 hover:shadow-lg hover:bg-[rgba(200,50,255,0.1)] overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary line-clamp-2 text-sm sm:text-base break-words">{model.name}</h3>
            {model.journal && (
              <p className="mt-1 text-xs text-muted-foreground truncate">{model.journal}</p>
            )}
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            {model.validation.externalValidation && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary" title="External Validation">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {model.regulatory.fdaApproved && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600" title="FDA Approved">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Tags Row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${specialtyColors[model.specialty] || "bg-gray-100 text-gray-700"}`}>
            {model.specialty}
          </span>
          {modality && (
            <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-700">
              {modality}
            </span>
          )}
          {model.architecture && (
            <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
              {model.architecture}
            </span>
          )}
        </div>

        {/* Metrics - always at bottom */}
        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          {model.metrics?.auc > 0 && (
            <div className="rounded-lg bg-emerald-50 px-2 py-1.5 text-center">
              <div className="text-[10px] text-emerald-600 font-medium uppercase">AUC</div>
              <div className="text-sm font-bold text-emerald-700">{(model.metrics.auc * 100).toFixed(1)}%</div>
            </div>
          )}
          {model.metrics?.accuracy > 0 && (
            <div className="rounded-lg bg-blue-50 px-2 py-1.5 text-center">
              <div className="text-[10px] text-blue-600 font-medium uppercase">Accuracy</div>
              <div className="text-sm font-bold text-blue-700">{(model.metrics.accuracy * 100).toFixed(1)}%</div>
            </div>
          )}
          {model.metrics?.sensitivity > 0 && (
            <div className="rounded-lg bg-purple-50 px-2 py-1.5 text-center">
              <div className="text-[10px] text-purple-600 font-medium uppercase">Sensitivity</div>
              <div className="text-sm font-bold text-purple-700">{(model.metrics.sensitivity * 100).toFixed(1)}%</div>
            </div>
          )}
          {model.metrics?.specificity > 0 && (
            <div className="rounded-lg bg-orange-50 px-2 py-1.5 text-center">
              <div className="text-[10px] text-orange-600 font-medium uppercase">Specificity</div>
              <div className="text-sm font-bold text-orange-700">{(model.metrics.specificity * 100).toFixed(1)}%</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
