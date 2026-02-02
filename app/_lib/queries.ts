import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReports,
  fetchReport,
  createReport,
  updateReport,
  deleteReport,
} from "./api";
import type { ReportData } from "../_types/report";

export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (clientId: string) => [...reportKeys.lists(), clientId] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

export function useReportList(clientId: string) {
  return useQuery({
    queryKey: reportKeys.list(clientId),
    queryFn: () => fetchReports(clientId),
  });
}

export function useReport(reportId: string) {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => fetchReport(reportId),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, reportData }: { clientId: string; reportData: ReportData }) =>
      createReport(clientId, reportData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.list(variables.clientId) });
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, reportData }: { reportId: string; reportData: ReportData }) =>
      updateReport(reportId, reportData),
    onSuccess: (data) => {
      queryClient.setQueryData(reportKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: reportKeys.list(data.clientId) });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
}
