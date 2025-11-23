"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { demoModels, specialties } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return demoModels.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q))
    ).slice(0, 6);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/models?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search */}
      <section className="mx-auto max-w-4xl px-4 pt-24 pb-12">
        <h1 className="text-center text-3xl font-semibold text-foreground">
          Find Medical AI Models
        </h1>

        {/* Search Input - Border Bottom Only */}
        <form onSubmit={handleSearch} className="relative mt-10">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search by model name, specialty, or condition..."
            className="w-full border-0 border-b-2 border-border bg-transparent pb-3 text-xl text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
            autoFocus
          />

          {/* Search Results Dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-border bg-card shadow-lg">
              {results.map((model) => (
                <Link
                  key={model.id}
                  href={`/models/${model.slug}`}
                  onClick={() => setShowResults(false)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{model.name}</p>
                    <p className="text-sm text-muted-foreground">{model.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{(model.metrics.auc * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">AUC</p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/models?q=${encodeURIComponent(query)}`}
                className="block border-t border-border px-4 py-2 text-center text-sm text-primary hover:bg-secondary/50"
              >
                View all results
              </Link>
            </div>
          )}
        </form>

        {/* Quick Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {specialties.slice(0, 6).map((s) => (
            <Link
              key={s}
              href={`/models?specialty=${s}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* Models Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{demoModels.length} models</p>
          <Link href="/compare" className="text-sm text-primary hover:underline">
            Compare models
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoModels.map((model) => (
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
    </div>
  );
}
