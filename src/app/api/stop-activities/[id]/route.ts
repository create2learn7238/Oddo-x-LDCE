import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

async function findOwned(id: string, session: { userId: string; isAdmin: boolean }) {
  const sa = await prisma.stopActivity.findUnique({ where: { id }, include: { stop: { include: { trip: true } } } });
  if (!sa) return null;
  if (sa.stop.trip.userId !== session.userId && !session.isAdmin) return null;
  return sa;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  const sa = await findOwned(id, session);
  if (!sa) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.startTime !== undefined) data.startTime = body.startTime || null;
  if (typeof body.dayOffset === 'number') {
    const stop = await prisma.stop.findUnique({ where: { id: sa.stopId } });
    if (stop) {
      const nights = Math.round((stop.departureDate.getTime() - stop.arrivalDate.getTime()) / 86400000);
      if (body.dayOffset < 0 || body.dayOffset >= nights) {
        return NextResponse.json({ error: 'Day is outside this stop’s dates.' }, { status: 400 });
      }
      data.dayOffset = body.dayOffset;
    }
  }
  await prisma.stopActivity.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  const sa = await findOwned(id, session);
  if (!sa) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.stopActivity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
