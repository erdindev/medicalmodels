"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault(); // Prevent scrolling
                acceptCookies();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isVisible]);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:p-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
                <div className="text-sm text-muted-foreground">
                    <p>
                        We use cookies to enhance your experience and analyze our traffic. By continuing to visit this site you agree to our use of cookies.
                        <Link href="/datenschutz" className="ml-1 text-primary hover:underline">
                            Learn more
                        </Link>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                        <span className="flex h-5 w-5 items-center justify-center rounded border border-border bg-secondary font-mono text-[10px]">
                            ␣
                        </span>
                        <span>Press Space to accept</span>
                    </div>
                    <button
                        onClick={acceptCookies}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
