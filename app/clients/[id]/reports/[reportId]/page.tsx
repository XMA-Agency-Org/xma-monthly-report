"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchClient, fetchReport, deleteReport, type ClientRecord, type ReportRecord } from "@/app/_lib/api";
import { generatePdf } from "@/app/_lib/generatePdf";
import ReportSummary from "@/app/_components/ReportSummary";
import StickyActionBar from "@/app/_components/StickyActionBar";
import Button from "@/components/Button";

export default function ReportViewPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id: clientId, reportId } = use(params);
  const router = useRouter();
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const [clientData, reportData] = await Promise.all([
        fetchClient(clientId),
        fetchReport(reportId),
      ]);
      setClient(clientData);
      setReport(reportData);
      setLoading(false);
    }
    load();
  }, [clientId, reportId]);

  async function handleGeneratePdf() {
    if (!report) return;
    setGeneratingPdf(true);
    try {
      await generatePdf(report.reportData);
    } finally {
      setGeneratingPdf(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteReport(reportId);
    router.push(`/clients/${clientId}`);
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20 text-sm text-muted">
        Loading…
      </main>
    );
  }

  if (!report || !client) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-error">Report not found.</p>
        <a href="/" className="mt-2 inline-block text-sm text-accent hover:text-accent-hover">
          Back to clients
        </a>
      </main>
    );
  }

  const reportDate = report.reportData.reportDate
    ? new Date(report.reportData.reportDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Undated Report";

  return (
    <main>
      <StickyActionBar>
        <div className="flex items-center gap-3">
          <a
            href={`/clients/${clientId}`}
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {client.name}
          </a>
          <span className="text-sm text-muted">/</span>
          <span className="text-sm font-medium text-foreground">{reportDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/clients/${clientId}/reports/${reportId}/edit`}>
            <Button variant="secondary">Edit</Button>
          </a>
          <Button variant="secondary" onClick={handleGeneratePdf} disabled={generatingPdf}>
            {generatingPdf ? "Generating…" : "Generate PDF"}
          </Button>
          {confirmDelete ? (
            <>
              <Button
                className="bg-error text-background hover:bg-error/80"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="ghost" className="text-error" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </StickyActionBar>

      <div className="mx-auto max-w-3xl p-6 sm:p-8">
        <ReportSummary data={report.reportData} />
      </div>
    </main>
  );
}
