"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  fetchClients,
  createClient as apiCreateClient,
  updateClient as apiUpdateClient,
  deleteClient as apiDeleteClient,
  type ClientRecord,
} from "@/app/_lib/api";

interface ClientsContextValue {
  clients: ClientRecord[];
  loading: boolean;
  addClient: (name: string) => Promise<ClientRecord>;
  editClient: (id: string, name: string) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  getClientById: (id: string) => ClientRecord | undefined;
}

const ClientsContext = createContext<ClientsContextValue | null>(null);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(async () => {
    const data = await fetchClients();
    setClients(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadClients();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loadClients]);

  const addClient = useCallback(async (name: string) => {
    const created = await apiCreateClient(name);
    setClients((prev) => [...prev, created]);
    return created;
  }, []);

  const editClient = useCallback(async (id: string, name: string) => {
    const updated = await apiUpdateClient(id, name);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const removeClient = useCallback(async (id: string) => {
    await apiDeleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getClientById = useCallback(
    (id: string) => clients.find((c) => c.id === id),
    [clients]
  );

  return (
    <ClientsContext.Provider value={{ clients, loading, addClient, editClient, removeClient, getClientById }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
}
