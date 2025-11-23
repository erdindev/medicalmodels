"use client";

import { specialties, useCases } from "@/lib/data";

interface FilterSidebarProps {
  filters: {
    specialty: string;
    useCase: string;
    accessType: string;
    fdaApproved: boolean;
  };
  onFilterChange: (key: string, value: string | boolean) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 space-y-6">
        <div>
          <h3 className="font-semibold text-sm mb-3">Specialty</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="specialty" checked={filters.specialty === ""} onChange={() => onFilterChange("specialty", "")} className="text-primary" />
              <span className="text-muted-foreground">All Specialties</span>
            </label>
            {specialties.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="specialty" checked={filters.specialty === s} onChange={() => onFilterChange("specialty", s)} className="text-primary" />
                <span className="text-muted-foreground hover:text-foreground">{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Use Case</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="useCase" checked={filters.useCase === ""} onChange={() => onFilterChange("useCase", "")} className="text-primary" />
              <span className="text-muted-foreground">All Use Cases</span>
            </label>
            {useCases.map((u) => (
              <label key={u} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="useCase" checked={filters.useCase === u} onChange={() => onFilterChange("useCase", u)} className="text-primary" />
                <span className="text-muted-foreground hover:text-foreground">{u}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Access Type</h3>
          <div className="space-y-2">
            {["", "open-source", "api", "commercial", "research-only"].map((type) => (
              <label key={type || "all"} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="accessType" checked={filters.accessType === type} onChange={() => onFilterChange("accessType", type)} className="text-primary" />
                <span className="text-muted-foreground hover:text-foreground">{type === "" ? "All Types" : type}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Regulatory</h3>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={filters.fdaApproved} onChange={(e) => onFilterChange("fdaApproved", e.target.checked)} className="rounded text-primary" />
            <span className="text-muted-foreground hover:text-foreground">FDA Approved</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
