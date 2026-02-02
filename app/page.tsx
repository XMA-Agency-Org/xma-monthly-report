"use client";

import { useClients } from "./_providers/ClientsProvider";
import Skeleton from "@/components/Skeleton";

export default function HomePage() {
  const { clients, loading } = useClients();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
      {loading ? (
        <Skeleton size="lg" />
      ) : clients.length === 0 ? (
        <>
          <h1 className="mb-2 text-xl font-semibold text-foreground">Welcome to XMA Reports</h1>
          <p className="text-sm text-muted">Add your first client in the sidebar to get started.</p>
        </>
      ) : (
        <>
          <h1 className="mb-2 text-xl font-semibold text-foreground">XMA Reports</h1>
          <p className="text-sm text-muted">
            Select a client from the sidebar to view their reports.
          </p>
          <p className="mt-1 text-xs text-muted">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
          </p>
        </>
      )}
    </main>
  );
}
