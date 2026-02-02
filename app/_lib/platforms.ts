import type { PlatformId, DeliverableCategory, DeliverableStatus, ReportData } from "../_types/report";

export type NextPlanPeriod = ReportData["nextPlanPeriod"];

export const NEXT_PLAN_PERIODS: { value: NextPlanPeriod; label: string }[] = [
  { value: "1-week", label: "1 Week" },
  { value: "2-week", label: "2 Weeks" },
  { value: "3-week", label: "3 Weeks" },
  { value: "1-month", label: "1 Month" },
];

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  color: string;
  pdfColor: string;
}

export const PLATFORMS: PlatformConfig[] = [
  { id: "google", name: "Google Ads", color: "oklch(0.7 0.15 145)", pdfColor: "#34A853" },
  { id: "meta", name: "Meta", color: "oklch(0.6 0.18 260)", pdfColor: "#1877F2" },
];


export interface DeliverableCategoryConfig {
  id: DeliverableCategory;
  label: string;
  color: string;
  pdfColor: string;
}

export const DELIVERABLE_CATEGORIES: DeliverableCategoryConfig[] = [
  { id: "graphics", label: "Graphics", color: "oklch(0.7 0.17 310)", pdfColor: "#A855F7" },
  { id: "videos", label: "Videos", color: "oklch(0.7 0.17 25)", pdfColor: "#EF4444" },
  { id: "websiteFeatures", label: "Website Features / Milestones", color: "oklch(0.7 0.15 180)", pdfColor: "#14B8A6" },
];

export const DELIVERABLE_STATUSES: { value: DeliverableStatus; label: string }[] = [
  { value: "delivered", label: "Delivered" },
  { value: "in-progress", label: "In Progress" },
  { value: "pending", label: "Pending" },
];

export function computeCpa(spend: number, conversions: number): number {
  if (conversions === 0) return 0;
  return spend / conversions;
}
