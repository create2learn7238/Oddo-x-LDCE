import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';
import { parseKey } from '@/lib/dates';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || (trip.userId !== session.userId && !session.isAdmin)) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) {
    if (!body.name.trim()) return NextResponse.json({ error: 'Trip name cannot be empty.' }, { status: 400 });
    data.name = body.name.trim();
  }
  if (body.description !== undefined) data.description = body.description?.trim() || null;
  if (body.coverEmoji !== undefined) data.coverEmoji = body.coverEmoji;
  if (body.coverColor !== undefined) data.coverColor = body.coverColor;
  if (body.coverImage !== undefined) data.coverImage = body.coverImage?.trim() || null;
  if (body.budgetTotal !== undefined) data.budgetTotal = body.budgetTotal ? Number(body.budgetTotal) : null;
  if (body.startDate && body.endDate) {
    const start = parseKey(body.startDate);
    const end = parseKey(body.endDate);
    if (end < start) return NextResponse.json({ error: 'End date must be on or after the start date.' }, { status: 400 });
    data.startDate = start;
    data.endDate = end;
  }
  const updated = await prisma.trip.update({ where: { id }, data });
  return NextResponse.json({ ok: true, id: updated.id });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || (trip.userId !== session.userId && !session.isAdmin)) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }
  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
