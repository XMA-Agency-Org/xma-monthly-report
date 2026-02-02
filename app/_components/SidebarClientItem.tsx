"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/Link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useClients } from "@/app/_providers/ClientsProvider";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import type { ClientRecord } from "@/app/_lib/api";

interface SidebarClientItemProps {
  client: ClientRecord;
}

export default function SidebarClientItem({ client }: SidebarClientItemProps) {
  const pathname = usePathname();
  const { editClient, removeClient } = useClients();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(client.name);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isActive = pathname.startsWith(`/clients/${client.id}`);

  async function handleSave() {
    if (!editName.trim() || editName.trim() === client.name) {
      setEditing(false);
      setEditName(client.name);
      return;
    }
    setSaving(true);
    await editClient(client.id, editName.trim());
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await removeClient(client.id);
    setDeleting(false);
    setShowDeleteDialog(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditing(false);
      setEditName(client.name);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 px-3 py-1.5">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          inputSize="sm"
          autoFocus
          className="flex-1 text-xs"
        />
        <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 px-2 text-xs">
          {saving ? "…" : "OK"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditing(false);
            setEditName(client.name);
          }}
          className="h-7 px-2 text-xs"
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`group flex items-center rounded-md transition-colors ${
          isActive ? "bg-sidebar-active text-foreground" : "text-muted hover:bg-sidebar-hover hover:text-foreground"
        }`}
      >
        <Link
          href={`/clients/${client.id}`}
          variant="nav"
          className={`flex-1 truncate px-3 py-2 text-xs no-underline ${
            isActive ? "text-foreground" : ""
          }`}
        >
          {client.name}
        </Link>
        <div className="flex items-center gap-0.5 pr-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="rounded p-1 text-muted hover:bg-sidebar-hover hover:text-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="rounded p-1 text-muted hover:bg-sidebar-hover hover:text-error"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <ConfirmDeleteDialog
        name={client.name}
        open={showDeleteDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        deleting={deleting}
      />
    </>
  );
}
