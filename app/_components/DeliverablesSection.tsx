"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { DELIVERABLE_CATEGORIES, DELIVERABLE_STATUSES } from "../_lib/platforms";
import type { DeliverableCategory, DeliverableItem, DeliverableStatus } from "../_types/report";

interface DeliverablesSectionProps {
  deliverables: Record<DeliverableCategory, DeliverableItem[]>;
  onAdd: (category: DeliverableCategory, item: DeliverableItem) => void;
  onRemove: (category: DeliverableCategory, index: number) => void;
}

const STATUS_BADGE_CLASSES: Record<DeliverableStatus, string> = {
  delivered: "bg-success/15 text-success",
  "in-progress": "bg-warning/15 text-warning",
  pending: "bg-muted/15 text-muted",
};

export default function DeliverablesSection({ deliverables, onAdd, onRemove }: DeliverablesSectionProps) {
  const [drafts, setDrafts] = useState<Record<DeliverableCategory, { description: string; status: DeliverableStatus }>>(
    () => Object.fromEntries(DELIVERABLE_CATEGORIES.map((c) => [c.id, { description: "", status: "delivered" as DeliverableStatus }])) as Record<DeliverableCategory, { description: string; status: DeliverableStatus }>
  );

  function submit(categoryId: DeliverableCategory) {
    const draft = drafts[categoryId];
    if (!draft.description.trim()) return;

    onAdd(categoryId, { description: draft.description.trim(), status: draft.status });
    setDrafts((prev) => ({ ...prev, [categoryId]: { description: "", status: "delivered" } }));
  }

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Deliverables</h2>

      {DELIVERABLE_CATEGORIES.map((category) => {
        const items = deliverables[category.id];
        const draft = drafts[category.id];

        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-sm font-medium text-foreground">{category.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder={`Add ${category.label.toLowerCase()}...`}
                value={draft.description}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [category.id]: { ...prev[category.id], description: e.target.value } }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(category.id); } }}
                className="flex-1"
              />
              <Select
                className="w-32 shrink-0"
                value={draft.status}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [category.id]: { ...prev[category.id], status: e.target.value as DeliverableStatus } }))}
              >
                {DELIVERABLE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => submit(category.id)}
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
                      onClick={() => onRemove(category.id, index)}
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
          </div>
        );
      })}
    </section>
  );
}
