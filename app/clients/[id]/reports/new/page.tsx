"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchClients, createReport, type ClientRecord } from "@/app/_lib/api";
import { generatePdf } from "@/app/_lib/generatePdf";
import MonthlyReportForm, { createInitialData } from "@/app/_components/MonthlyReportForm";
import StickyActionBar from "@/app/_components/StickyActionBar";
import Button from "@/components/Button";
import type { ReportData } from "@/app/_types/report";

export default function NewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: initialClientId } = use(params);
  const router = useRouter();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(initialClientId);
  const [data, setData] = useState<ReportData>(createInitialData);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allClients = await fetchClients();
      setClients(allClients);
      const current = allClients.find((c) => c.id === initialClientId);
      if (current) {
        setData((prev) => ({ ...prev, clientName: current.name }));
      }
      setLoading(false);
    }
    load();
  }, [initialClientId]);

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setData((prev) => ({ ...prev, clientName: client.name }));
    }
  }

  async function handleSave() {
    if (!selectedClientId) return;
    setSaving(true);
    try {
      const report = await createReport(selectedClientId, data);
      router.push(`/clients/${selectedClientId}/reports/${report.id}`);
    } catch {
      setSaving(false);
    }
  }

  async function handleSaveAndGeneratePdf() {
    if (!selectedClientId) return;
    setSaving(true);
    try {
      const report = await createReport(selectedClientId, data);
      await generatePdf(data);
      router.push(`/clients/${selectedClientId}/reports/${report.id}`);
    } catch {
      setSaving(false);
    }
  }

  const canSave = !!selectedClientId && !saving;
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  if (loading) {
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
            href={`/clients/${initialClientId}`}
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {selectedClient?.name ?? "Client"}
          </a>
          <span className="text-sm text-muted">/</span>
          <span className="text-sm font-medium text-foreground">New Report</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={!canSave}>
            {saving ? "Saving…" : "Save Report"}
          </Button>
          <Button variant="secondary" onClick={handleSaveAndGeneratePdf} disabled={!canSave}>
            {saving ? "Saving…" : "Save & Generate PDF"}
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
