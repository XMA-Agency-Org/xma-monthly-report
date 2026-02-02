import Input from "@/components/Input";
import Label from "@/components/Label";
import type { ReportData } from "../_types/report";

interface ClientInfoSectionProps {
  data: ReportData;
  onChange: (updates: Partial<ReportData>) => void;
}

export default function ClientInfoSection({ data, onChange }: ClientInfoSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Client Information</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            placeholder="Enter client name"
            value={data.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preparedBy">Prepared By</Label>
          <Input
            id="preparedBy"
            placeholder="Your name"
            value={data.preparedBy}
            onChange={(e) => onChange({ preparedBy: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reportDate">Report Date</Label>
          <Input
            id="reportDate"
            type="date"
            value={data.reportDate}
            onChange={(e) => onChange({ reportDate: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}
