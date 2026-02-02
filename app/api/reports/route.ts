import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reports, clients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ error: "clientId is required" }, { status: 400 });
  }

  const result = await db
    .select({
      id: reports.id,
      clientId: reports.clientId,
      clientName: clients.name,
      reportData: reports.reportData,
      createdAt: reports.createdAt,
      updatedAt: reports.updatedAt,
    })
    .from(reports)
    .innerJoin(clients, eq(reports.clientId, clients.id))
    .where(eq(reports.clientId, clientId))
    .orderBy(desc(reports.updatedAt));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { clientId, reportData } = await request.json();

  if (!clientId || !reportData) {
    return NextResponse.json({ error: "clientId and reportData are required" }, { status: 400 });
  }

  const [created] = await db
    .insert(reports)
    .values({ clientId, reportData })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
