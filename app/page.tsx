"use client";

import { useState, useEffect } from "react";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  type ClientRecord,
} from "./_lib/api";
import ClientCard from "./_components/ClientCard";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const data = await fetchClients();
    setClients(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      await createClient(newName.trim());
      setNewName("");
      await loadClients();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create client";
      setError(message);
    }
    setCreating(false);
  }

  async function handleUpdate(id: string, name: string) {
    setError("");
    try {
      await updateClient(id, name);
      await loadClients();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update client";
      setError(message);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteClient(id);
      await loadClients();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete client";
      setError(message);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCreate();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted">
            Manage your clients and their monthly reports.
          </p>
        </div>
        <a href="/reports/new">
          <Button variant="secondary">New Report</Button>
        </a>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New client name…"
          className="flex-1"
        />
        <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
          {creating ? "Adding…" : "Add Client"}
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-error">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-muted">
          Loading clients…
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-sm text-muted">No clients yet.</p>
          <p className="text-xs text-muted">Add your first client above to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
