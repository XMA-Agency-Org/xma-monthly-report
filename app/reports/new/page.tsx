"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClients } from "@/app/_providers/ClientsProvider";
import { useCreateReport } from "@/app/_lib/queries";
import { generatePdf } from "@/app/_lib/generatePdf";
import MonthlyReportForm, { createInitialData } from "@/app/_components/MonthlyReportForm";
import Button from "@/components/Button";
import Link from "@/components/Link";
import type { ReportData } from "@/app/_types/report";

export default function GlobalNewReportPage() {
  const router = useRouter();
  const { clients } = useClients();
  const createReportMutation = useCreateReport();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [data, setData] = useState<ReportData>(createInitialData);

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setData((prev) => ({ ...prev, clientName: client.name }));
    }
  }

  async function handleSave() {
    if (!selectedClientId) return;
    const report = await createReportMutation.mutateAsync({
      clientId: selectedClientId,
      reportData: data,
    });
    router.push(`/clients/${selectedClientId}/reports/${report.id}`);
  }

  async function handleSaveAndGeneratePdf() {
    if (!selectedClientId) return;
    const report = await createReportMutation.mutateAsync({
      clientId: selectedClientId,
      reportData: data,
    });
    await generatePdf(data);
    router.push(`/clients/${selectedClientId}/reports/${report.id}`);
  }

  const saving = createReportMutation.isPending;
  const canSave = !!selectedClientId && !saving;

  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 pt-12 sm:px-8">
        <div className="mb-2">
          <Link href="/" variant="muted" size="sm">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Clients
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">New Report</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={!canSave}>
              {saving ? "Saving…" : "Save Report"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSaveAndGeneratePdf} disabled={!canSave}>
              {saving ? "Saving…" : "Save & Generate PDF"}
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
