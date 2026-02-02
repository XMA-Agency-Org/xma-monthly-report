import Textarea from "@/components/Textarea";
import Label from "@/components/Label";
import { NEXT_PLAN_PERIODS, type NextPlanPeriod } from "../_lib/platforms";
import type { ReportData } from "../_types/report";

interface NextPlanSectionProps {
  data: ReportData;
  onChange: (updates: Partial<ReportData>) => void;
}

export default function NextPlanSection({ data, onChange }: NextPlanSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Next Plan of Action</h2>

      <div className="space-y-1.5">
        <Label>Period</Label>
        <div className="flex gap-2">
          {NEXT_PLAN_PERIODS.map((period) => (
            <button
              key={period.value}
              type="button"
              onClick={() => onChange({ nextPlanPeriod: period.value })}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                data.nextPlanPeriod === period.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-border-hover hover:text-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nextPlanActions">Action Items</Label>
        <Textarea
          id="nextPlanActions"
          rows={5}
          placeholder="Outline the plan of action for the next period..."
          className="px-3 py-2"
          value={data.nextPlanActions}
          onChange={(e) => onChange({ nextPlanActions: e.target.value })}
        />
      </div>
    </section>
  );
}
