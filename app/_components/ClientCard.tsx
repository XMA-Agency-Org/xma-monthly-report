"use client";

import { useState } from "react";
import type { ClientRecord } from "../_lib/api";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface ClientCardProps {
  client: ClientRecord;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ClientCard({ client, onUpdate, onDelete }: ClientCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(client.name);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave() {
    if (!editName.trim() || editName.trim() === client.name) {
      setEditing(false);
      setEditName(client.name);
      return;
    }
    setSaving(true);
    await onUpdate(client.id, editName.trim());
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(client.id);
    setDeleting(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditing(false);
      setEditName(client.name);
    }
  }

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-hover hover:bg-surface-hover">
      {editing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            inputSize="sm"
            autoFocus
            className="flex-1"
          />
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditing(false);
              setEditName(client.name);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <a
            href={`/clients/${client.id}`}
            className="flex flex-1 flex-col gap-1"
          >
            <span className="text-sm font-medium text-foreground">
              {client.name}
            </span>
            <span className="text-xs text-muted">
              Added {new Date(client.createdAt).toLocaleDateString()}
            </span>
          </a>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setEditing(true);
              }}
            >
              Edit
            </Button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-error"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Confirm"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirmDelete(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="text-error"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmDelete(true);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
