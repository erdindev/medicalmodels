"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoModels, specialties } from "@/lib/data";

export function HeroSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.metaKey) {
                if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    inputRef.current?.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const results = useMemo(() => {
        if (!query.trim()) {
            // Return alphabetical suggestions when query is empty
            return demoModels
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, 5);
        }
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
            setIsFocused(false); // Close search results on submit
        }
    };

    return (
        <div className="relative bg-gradient-to-b from-primary/10 via-background to-background pb-12 pt-16">
            {/* Dimming Overlay */}
            {isFocused && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
                    onClick={() => setIsFocused(false)}
                />
            )}

            <section className="relative mx-auto max-w-4xl px-4 text-center">
                <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                    <span className="mr-2 flex h-2 w-2 rounded-full bg-primary"></span>
                    Now with 500+ Medical AI Models
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    Find <span className="text-primary">Medical AI Models</span> <br />
                    for Clinical & Research Use
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                    Discover verified medical AI models for clinical use.
                </p>

                {/* Search Input - Enhanced */}
                <form onSubmit={handleSearch} className="relative z-50 mx-auto max-w-2xl transition-all duration-300">
                    <div className={`relative ${isFocused ? 'scale-105' : ''} transition-transform duration-300`}>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 gap-2">
                            <svg className={`h-5 w-5 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {!isFocused && !query && (
                                <span className="hidden sm:inline-flex h-5 w-5 items-center justify-center rounded border border-muted-foreground/30 bg-muted text-[10px] font-medium text-muted-foreground">
                                    F
                                </span>
                            )}
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => {
                                setIsFocused(true);
                                setShowResults(true);
                            }}
                            placeholder="Search by model name, specialty, or condition..."
                            className={`w-full rounded-2xl border bg-background py-4 pl-12 pr-4 text-lg shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none ${isFocused
                                ? 'border-primary ring-4 ring-primary/20 shadow-xl'
                                : 'border-border'
                                }`}
                            autoFocus
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && isFocused && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {!query.trim() && (
                                <div className="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Suggested Models
                                </div>
                            )}
                            {results.map((model) => (
                                <Link
                                    key={model.id}
                                    href={`/models/${model.slug}`}
                                    onClick={() => {
                                        setShowResults(false);
                                        setIsFocused(false);
                                    }}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0 group"
                                >
                                    <div className="text-left flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{model.name}</p>
                                            <p className="text-sm text-muted-foreground">{model.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{(model.metrics.auc * 100).toFixed(0)}%</p>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AUC</p>
                                    </div>
                                </Link>
                            ))}
                            {query.trim() && (
                                <Link
                                    href={`/models?q=${encodeURIComponent(query)}`}
                                    className="block bg-muted/30 px-4 py-3 text-center text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
                                >
                                    View all results
                                </Link>
                            )}
                        </div>
                    )}
                </form>

                {/* Quick Filters */}
                <div className={`mt-8 flex flex-wrap justify-center gap-2 transition-opacity duration-300 ${isFocused ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
                    {specialties.slice(0, 6).map((s) => (
                        <Link
                            key={s}
                            href={`/models?specialty=${s}`}
                            className="rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                        >
                            {s}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
