"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useClients } from "@/app/_providers/ClientsProvider";
import { useReport, useDeleteReport } from "@/app/_lib/queries";
import { generatePdf } from "@/app/_lib/generatePdf";
import ReportSummary from "@/app/_components/ReportSummary";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Skeleton from "@/components/Skeleton";

export default function ReportViewPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id: clientId, reportId } = use(params);
  const router = useRouter();
  const { getClientById, loading: clientsLoading } = useClients();
  const client = getClientById(clientId);
  const { data: report, isLoading: loadingReport } = useReport(reportId);
  const deleteReportMutation = useDeleteReport();
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    await deleteReportMutation.mutateAsync(reportId);
    router.push(`/clients/${clientId}`);
  }

  if (clientsLoading || loadingReport) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex flex-col gap-3">
          <Skeleton size="lg" />
          <Skeleton size="card" />
          <Skeleton size="card" />
        </div>
      </main>
    );
  }

  if (!report || !client) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-error">Report not found.</p>
        <Link href="/" variant="default" className="mt-2 inline-block">
          Back to home
        </Link>
      </main>
    );
  }

  const reportDate = report.reportData.reportDate
    ? new Date(report.reportData.reportDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Undated Report";

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
      <div className="mb-2">
        <Link href={`/clients/${clientId}`} variant="muted" size="sm">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {client.name}
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{reportDate}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/clients/${clientId}/reports/${reportId}/edit`} className="no-underline">
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleGeneratePdf} disabled={generatingPdf}>
            {generatingPdf ? "Generating…" : "Generate PDF"}
          </Button>
          {confirmDelete ? (
            <>
              <Button
                size="sm"
                className="bg-error text-background hover:bg-error/80"
                onClick={handleDelete}
                disabled={deleteReportMutation.isPending}
              >
                {deleteReportMutation.isPending ? "Deleting…" : "Confirm Delete"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" className="text-error" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <ReportSummary data={report.reportData} />
    </main>
  );
}
