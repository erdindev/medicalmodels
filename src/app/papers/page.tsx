"use client";

import { useState, useMemo } from "react";
import { demoPapers, paperSpecialties, Paper } from "@/lib/papers";
import { formatNumber } from "@/lib/utils";

export default function PapersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortBy, setSortBy] = useState<"citations" | "year">("citations");

  const filteredPapers = useMemo(() => {
    let papers = demoPapers.filter((paper) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          paper.title.toLowerCase().includes(q) ||
          paper.abstract.toLowerCase().includes(q) ||
          paper.authors.some((a) => a.toLowerCase().includes(q)) ||
          paper.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedSpecialty && paper.specialty !== selectedSpecialty) return false;
      return true;
    });

    // Sort
    if (sortBy === "citations") {
      papers = papers.sort((a, b) => b.citations - a.citations);
    } else {
      papers = papers.sort((a, b) => b.year - a.year);
    }

    return papers;
  }, [searchQuery, selectedSpecialty, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">Research Papers</h1>
          <p className="mt-2 text-muted-foreground">
            Key publications in medical AI research and model development
          </p>

          {/* Search & Filters */}
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
                placeholder="Search papers, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">All Specialties</option>
              {paperSpecialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "citations" | "year")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="citations">Most Cited</option>
              <option value="year">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredPapers.length}</span> papers found
        </p>

        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No papers match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground leading-snug">{paper.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {paper.authors.slice(0, 3).join(", ")}
            {paper.authors.length > 3 && " et al."}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold text-primary">{formatNumber(paper.citations)}</div>
          <div className="text-xs text-muted-foreground">citations</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{paper.abstract}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {paper.specialty}
        </span>
        <span className="text-sm text-muted-foreground">
          {paper.journal} ({paper.year})
        </span>
        {paper.doi && (
          <span className="text-xs text-muted-foreground">
            DOI: {paper.doi}
          </span>
        )}
        {paper.arxivId && (
          <span className="text-xs text-muted-foreground">
            arXiv: {paper.arxivId}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {paper.tags.map((tag) => (
          <span key={tag} className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      {(paper.modelNames || paper.datasetNames) && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
          {paper.modelNames?.map((name) => (
            <span key={name} className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              Model: {name}
            </span>
          ))}
          {paper.datasetNames?.map((name) => (
            <span key={name} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              Dataset: {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
