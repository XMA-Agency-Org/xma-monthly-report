import Input from "@/components/Input";
import Label from "@/components/Label";
import type { CampaignType, PlatformMetrics } from "../_types/report";
import { CAMPAIGN_TYPES, computeCpa } from "../_lib/platforms";

interface PlatformSectionProps {
  platformName: string;
  color: string;
  campaignType: CampaignType;
  onCampaignTypeChange: (type: CampaignType) => void;
  metrics: PlatformMetrics;
  onChange: (updates: Partial<PlatformMetrics>) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "AED", minimumFractionDigits: 2 });
}

export default function PlatformSection({ platformName, color, campaignType, onCampaignTypeChange, metrics, onChange }: PlatformSectionProps) {
  const costPer = computeCpa(metrics.adSpend, metrics.conversions);
  const isLeads = campaignType === "leads";

  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-semibold text-foreground">{platformName}</h3>
        </div>
        <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
          {CAMPAIGN_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => onCampaignTypeChange(ct.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                campaignType === ct.value
                  ? "bg-accent text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${platformName}-description`}>Description</Label>
        <textarea
          id={`${platformName}-description`}
          rows={2}
          placeholder="Campaign notes or description..."
          value={metrics.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${platformName}-spend`}>Ad Spend (AED)</Label>
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
          <Label htmlFor={`${platformName}-conversions`}>{isLeads ? "Leads" : "Conversions"}</Label>
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
          <Label>{isLeads ? "CPL" : "CPA"} (Auto-calculated)</Label>
          <div className="flex h-10 items-center rounded-lg border border-border bg-surface/50 px-3 text-sm text-muted">
            {metrics.adSpend > 0 || metrics.conversions > 0 ? formatCurrency(costPer) : "—"}
          </div>
        </div>
        {!isLeads && (
          <>
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
              <Label htmlFor={`${platformName}-revenue`}>Revenue (AED)</Label>
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
          </>
        )}
      </div>
    </div>
  );
}
