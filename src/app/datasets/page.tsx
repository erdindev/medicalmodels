"use client";

import { useState, useMemo } from "react";
import { demoDatasets, modalities, Dataset } from "@/lib/datasets";
import { formatNumber } from "@/lib/utils";

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModality, setSelectedModality] = useState("");
  const [selectedAccess, setSelectedAccess] = useState("");

  const filteredDatasets = useMemo(() => {
    return demoDatasets.filter((dataset) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          dataset.name.toLowerCase().includes(q) ||
          dataset.description.toLowerCase().includes(q) ||
          dataset.specialty.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedModality && dataset.modality !== selectedModality) return false;
      if (selectedAccess && dataset.access !== selectedAccess) return false;
      return true;
    });
  }, [searchQuery, selectedModality, selectedAccess]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">Datasets</h1>
          <p className="mt-2 text-muted-foreground">
            Explore medical imaging and clinical datasets used for training and validating AI models
          </p>

          {/* Search */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">All Modalities</option>
              {modalities.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">All Access Types</option>
              <option value="open">Open Access</option>
              <option value="restricted">Restricted</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredDatasets.length}</span> datasets found
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No datasets match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DatasetCard({ dataset }: { dataset: Dataset }) {
  const accessColors = {
    open: "bg-green-100 text-green-700",
    restricted: "bg-amber-100 text-amber-700",
    commercial: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{dataset.name}</h3>
          <p className="text-sm text-muted-foreground">{dataset.organization}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${accessColors[dataset.access]}`}>
          {dataset.access}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{dataset.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {dataset.modality}
        </span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {dataset.specialty}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Samples</p>
          <p className="font-semibold text-foreground">{formatNumber(dataset.size.samples)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Publications</p>
          <p className="font-semibold text-foreground">{formatNumber(dataset.publications)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {dataset.annotations.slice(0, 3).map((ann) => (
          <span key={ann} className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            {ann}
          </span>
        ))}
      </div>
    </div>
  );
}
