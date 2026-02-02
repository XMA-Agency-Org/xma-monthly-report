"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchClients, fetchReport, updateReport, type ClientRecord, type ReportRecord } from "@/app/_lib/api";
import { generatePdf } from "@/app/_lib/generatePdf";
import MonthlyReportForm from "@/app/_components/MonthlyReportForm";
import StickyActionBar from "@/app/_components/StickyActionBar";
import Button from "@/components/Button";
import type { ReportData } from "@/app/_types/report";

export default function EditReportPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id: clientId, reportId } = use(params);
  const router = useRouter();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(clientId);
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [data, setData] = useState<ReportData | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allClients, reportData] = await Promise.all([
        fetchClients(),
        fetchReport(reportId),
      ]);
      setClients(allClients);
      setReport(reportData);
      setData(reportData.reportData);
      setSelectedClientId(reportData.clientId);
      setLoading(false);
    }
    load();
  }, [reportId]);

  function handleClientChange(newClientId: string) {
    setSelectedClientId(newClientId);
    const client = clients.find((c) => c.id === newClientId);
    if (client && data) {
      setData({ ...data, clientName: client.name });
    }
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await updateReport(reportId, data);
      router.push(`/clients/${clientId}/reports/${reportId}`);
    } catch {
      setSaving(false);
    }
  }

  async function handleSaveAndGeneratePdf() {
    if (!data) return;
    setSaving(true);
    try {
      await updateReport(reportId, data);
      await generatePdf(data);
      router.push(`/clients/${clientId}/reports/${reportId}`);
    } catch {
      setSaving(false);
    }
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  if (loading || !data) {
    return (
      <main className="flex items-center justify-center py-20 text-sm text-muted">
        Loading…
      </main>
    );
  }

  return (
    <main>
      <StickyActionBar>
        <div className="flex items-center gap-3">
          <a
            href={`/clients/${clientId}/reports/${reportId}`}
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {selectedClient?.name ?? "Client"}
          </a>
          <span className="text-sm text-muted">/</span>
          <span className="text-sm font-medium text-foreground">Edit Report</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Update Report"}
          </Button>
          <Button variant="secondary" onClick={handleSaveAndGeneratePdf} disabled={saving}>
            {saving ? "Saving…" : "Update & Generate PDF"}
          </Button>
        </div>
      </StickyActionBar>

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
