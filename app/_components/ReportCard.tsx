"use client";

import type { ReportListItem } from "../_lib/api";

interface ReportCardProps {
  clientId: string;
  report: ReportListItem;
}

export default function ReportCard({ clientId, report }: ReportCardProps) {
  const reportDate = report.reportData?.reportDate
    ? new Date(report.reportData.reportDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";

  const updatedAt = new Date(report.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const preparedBy = report.reportData?.preparedBy;

  const enabledPlatforms = report.reportData?.enabledPlatforms
    ? Object.entries(report.reportData.enabledPlatforms)
        .filter(([, enabled]) => enabled)
        .map(([id]) => id === "google" ? "Google Ads" : "Meta")
    : [];

  return (
    <a
      href={`/clients/${clientId}/reports/${report.id}`}
      className="group flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-hover hover:bg-surface-hover"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">
          {reportDate}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted">
          {preparedBy && <span>by {preparedBy}</span>}
          {preparedBy && enabledPlatforms.length > 0 && <span>·</span>}
          {enabledPlatforms.length > 0 && <span>{enabledPlatforms.join(", ")}</span>}
          {(preparedBy || enabledPlatforms.length > 0) && <span>·</span>}
          <span>Updated {updatedAt}</span>
        </div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
      >
        <path
          d="M6 4L10 8L6 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
