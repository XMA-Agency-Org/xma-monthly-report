import Input from "@/components/Input";
import Select from "@/components/Select";
import Label from "@/components/Label";
import { MONTHS, YEARS } from "../_lib/platforms";
import type { ReportData } from "../_types/report";

interface ClientInfoSectionProps {
  data: ReportData;
  onChange: (updates: Partial<ReportData>) => void;
}

export default function ClientInfoSection({ data, onChange }: ClientInfoSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Client Information</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Label htmlFor="reportMonth">Month</Label>
          <Select
            id="reportMonth"
            value={data.reportMonth}
            onChange={(e) => onChange({ reportMonth: e.target.value })}
          >
            <option value="" disabled>Select month</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reportYear">Year</Label>
          <Select
            id="reportYear"
            value={data.reportYear}
            onChange={(e) => onChange({ reportYear: e.target.value })}
          >
            <option value="" disabled>Select year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </div>
      </div>
    </section>
  );
}
