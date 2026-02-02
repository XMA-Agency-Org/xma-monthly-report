"use client";

import { use } from "react";
import { useClients } from "@/app/_providers/ClientsProvider";
import { useReportList } from "@/app/_lib/queries";
import ReportCard from "@/app/_components/ReportCard";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Skeleton from "@/components/Skeleton";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getClientById, loading: clientsLoading } = useClients();
  const client = getClientById(id);
  const { data: reports = [], isLoading: loadingReports } = useReportList(id);

  if (clientsLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-3">
          <Skeleton size="lg" />
          <Skeleton size="card" />
          <Skeleton size="card" />
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-sm text-error">Client not found.</p>
        <Link href="/" variant="default" className="mt-2 inline-block">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
          <p className="text-sm text-muted">
            {loadingReports ? "Loading reports…" : `${reports.length} ${reports.length === 1 ? "report" : "reports"}`}
          </p>
        </div>
        <Link href={`/clients/${id}/reports/new`} className="no-underline">
          <Button>New Report</Button>
        </Link>
      </div>

      {loadingReports ? (
        <div className="flex flex-col gap-2">
          <Skeleton size="card" />
          <Skeleton size="card" />
        </div>
      ) : reports.length === 0 ? (
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
