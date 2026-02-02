"use client";

import { useState, useEffect, use } from "react";
import {
  fetchClient,
  fetchReports,
  deleteReport,
  type ClientRecord,
  type ReportListItem,
} from "@/app/_lib/api";
import ReportCard from "@/app/_components/ReportCard";
import Button from "@/components/Button";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [clientData, reportsData] = await Promise.all([
        fetchClient(id),
        fetchReports(id),
      ]);
      setClient(clientData);
      setReports(reportsData);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-center py-20 text-sm text-muted">
          Loading…
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-sm text-error">Client not found.</p>
        <a href="/" className="mt-2 inline-block text-sm text-accent hover:text-accent-hover">
          Back to clients
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <a href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to clients
      </a>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
          <p className="text-sm text-muted">
            {reports.length} {reports.length === 1 ? "report" : "reports"}
          </p>
        </div>
        <a href={`/clients/${id}/reports/new`}>
          <Button>New Report</Button>
        </a>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-sm text-muted">No reports yet.</p>
          <p className="text-xs text-muted">Create the first report for this client.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {reports.map((report) => (
            <ReportCard key={report.id} clientId={id} report={report} />
          ))}
        </div>
      )}
    </main>
  );
}
