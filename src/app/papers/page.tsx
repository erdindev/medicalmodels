"use client";

import { useState, useEffect } from "react";

interface ScrapedPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string | null;
  pubDate: string | null;
  specialty: string;
  pubmedUrl: string | null;
  githubUrl: string | null;
  hasModel: boolean;
  doi: string | null;
}

const SPECIALTIES = ["radiology", "pathology", "dermatology"];

export default function PapersPage() {
  const [papers, setPapers] = useState<ScrapedPaper[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [hasCodeOnly, setHasCodeOnly] = useState(false);

  useEffect(() => {
    fetchPapers();
  }, [selectedSpecialty, hasCodeOnly]);

  async function fetchPapers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSpecialty) params.set("specialty", selectedSpecialty);
      if (hasCodeOnly) params.set("hasModel", "true");
      params.set("limit", "200");

      const res = await fetch("/api/papers?" + params.toString());
      const data = await res.json();
      setPapers(data.papers || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error("Error fetching papers:", e);
    }
    setLoading(false);
  }

  const filteredPapers = papers.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">Research Papers</h1>
          <p className="mt-2 text-muted-foreground">
            {total} deep learning papers in medical imaging from PubMed
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-md rounded-lg border border-border py-2.5 px-4 text-sm focus:border-primary focus:outline-none"
            />

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="rounded-lg border border-border px-4 py-2.5 text-sm"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={hasCodeOnly}
                onChange={(e) => setHasCodeOnly(e.target.checked)}
              />
              Has Code
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {filteredPapers.length} papers
            </p>

            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>

            {filteredPapers.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No papers found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PaperCard({ paper }: { paper: ScrapedPaper }) {
  let authors: string[] = [];
  try {
    authors = JSON.parse(paper.authors);
  } catch {
    authors = [];
  }

  const authorDisplay = authors.length > 3
    ? authors.slice(0, 3).join(", ") + " et al."
    : authors.join(", ");

  const year = paper.pubDate ? paper.pubDate.split("-")[0] : null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{paper.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{authorDisplay}</p>
        </div>
        {paper.hasModel && (
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Has Code
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{paper.abstract}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize">
          {paper.specialty}
        </span>
        {paper.journal && (
          <span className="text-sm text-muted-foreground">
            {paper.journal} {year && "(" + year + ")"}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        {paper.pubmedUrl && (
          <a
            href={paper.pubmedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/50"
          >
            PubMed
          </a>
        )}
        {paper.doi && (
          <a
            href={"https://doi.org/" + paper.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/50"
          >
            DOI
          </a>
        )}
        {paper.githubUrl && (
          <a
            href={paper.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}
