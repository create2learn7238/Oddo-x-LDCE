import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';
import { parseKey } from '@/lib/dates';
import { resyncSequences } from '@/lib/data';

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { tripId, cityId, arrivalDate, departureDate, notes } = await req.json().catch(() => ({}));
  if (!tripId || !cityId || !arrivalDate || !departureDate) {
    return NextResponse.json({ error: 'Trip, city and dates are required.' }, { status: 400 });
  }
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || (trip.userId !== session.userId && !session.isAdmin)) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) return NextResponse.json({ error: 'City not found' }, { status: 404 });

  const arrival = parseKey(arrivalDate);
  const departure = parseKey(departureDate);
  if (departure <= arrival) {
    return NextResponse.json({ error: 'Departure must be at least one day after arrival.' }, { status: 400 });
  }

  const stops = await prisma.stop.findMany({ where: { tripId }, orderBy: { arrivalDate: 'asc' } });
  // Insert in chronological order; sequence = number of stops arriving before this one.
  const sequence = stops.filter((s) => s.arrivalDate < arrival).length;
  const stop = await prisma.stop.create({
    data: { tripId, cityId, arrivalDate: arrival, departureDate: departure, notes: notes?.trim() || null, sequence },
  });
  // Keep sequences consistent with chronological order
  await resyncSequences(tripId, 'date');
  return NextResponse.json({ ok: true, id: stop.id });
}
