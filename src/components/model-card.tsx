import Link from "next/link";
import { MedicalModel } from "@/lib/data";

interface ModelCardProps {
  model: MedicalModel;
}

export function ModelCard({ model }: ModelCardProps) {
  const accessColors: Record<string, string> = {
    "open-source": "bg-green-100 text-green-800",
    "api": "bg-blue-100 text-blue-800",
    "commercial": "bg-purple-100 text-purple-800",
    "research-only": "bg-orange-100 text-orange-800",
  };

  return (
    <Link href={`/models/${model.slug}`}>
      <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{model.organization}</span>
            </div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {model.name}
            </h3>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${accessColors[model.practical.accessType]}`}>
            {model.practical.accessType}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{model.description}</p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">AUC</div>
            <div className="font-semibold text-sm">{(model.metrics.auc * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Sens.</div>
            <div className="font-semibold text-sm">{(model.metrics.sensitivity * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Spec.</div>
            <div className="font-semibold text-sm">{(model.metrics.specificity * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Acc.</div>
            <div className="font-semibold text-sm">{(model.metrics.accuracy * 100).toFixed(1)}%</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{model.specialty}</span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{model.useCase}</span>
          {model.regulatory.fdaApproved && <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">FDA</span>}
          {model.regulatory.ceMark && <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">CE</span>}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{model.downloads.toLocaleString()} downloads</span>
            <span>{model.likes.toLocaleString()} likes</span>
          </div>
          <span>Updated {model.updatedAt}</span>
        </div>
      </div>
    </Link>
  );
}
