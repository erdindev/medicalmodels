"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { demoModels } from "@/lib/data";

export default function SavedModelsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedModelIds, setSavedModelIds] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/saved");
    }
  }, [status, router]);

  // Demo: Show some models as "saved"
  const savedModels = demoModels.slice(0, 3);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Saved Models</h1>

        {savedModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No saved models yet.</p>
            <Link href="/" className="text-primary hover:underline">
              Browse models
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedModels.map((model) => (
              <Link
                key={model.id}
                href={`/models/${model.slug}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{model.name}</p>
                    <p className="text-sm text-muted-foreground">{model.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">
                      {(model.metrics.auc * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">AUC</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
