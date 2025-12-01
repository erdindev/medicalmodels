"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MedicalModel } from "@/lib/data";

interface HeroSearchProps {
    modelCount?: number;
    specialtyCount?: number;
}

export function HeroSearch({ modelCount = 0, specialtyCount = 0 }: HeroSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [models, setModels] = useState<MedicalModel[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        async function fetchModels() {
            try {
                const res = await fetch('/api/models?limit=100');
                const data = await res.json();
                // API returns { models: [...], pagination: {...} }
                const modelList = data.models || [];
                setModels(modelList);
            } catch (e) {
                console.error(e);
            }
        }
        fetchModels();
    }, []);


    const results = useMemo(() => {
        if (!query.trim()) {
            return models.slice(0, 5);
        }
        const q = query.toLowerCase();
        return models.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.specialty.toLowerCase().includes(q) ||
                m.tags.some((t) => t.includes(q))
        ).slice(0, 6);
    }, [query, models]);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [results]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showResults || !isFocused) return;

        const totalItems = results.length + 1; // +1 for "View all models"

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            if (selectedIndex < results.length) {
                router.push(`/models/${results[selectedIndex].slug}`);
            } else {
                router.push(`/models${query ? `?q=${encodeURIComponent(query)}` : ''}`);
            }
            setIsFocused(false);
            setShowResults(false);
        } else if (e.key === "Escape") {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
                if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    inputRef.current?.focus();
                }
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            router.push(`/models/${results[selectedIndex].slug}`);
        } else {
            router.push(`/models?q=${encodeURIComponent(query)}`);
        }
        setIsFocused(false);
    };

    return (
        <div className="relative">
            {/* Dimming Overlay */}
            {isFocused && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-all duration-200"
                    onClick={() => setIsFocused(false)}
                />
            )}

            <section className="relative z-50 mx-auto max-w-4xl px-4 h-[calc(50vh-56px)] flex flex-col items-center justify-center text-center">
                {/* Minimal headline */}
                <h1 className="mb-16 sm:mb-4 text-3xl font-black tracking-tight text-primary sm:text-white sm:text-4xl relative z-[60]">
                    Discover Medical AI Models
                </h1>


                {/* Search Wrapper to handle layering */}
                <div className="relative z-50 mx-auto w-full flex flex-col items-center">
                    {/* Background image - Layer 0 */}
                    <div className="hidden sm:block absolute -inset-y-12 inset-x-0 sm:-inset-y-24 sm:-inset-x-16 -z-10 overflow-hidden rounded-3xl bg-transparent">
                        <Image
                            src="/bgfarbe.jpg"
                            alt=""
                            fill
                            priority
                            className="object-fill opacity-80 blur-[2px]"
                            sizes="100vw"
                        />
                    </div>

                    {/* Search Input - Layer 2 (Top) */}
                    <form ref={formRef} onSubmit={handleSearch} className="relative z-20 w-[70%] sm:w-full">
                        <div className={`relative transition-transform duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                                <svg
                                    className={`h-5 w-5 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="search"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => {
                                    setIsFocused(true);
                                    setShowResults(true);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search models, specialties, conditions..."
                                className={`w-full rounded-xl border bg-white py-4 pl-14 pr-14 text-base shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none ${isFocused
                                    ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                                    : 'border-border hover:border-muted-foreground/50'
                                    }`}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs text-muted-foreground">
                                    /
                                </kbd>
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && isFocused && results.length > 0 && (
                            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                                {results.map((model, idx) => (
                                    <Link
                                        key={model.id}
                                        href={`/models/${model.slug}`}
                                        onClick={() => {
                                            setShowResults(false);
                                            setIsFocused(false);
                                        }}
                                        className={`flex items-center justify-between px-4 py-3 transition-colors ${idx !== results.length - 1 ? 'border-b border-border/50' : ''
                                            } ${selectedIndex === idx ? 'bg-[rgba(200,50,255,0.1)]' : 'hover:bg-[rgba(200,50,255,0.1)]'}`}
                                    >
                                        <div className="text-left">
                                            <p className="font-medium text-foreground text-sm">{model.name}</p>
                                            <p className="text-xs text-muted-foreground">{model.specialty}</p>
                                        </div>
                                        {model.metrics.auc > 0 && (
                                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                AUC {(model.metrics.auc * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </Link>
                                ))}
                                <Link
                                    href={`/models${query ? `?q=${encodeURIComponent(query)}` : ''}`}
                                    onClick={() => setIsFocused(false)}
                                    className={`block px-4 py-3 text-center text-sm text-primary transition-colors border-t border-border ${selectedIndex === results.length ? 'bg-[rgba(200,50,255,0.1)]' : 'hover:bg-[rgba(200,50,255,0.1)]'
                                        }`}
                                >
                                    View all models →
                                </Link>
                            </div>
                        )}
                    </form>

                    {/* Trusted by line - Layer 1 (Middle) */}
                    <p className="mt-6 text-sm text-primary sm:text-white font-bold relative z-10">
                        Trusted by professionals
                    </p>
                </div>
            </section>
        </div>
    );
}
