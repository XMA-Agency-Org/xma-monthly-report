import axios from "axios";
import type { ReportData } from "../_types/report";

const api = axios.create({ baseURL: "/api" });

export interface ClientRecord {
  id: string;
  name: string;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  clientId: string;
  reportData: ReportData;
  createdAt: string;
  updatedAt: string;
}

export interface ReportListItem extends ReportRecord {
  clientName: string;
}

export async function fetchClients(): Promise<ClientRecord[]> {
  const { data } = await api.get<ClientRecord[]>("/clients");
  return data;
}

export async function fetchClient(id: string): Promise<ClientRecord> {
  const { data } = await api.get<ClientRecord>(`/clients/${id}`);
  return data;
}

export async function createClient(name: string): Promise<ClientRecord> {
  const { data } = await api.post<ClientRecord>("/clients", { name });
  return data;
}

export async function fetchReports(clientId: string): Promise<ReportListItem[]> {
  const { data } = await api.get<ReportListItem[]>("/reports", { params: { clientId } });
  return data;
}

export async function fetchReport(id: string): Promise<ReportRecord> {
  const { data } = await api.get<ReportRecord>(`/reports/${id}`);
  return data;
}

export async function createReport(clientId: string, reportData: ReportData): Promise<ReportRecord> {
  const { data } = await api.post<ReportRecord>("/reports", { clientId, reportData });
  return data;
}

export async function updateReport(id: string, reportData: ReportData): Promise<ReportRecord> {
  const { data } = await api.put<ReportRecord>(`/reports/${id}`, { reportData });
  return data;
}

export async function deleteReport(id: string): Promise<void> {
  await api.delete(`/reports/${id}`);
}

export async function updateClient(id: string, name: string): Promise<ClientRecord> {
  const { data } = await api.put<ClientRecord>(`/clients/${id}`, { name });
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
