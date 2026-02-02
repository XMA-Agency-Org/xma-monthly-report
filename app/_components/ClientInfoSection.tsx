import Input from "@/components/Input";
import Select from "@/components/Select";
import Label from "@/components/Label";
import type { ReportData } from "../_types/report";
import type { ClientRecord } from "../_lib/api";

interface ClientInfoSectionProps {
  data: ReportData;
  onChange: (updates: Partial<ReportData>) => void;
  clients?: ClientRecord[];
  selectedClientId?: string;
  onClientChange?: (clientId: string) => void;
}

export default function ClientInfoSection({
  data,
  onChange,
  clients,
  selectedClientId,
  onClientChange,
}: ClientInfoSectionProps) {
  const showDropdown = clients && onClientChange;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Client Information</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="clientSelect">Client</Label>
          {showDropdown ? (
            <Select
              id="clientSelect"
              value={selectedClientId ?? ""}
              onChange={(e) => onClientChange(e.target.value)}
            >
              <option value="" disabled>
                Select a client…
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          ) : (
            <p className="flex h-10 items-center rounded-lg border border-border bg-surface/50 px-3 text-sm text-foreground">
              {data.clientName || "—"}
            </p>
          )}
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
