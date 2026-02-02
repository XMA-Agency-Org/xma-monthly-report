"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { DELIVERABLE_STATUSES } from "../_lib/platforms";
import type { DeliverableItem, DeliverableStatus } from "../_types/report";

const STATUS_BADGE_CLASSES: Record<DeliverableStatus, string> = {
  delivered: "bg-success/15 text-success",
  "in-progress": "bg-warning/15 text-warning",
  pending: "bg-muted/15 text-muted",
};

interface CustomDeliverablesSectionProps {
  items: DeliverableItem[];
  onAdd: (item: DeliverableItem) => void;
  onRemove: (index: number) => void;
}

export default function CustomDeliverablesSection({ items, onAdd, onRemove }: CustomDeliverablesSectionProps) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<DeliverableStatus>("delivered");

  function handleSubmit() {
    if (!description.trim()) return;
    onAdd({ description: description.trim(), status });
    setDescription("");
    setStatus("delivered");
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Custom Deliverables</h2>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a custom deliverable..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
          className="flex-1"
        />
        <Select
          className="w-32 shrink-0"
          value={status}
          onChange={(e) => setStatus(e.target.value as DeliverableStatus)}
        >
          {DELIVERABLE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-muted/20"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[item.status]}`}>
                {DELIVERABLE_STATUSES.find((s) => s.value === item.status)?.label}
              </span>
              <span className="text-foreground">{item.description}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 flex h-4 w-4 items-center justify-center rounded text-muted opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
