"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useClients } from "@/app/_providers/ClientsProvider";
import Link from "@/components/Link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Skeleton from "@/components/Skeleton";
import SidebarClientItem from "./SidebarClientItem";

export default function Sidebar() {
  const { clients, loading, addClient } = useClients();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await addClient(newName.trim());
      setNewName("");
    } catch {
      // error handled silently
    }
    setCreating(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCreate();
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link href="/" variant="nav" className="text-sm font-semibold text-foreground no-underline">
          XMA Reports
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded p-1 text-muted hover:text-foreground lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="px-3 py-3">
        <Link href="/reports/new" className="w-full no-underline">
          <Button className="w-full" size="sm">
            New Report
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        {loading ? (
          <div className="flex flex-col gap-2 px-1">
            <Skeleton size="full" />
            <Skeleton size="full" />
            <Skeleton size="full" />
          </div>
        ) : clients.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-muted">No clients yet</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {clients.map((client) => (
              <SidebarClientItem key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add client…"
            inputSize="sm"
            className="flex-1 text-xs"
          />
          <Button size="sm" onClick={handleCreate} disabled={creating || !newName.trim()} className="h-8 px-3">
            {creating ? "…" : "+"}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <Link href="/" variant="nav" className="text-sm font-semibold text-foreground no-underline">
          XMA Reports
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded p-1 text-muted hover:text-foreground"
        >
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[--spacing-sidebar] flex-col border-r border-border bg-sidebar lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[--spacing-sidebar] flex-col border-r border-border bg-sidebar lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
