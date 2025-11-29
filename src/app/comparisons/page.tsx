"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function MyComparisonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/comparisons");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Demo comparisons
  const comparisons = [
    {
      id: "1",
      name: "Chest X-ray Models",
      modelCount: 3,
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-dot-grid">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">My Comparisons</h1>
          <Link
            href="/compare"
            className="text-sm text-primary hover:underline"
          >
            New comparison
          </Link>
        </div>

        {comparisons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No saved comparisons yet.</p>
            <Link href="/compare" className="text-primary hover:underline">
              Create a comparison
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comparisons.map((comparison) => (
              <Link
                key={comparison.id}
                href={`/compare?saved=${comparison.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{comparison.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {comparison.modelCount} models
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comparison.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
