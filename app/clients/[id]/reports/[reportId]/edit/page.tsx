"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useClients } from "@/app/_providers/ClientsProvider";
import { useReport, useUpdateReport } from "@/app/_lib/queries";
import { generatePdf } from "@/app/_lib/generatePdf";
import MonthlyReportForm from "@/app/_components/MonthlyReportForm";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Skeleton from "@/components/Skeleton";
import type { ReportData } from "@/app/_types/report";

export default function EditReportPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id: clientId, reportId } = use(params);
  const router = useRouter();
  const { clients } = useClients();
  const { data: report, isLoading: loadingReport } = useReport(reportId);
  const updateReportMutation = useUpdateReport();
  const [selectedClientId, setSelectedClientId] = useState(clientId);
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    if (report && !data) {
      setData(report.reportData);
      setSelectedClientId(report.clientId);
    }
  }, [report, data]);

  function handleClientChange(newClientId: string) {
    setSelectedClientId(newClientId);
    const client = clients.find((c) => c.id === newClientId);
    if (client && data) {
      setData({ ...data, clientName: client.name });
    }
  }

  async function handleSave() {
    if (!data) return;
    await updateReportMutation.mutateAsync({ reportId, reportData: data });
    router.push(`/clients/${clientId}/reports/${reportId}`);
  }

  async function handleSaveAndGeneratePdf() {
    if (!data) return;
    await updateReportMutation.mutateAsync({ reportId, reportData: data });
    await generatePdf(data);
    router.push(`/clients/${clientId}/reports/${reportId}`);
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const saving = updateReportMutation.isPending;

  if (loadingReport || !data) {
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

  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 pt-12 sm:px-8">
        <div className="mb-2">
          <Link href={`/clients/${clientId}/reports/${reportId}`} variant="muted" size="sm">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {selectedClient?.name ?? "Client"}
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Edit Report</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Update Report"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSaveAndGeneratePdf} disabled={saving}>
              {saving ? "Saving…" : "Update & Generate PDF"}
            </Button>
          </div>
        </div>
      </div>

      <MonthlyReportForm
        data={data}
        onDataChange={setData}
        clients={clients}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
      />
    </main>
  );
}
