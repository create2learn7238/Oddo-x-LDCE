import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';
import { parseKey } from '@/lib/dates';
import { resyncSequences } from '@/lib/data';

async function findOwnedStop(id: string, session: { userId: string; isAdmin: boolean }) {
  const stop = await prisma.stop.findUnique({ where: { id }, include: { trip: true } });
  if (!stop) return null;
  if (stop.trip.userId !== session.userId && !session.isAdmin) return null;
  return stop;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  const stop = await findOwnedStop(id, session);
  if (!stop) return NextResponse.json({ error: 'Stop not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
  if (body.arrivalDate && body.departureDate) {
    const arrival = parseKey(body.arrivalDate);
    const departure = parseKey(body.departureDate);
    if (departure <= arrival) return NextResponse.json({ error: 'Departure must be at least one day after arrival.' }, { status: 400 });
    data.arrivalDate = arrival;
    data.departureDate = departure;
    // day offsets may now exceed the stop length — clamp them
    const nights = Math.max(1, Math.round((departure.getTime() - arrival.getTime()) / 86400000) - 1);
    const acts = await prisma.stopActivity.findMany({ where: { stopId: id } });
    for (const a of acts) {
      if (a.dayOffset > nights) {
        await prisma.stopActivity.update({ where: { id: a.id }, data: { dayOffset: nights } });
      }
    }
  }
  await prisma.stop.update({ where: { id }, data });

  if (body.arrivalDate && body.departureDate) {
    await resyncSequences(stop.tripId, 'date');
  } else if (typeof body.sequence === 'number') {
    // Manual reorder: move this stop to the requested position
    const all = await prisma.stop.findMany({ where: { tripId: stop.tripId }, orderBy: { sequence: 'asc' } });
    const idx = all.findIndex((s) => s.id === id);
    if (idx >= 0) {
      const moved = [...all];
      const [item] = moved.splice(idx, 1);
      moved.splice(Math.max(0, Math.min(moved.length - 1, body.sequence)), 0, item);
      for (let i = 0; i < moved.length; i++) {
        if (moved[i].sequence !== i) {
          await prisma.stop.update({ where: { id: moved[i].id }, data: { sequence: i } });
        }
      }
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  const stop = await findOwnedStop(id, session);
  if (!stop) return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
  await prisma.stop.delete({ where: { id } });
  await resyncSequences(stop.tripId);
  return NextResponse.json({ ok: true });
}
