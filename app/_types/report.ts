export type PlatformId = "google" | "meta";

export interface PlatformMetrics {
  adSpend: number;
  conversions: number;
  roas: number;
  revenue: number;
}

export type DeliverableStatus = "delivered" | "in-progress" | "pending";

export interface DeliverableItem {
  description: string;
  status: DeliverableStatus;
}

export type DeliverableCategory = "graphics" | "videos" | "websiteFeatures";

export interface ReportData {
  clientName: string;
  reportMonth: string;
  reportYear: string;
  preparedBy: string;
  enabledPlatforms: Record<PlatformId, boolean>;
  platformMetrics: Record<PlatformId, PlatformMetrics>;
  deliverables: Record<DeliverableCategory, DeliverableItem[]>;
  nextPlanPeriod: "1-week" | "2-week" | "3-week" | "1-month";
  nextPlanActions: string;
}
