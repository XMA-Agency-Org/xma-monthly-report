import Input from "@/components/Input";
import Label from "@/components/Label";
import type { PlatformMetrics } from "../_types/report";
import { computeCpa } from "../_lib/platforms";

interface PlatformSectionProps {
  platformName: string;
  color: string;
  metrics: PlatformMetrics;
  onChange: (updates: Partial<PlatformMetrics>) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

export default function PlatformSection({ platformName, color, metrics, onChange }: PlatformSectionProps) {
  const cpa = computeCpa(metrics.adSpend, metrics.conversions);

  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-foreground">{platformName}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${platformName}-spend`}>Ad Spend ($)</Label>
          <Input
            id={`${platformName}-spend`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={metrics.adSpend || ""}
            onChange={(e) => onChange({ adSpend: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${platformName}-conversions`}>Conversions</Label>
          <Input
            id={`${platformName}-conversions`}
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={metrics.conversions || ""}
            onChange={(e) => onChange({ conversions: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>CPA (Auto-calculated)</Label>
          <div className="flex h-10 items-center rounded-lg border border-border bg-surface/50 px-3 text-sm text-muted">
            {metrics.adSpend > 0 || metrics.conversions > 0 ? formatCurrency(cpa) : "—"}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${platformName}-roas`}>ROAS</Label>
          <Input
            id={`${platformName}-roas`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={metrics.roas || ""}
            onChange={(e) => onChange({ roas: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${platformName}-revenue`}>Revenue ($)</Label>
          <Input
            id={`${platformName}-revenue`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={metrics.revenue || ""}
            onChange={(e) => onChange({ revenue: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
