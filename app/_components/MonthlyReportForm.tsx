"use client";

import ClientInfoSection from "./ClientInfoSection";
import PlatformSection from "./PlatformSection";
import PlatformToggle from "./PlatformToggle";
import DeliverablesSection from "./DeliverablesSection";
import CustomDeliverablesSection from "./CustomDeliverablesSection";
import NextPlanSection from "./InsightsSection";
import { PLATFORMS, DELIVERABLE_CATEGORIES } from "../_lib/platforms";
import type { ClientRecord } from "../_lib/api";
import type { ReportData, PlatformId, CampaignType, PlatformMetrics, DeliverableCategory, DeliverableItem } from "../_types/report";

const EMPTY_METRICS: PlatformMetrics = { adSpend: 0, conversions: 0, roas: 0, revenue: 0, description: "" };

export function createInitialData(): ReportData {
  const enabledPlatforms = Object.fromEntries(PLATFORMS.map((p) => [p.id, false])) as Record<PlatformId, boolean>;
  const platformMetrics = Object.fromEntries(PLATFORMS.map((p) => [p.id, { ...EMPTY_METRICS }])) as Record<PlatformId, PlatformMetrics>;

  const deliverables = Object.fromEntries(
    DELIVERABLE_CATEGORIES.map((c) => [c.id, []])
  ) as Record<DeliverableCategory, DeliverableItem[]>;

  const campaignTypes = Object.fromEntries(PLATFORMS.map((p) => [p.id, "sales" as CampaignType])) as Record<PlatformId, CampaignType>;

  return {
    clientName: "",
    reportDate: "",
    preparedBy: "",
    enabledPlatforms,
    campaignTypes,
    platformMetrics,
    deliverables,
    customDeliverables: [],
    nextPlanPeriod: "1-month",
    nextPlanActions: "",
  };
}

interface MonthlyReportFormProps {
  data: ReportData;
  onDataChange: (data: ReportData) => void;
  clients?: ClientRecord[];
  selectedClientId?: string;
  onClientChange?: (clientId: string) => void;
}

export default function MonthlyReportForm({ data, onDataChange, clients, selectedClientId, onClientChange }: MonthlyReportFormProps) {
  function updateData(updates: Partial<ReportData>) {
    onDataChange({ ...data, ...updates });
  }

  function setCampaignType(id: PlatformId, type: CampaignType) {
    onDataChange({
      ...data,
      campaignTypes: { ...(data.campaignTypes ?? {} as Record<PlatformId, CampaignType>), [id]: type },
    });
  }

  function togglePlatform(id: PlatformId) {
    onDataChange({
      ...data,
      enabledPlatforms: { ...data.enabledPlatforms, [id]: !data.enabledPlatforms[id] },
    });
  }

  function updatePlatformMetrics(id: PlatformId, updates: Partial<PlatformMetrics>) {
    onDataChange({
      ...data,
      platformMetrics: {
        ...data.platformMetrics,
        [id]: { ...data.platformMetrics[id], ...updates },
      },
    });
  }

  function addDeliverable(category: DeliverableCategory, item: DeliverableItem) {
    onDataChange({
      ...data,
      deliverables: { ...data.deliverables, [category]: [...data.deliverables[category], item] },
    });
  }

  function removeDeliverable(category: DeliverableCategory, index: number) {
    onDataChange({
      ...data,
      deliverables: { ...data.deliverables, [category]: data.deliverables[category].filter((_, i) => i !== index) },
    });
  }

  const hasEnabledPlatforms = Object.values(data.enabledPlatforms).some(Boolean);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6 sm:p-8">
      <ClientInfoSection
        data={data}
        onChange={updateData}
        clients={clients}
        selectedClientId={selectedClientId}
        onClientChange={onClientChange}
      />

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
                campaignType={data.campaignTypes?.[platform.id] ?? "sales"}
                onCampaignTypeChange={(type) => setCampaignType(platform.id, type)}
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

      <CustomDeliverablesSection
        items={data.customDeliverables ?? []}
        onAdd={(item) => onDataChange({ ...data, customDeliverables: [...(data.customDeliverables ?? []), item] })}
        onRemove={(index) => onDataChange({ ...data, customDeliverables: (data.customDeliverables ?? []).filter((_, i) => i !== index) })}
      />

      <NextPlanSection data={data} onChange={updateData} />
    </div>
  );
}
