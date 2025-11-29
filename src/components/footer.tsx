import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-secondary/30">
            {/* Disclaimer Banner */}
            <div className="border-b border-border bg-amber-50/50">
                <div className="mx-auto max-w-7xl px-4 py-3">
                    <div className="flex items-start gap-2 text-xs text-amber-800">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>
                            <strong>For Research Purposes Only.</strong> This platform provides information from peer-reviewed publications.
                            It does not provide medical advice. All model data and metrics remain the intellectual property of the original authors.
                            <Link href="/disclaimer" className="ml-1 underline hover:text-amber-900">Read full disclaimer</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 text-foreground mb-4">
                            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="font-semibold text-lg">medicalmodels.co</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Discover, compare, and evaluate medical AI models from peer-reviewed publications.
                            A research tool for healthcare professionals and developers.
                        </p>
                        <p className="mt-4 text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Tokmak Systems. All rights reserved.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/models" className="hover:text-primary">Browse Models</Link></li>
                            <li><Link href="/papers" className="hover:text-primary">Research Papers</Link></li>
                            <li><Link href="/compare" className="hover:text-primary">Compare Models</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
                            <li><Link href="/impressum" className="hover:text-primary">Impressum</Link></li>
                            <li><Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
