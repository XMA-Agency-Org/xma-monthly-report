import { pdf } from "@react-pdf/renderer";
import ReportPdfDocument from "../_components/ReportPdfDocument";
import type { ReportData } from "../_types/report";

export async function generatePdf(data: ReportData) {
  const blob = await pdf(<ReportPdfDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileName = `${data.clientName || "Client"}_Report_${data.reportDate || "undated"}.pdf`;
  link.download = fileName.replace(/\s+/g, "_");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
