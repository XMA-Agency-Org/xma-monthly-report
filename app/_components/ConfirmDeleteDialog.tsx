"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface ConfirmDeleteDialogProps {
  name: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function ConfirmDeleteDialog({
  name,
  open,
  onConfirm,
  onCancel,
  deleting,
}: ConfirmDeleteDialogProps) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTyped("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const matches = typed === name;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && matches) onConfirm();
    if (e.key === "Escape") onCancel();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground">Delete client</h3>
        <p className="mt-2 text-sm text-muted">
          This will permanently delete <strong className="text-foreground">{name}</strong> and
          all their reports. This action cannot be undone.
        </p>
        <p className="mt-4 text-sm text-muted">
          Type <strong className="text-foreground">{name}</strong> to confirm:
        </p>
        <Input
          ref={inputRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={name}
          className="mt-2"
          state={typed.length > 0 && !matches ? "error" : "default"}
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            className="bg-error text-background hover:bg-error/80"
            onClick={onConfirm}
            disabled={!matches || deleting}
          >
            {deleting ? "Deleting…" : "Delete Client"}
          </Button>
        </div>
      </div>
    </div>
  );
}
