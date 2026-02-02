import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const allClients = await db.select().from(clients).orderBy(asc(clients.name));
  return NextResponse.json(allClients);
}

export async function POST(request: Request) {
  const { name } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Client name is required" }, { status: 400 });
  }

  const [created] = await db.insert(clients).values({ name: name.trim() }).returning();
  return NextResponse.json(created, { status: 201 });
}
