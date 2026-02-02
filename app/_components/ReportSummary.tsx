"use client";

import type { ReportData, DeliverableStatus } from "../_types/report";
import { PLATFORMS, DELIVERABLE_CATEGORIES, DELIVERABLE_STATUSES, NEXT_PLAN_PERIODS, computeCpa } from "../_lib/platforms";

const STATUS_BADGE_CLASSES: Record<DeliverableStatus, string> = {
  delivered: "bg-success/15 text-success",
  "in-progress": "bg-warning/15 text-warning",
  pending: "bg-muted/15 text-muted",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

interface ReportSummaryProps {
  data: ReportData;
}

export default function ReportSummary({ data }: ReportSummaryProps) {
  const enabledPlatforms = PLATFORMS.filter((p) => data.enabledPlatforms[p.id]);
  const periodLabel = NEXT_PLAN_PERIODS.find((p) => p.value === data.nextPlanPeriod)?.label ?? data.nextPlanPeriod;

  const totalSpend = enabledPlatforms.reduce((sum, p) => sum + data.platformMetrics[p.id].adSpend, 0);
  const totalConversions = enabledPlatforms.reduce((sum, p) => sum + data.platformMetrics[p.id].conversions, 0);
  const totalRevenue = enabledPlatforms.reduce((sum, p) => sum + data.platformMetrics[p.id].revenue, 0);
  const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Client Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">Client</p>
            <p className="mt-1 text-sm font-medium text-foreground">{data.clientName || "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">Prepared By</p>
            <p className="mt-1 text-sm font-medium text-foreground">{data.preparedBy || "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">Report Date</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {data.reportDate
                ? new Date(data.reportDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "—"}
            </p>
          </div>
        </div>
      </section>

      {enabledPlatforms.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs text-muted">Total Ad Spend</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(totalSpend)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs text-muted">Total Conversions</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatNumber(totalConversions)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs text-muted">Total Revenue</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs text-muted">Overall ROAS</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{overallRoas.toFixed(2)}x</p>
            </div>
          </div>
        </section>
      )}

      {enabledPlatforms.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Platform Breakdown</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Platform</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">Ad Spend</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">Conversions</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">CPA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">ROAS</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {enabledPlatforms.map((platform) => {
                  const m = data.platformMetrics[platform.id];
                  return (
                    <tr key={platform.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: platform.color }} />
                          <span className="font-medium text-foreground">{platform.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">{formatCurrency(m.adSpend)}</td>
                      <td className="px-4 py-3 text-right text-foreground">{formatNumber(m.conversions)}</td>
                      <td className="px-4 py-3 text-right text-foreground">{formatCurrency(computeCpa(m.adSpend, m.conversions))}</td>
                      <td className="px-4 py-3 text-right text-foreground">{m.roas.toFixed(2)}x</td>
                      <td className="px-4 py-3 text-right text-foreground">{formatCurrency(m.revenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Deliverables</h2>
        {DELIVERABLE_CATEGORIES.map((category) => {
          const items = data.deliverables[category.id];
          if (!items || items.length === 0) return null;
          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-sm font-medium text-foreground">{category.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[item.status]}`}>
                      {DELIVERABLE_STATUSES.find((s) => s.value === item.status)?.label}
                    </span>
                    <span className="text-foreground">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {data.customDeliverables && data.customDeliverables.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="text-sm font-medium text-foreground">Custom</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.customDeliverables.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm">
                  <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[item.status]}`}>
                    {DELIVERABLE_STATUSES.find((s) => s.value === item.status)?.label}
                  </span>
                  <span className="text-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {DELIVERABLE_CATEGORIES.every((c) => !data.deliverables[c.id]?.length) &&
          (!data.customDeliverables || data.customDeliverables.length === 0) && (
          <p className="text-sm text-muted">No deliverables recorded.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Next Plan of Action</h2>
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <p className="text-xs text-muted">
            Period: <span className="text-foreground">{periodLabel}</span>
          </p>
          {data.nextPlanActions ? (
            <p className="whitespace-pre-wrap text-sm text-foreground">{data.nextPlanActions}</p>
          ) : (
            <p className="text-sm text-muted">No action items recorded.</p>
          )}
        </div>
      </section>
    </div>
  );
}
