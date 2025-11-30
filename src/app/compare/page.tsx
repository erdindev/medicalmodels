"use client";

import { useState, useMemo } from "react";
import { demoModels, MedicalModel } from "@/lib/data";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Generate synthetic ROC curve data points
function generateROCData(auc: number, modelName: string) {
  const points = [];
  const n = 50;

  for (let i = 0; i <= n; i++) {
    const fpr = i / n;
    // Approximate ROC curve based on AUC
    // Using a power function to create curve shape
    const power = Math.log(auc) / Math.log(0.5);
    const tpr = Math.pow(fpr, 1 / (power + 1));
    points.push({
      fpr: parseFloat((fpr * 100).toFixed(1)),
      [modelName]: parseFloat((tpr * 100).toFixed(1)),
    });
  }
  return points;
}

// Merge ROC data for multiple models
function mergeROCData(models: MedicalModel[]) {
  if (models.length === 0) return [];

  const allData: Record<string, number>[] = [];

  for (let i = 0; i <= 50; i++) {
    const fpr = i / 50;
    const point: Record<string, number> = { fpr: parseFloat((fpr * 100).toFixed(1)) };

    models.forEach((model) => {
      const power = Math.log(model.metrics.auc) / Math.log(0.5);
      const tpr = Math.pow(fpr, 1 / (power + 1));
      point[model.name] = parseFloat((tpr * 100).toFixed(1));
    });

    allData.push(point);
  }

  return allData;
}

const COLORS = ["#4ade80", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#34d399"];

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedModels = useMemo(() => {
    return demoModels.filter((m) => selectedIds.includes(m.id));
  }, [selectedIds]);

  const availableModels = useMemo(() => {
    return demoModels.filter((m) => {
      if (selectedIds.includes(m.id)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q)
      );
    });
  }, [selectedIds, searchQuery]);

  const rocData = useMemo(() => mergeROCData(selectedModels), [selectedModels]);

  const toggleModel = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getBestValue = (metric: keyof MedicalModel["metrics"]) => {
    if (selectedModels.length === 0) return null;
    return Math.max(...selectedModels.map((m) => m.metrics[metric]));
  };

  const getWorstValue = (metric: keyof MedicalModel["metrics"]) => {
    if (selectedModels.length === 0) return null;
    return Math.min(...selectedModels.map((m) => m.metrics[metric]));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Model Comparison</h1>
          <p className="mt-1 text-muted-foreground">
            Compare performance metrics, validation status, and implementation details side-by-side
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Model Selection Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold text-foreground mb-4">Add Models to Compare</h2>

              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    className="w-full rounded-lg border border-border p-3 text-left transition-all hover:border-primary/50 hover:bg-secondary/50"
                  >
                    <p className="font-medium text-foreground text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.specialty}</p>
                  </button>
                ))}
              </div>

              {selectedModels.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">SELECTED ({selectedModels.length})</h3>
                  <div className="space-y-2">
                    {selectedModels.map((model, idx) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="text-sm text-foreground">{model.name}</span>
                        </div>
                        <button
                          onClick={() => toggleModel(model.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Comparison Area */}
          <main className="lg:col-span-3 space-y-8">
            {selectedModels.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No models selected</h3>
                <p className="mt-2 text-muted-foreground">Select models from the sidebar to start comparing</p>
              </div>
            ) : (
              <>
                {/* ROC Curves Chart */}
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">ROC Curves</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rocData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="fpr"
                          label={{ value: "False Positive Rate (%)", position: "bottom", offset: -5 }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          label={{ value: "True Positive Rate (%)", angle: -90, position: "insideLeft" }}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        {/* Diagonal reference line */}
                        <Line
                          type="linear"
                          dataKey="fpr"
                          name="Random (AUC=0.5)"
                          stroke="#94a3b8"
                          strokeDasharray="5 5"
                          dot={false}
                          strokeWidth={1}
                        />
                        {selectedModels.map((model, idx) => (
                          <Line
                            key={model.id}
                            type="monotone"
                            dataKey={model.name}
                            stroke={COLORS[idx % COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                            name={`${model.name} (AUC: ${model.metrics.auc.toFixed(3)})`}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Metrics Comparison Table */}
                <section className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Performance Metrics</h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-semibold text-muted-foreground">Metric</th>
                        {selectedModels.map((model, idx) => (
                          <th key={model.id} className="pb-3 text-center text-sm font-semibold">
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                              <span className="text-foreground">{model.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(["sensitivity", "specificity", "auc", "accuracy"] as const).map((metric) => (
                        <tr key={metric} className="border-b border-border/50">
                          <td className="py-4 text-sm font-medium text-foreground capitalize">{metric}</td>
                          {selectedModels.map((model) => {
                            const value = model.metrics[metric];
                            const isBest = value === getBestValue(metric);
                            const isWorst = value === getWorstValue(metric) && selectedModels.length > 1;
                            return (
                              <td key={model.id} className="py-4 text-center">
                                <span
                                  className={`text-lg font-semibold ${isBest ? "text-green-600" : isWorst ? "text-red-500" : "text-foreground"
                                    }`}
                                >
                                  {metric === "auc" ? value.toFixed(3) : `${(value * 100).toFixed(1)}%`}
                                </span>
                                {isBest && <span className="ml-1 text-xs text-green-600">★</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                {/* Validation Comparison */}
                <section className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Validation & Regulatory</h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-semibold text-muted-foreground">Attribute</th>
                        {selectedModels.map((model) => (
                          <th key={model.id} className="pb-3 text-center text-sm font-semibold text-foreground">
                            {model.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">Validation Type</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center text-sm capitalize text-muted-foreground">
                            {model.validation.validationType}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">External Validation</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center">
                            {model.validation.externalValidation ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">Publications</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center text-sm text-muted-foreground">
                            {model.validation.publications}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">FDA Approved</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center">
                            {model.regulatory.fdaApproved ? (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Yes</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">CE Mark</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center">
                            {model.regulatory.ceMark ? (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Yes</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 text-sm text-foreground">Dataset Size</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center text-sm text-muted-foreground">
                            {model.training.datasetSize.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </section>

                {/* Implementation Comparison */}
                <section className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Implementation</h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-semibold text-muted-foreground">Attribute</th>
                        {selectedModels.map((model) => (
                          <th key={model.id} className="pb-3 text-center text-sm font-semibold text-foreground">
                            {model.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">Access Type</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${model.practical.accessType === "open-source"
                                ? "bg-green-100 text-green-700"
                                : model.practical.accessType === "api"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}>
                              {model.practical.accessType}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">Cost</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center text-sm text-muted-foreground">
                            {model.practical.cost}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">Hardware</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center text-sm text-muted-foreground">
                            {model.practical.hardwareRequirements}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 text-sm text-foreground">Support</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="py-3 text-center">
                            {model.practical.hasSupport ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
