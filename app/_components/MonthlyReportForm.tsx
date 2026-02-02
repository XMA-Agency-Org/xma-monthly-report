"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import Button from "@/components/Button";
import ClientInfoSection from "./ClientInfoSection";
import PlatformSection from "./PlatformSection";
import PlatformToggle from "./PlatformToggle";
import DeliverablesSection from "./DeliverablesSection";
import NextPlanSection from "./InsightsSection";
import ReportPdfDocument from "./ReportPdfDocument";
import { PLATFORMS, DELIVERABLE_CATEGORIES } from "../_lib/platforms";
import type { ReportData, PlatformId, PlatformMetrics, DeliverableCategory, DeliverableItem } from "../_types/report";

const EMPTY_METRICS: PlatformMetrics = { adSpend: 0, conversions: 0, roas: 0, revenue: 0 };

function createInitialData(): ReportData {
  const enabledPlatforms = Object.fromEntries(PLATFORMS.map((p) => [p.id, false])) as Record<PlatformId, boolean>;
  const platformMetrics = Object.fromEntries(PLATFORMS.map((p) => [p.id, { ...EMPTY_METRICS }])) as Record<PlatformId, PlatformMetrics>;

  const deliverables = Object.fromEntries(
    DELIVERABLE_CATEGORIES.map((c) => [c.id, []])
  ) as Record<DeliverableCategory, DeliverableItem[]>;

  return {
    clientName: "",
    reportMonth: "",
    reportYear: "",
    preparedBy: "",
    enabledPlatforms,
    platformMetrics,
    deliverables,
    nextPlanPeriod: "1-month",
    nextPlanActions: "",
  };
}

export default function MonthlyReportForm() {
  const [data, setData] = useState<ReportData>(createInitialData);
  const [generating, setGenerating] = useState(false);

  function updateData(updates: Partial<ReportData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function togglePlatform(id: PlatformId) {
    setData((prev) => ({
      ...prev,
      enabledPlatforms: { ...prev.enabledPlatforms, [id]: !prev.enabledPlatforms[id] },
    }));
  }

  function updatePlatformMetrics(id: PlatformId, updates: Partial<PlatformMetrics>) {
    setData((prev) => ({
      ...prev,
      platformMetrics: {
        ...prev.platformMetrics,
        [id]: { ...prev.platformMetrics[id], ...updates },
      },
    }));
  }

  function addDeliverable(category: DeliverableCategory, item: DeliverableItem) {
    setData((prev) => ({
      ...prev,
      deliverables: { ...prev.deliverables, [category]: [...prev.deliverables[category], item] },
    }));
  }

  function removeDeliverable(category: DeliverableCategory, index: number) {
    setData((prev) => ({
      ...prev,
      deliverables: { ...prev.deliverables, [category]: prev.deliverables[category].filter((_, i) => i !== index) },
    }));
  }

  async function generatePdf() {
    setGenerating(true);
    try {
      const blob = await pdf(<ReportPdfDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `${data.clientName || "Client"}_Report_${data.reportMonth}_${data.reportYear}.pdf`;
      link.download = fileName.replace(/\s+/g, "_");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  const hasEnabledPlatforms = Object.values(data.enabledPlatforms).some(Boolean);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Monthly Report</h1>
        <p className="mt-1 text-sm text-muted">Fill in the performance data to generate a client-ready PDF report.</p>
      </div>

      <ClientInfoSection data={data} onChange={updateData} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <PlatformToggle
              key={platform.id}
              label={platform.name}
              enabled={data.enabledPlatforms[platform.id]}
              color={platform.color}
              onToggle={() => togglePlatform(platform.id)}
            />
          ))}
        </div>
        {hasEnabledPlatforms && (
          <div className="space-y-3">
            {PLATFORMS.filter((p) => data.enabledPlatforms[p.id]).map((platform) => (
              <PlatformSection
                key={platform.id}
                platformName={platform.name}
                color={platform.color}
                metrics={data.platformMetrics[platform.id]}
                onChange={(updates) => updatePlatformMetrics(platform.id, updates)}
              />
            ))}
          </div>
        )}
      </section>

      <DeliverablesSection
        deliverables={data.deliverables}
        onAdd={addDeliverable}
        onRemove={removeDeliverable}
      />

      <NextPlanSection data={data} onChange={updateData} />

      <div className="border-t border-border pt-6">
        <Button size="lg" onClick={generatePdf} disabled={generating}>
          {generating ? "Generating..." : "Generate PDF Report"}
        </Button>
      </div>
    </div>
  );
}
