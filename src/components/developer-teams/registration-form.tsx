"use client";

import { useState } from "react";
import Link from "next/link";

export function RegistrationForm() {
    const [formData, setFormData] = useState({
        teamName: "",
        email: "",
        website: "",
        description: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your API
        console.log("Form submitted:", formData);
        setSubmitted(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (submitted) {
        return (
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center mx-auto">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                        <svg
                            className="h-8 w-8 text-green-600 dark:text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Registration Received!
                </h2>
                <p className="mb-6 text-muted-foreground">
                    Thank you for registering your developer team. We will review your
                    application and get back to you shortly.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="teamName"
                        className="block text-sm font-medium text-foreground"
                    >
                        Team Name
                    </label>
                    <input
                        type="text"
                        name="teamName"
                        id="teamName"
                        required
                        value={formData.teamName}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. NeuroAI Labs"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground"
                    >
                        Contact Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="contact@example.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="website"
                        className="block text-sm font-medium text-foreground"
                    >
                        Website (Optional)
                    </label>
                    <input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="https://example.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-foreground"
                    >
                        Team Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Tell us about your team and what you're building..."
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Register Team
                    </button>
                </div>
            </form>
        </div>
    );
}
