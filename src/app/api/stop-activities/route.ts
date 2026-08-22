import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';
import { daysBetween, parseKey } from '@/lib/dates';

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { stopId, activityId, dayOffset, startTime, date } = await req.json().catch(() => ({}));
  if (!stopId || !activityId) return NextResponse.json({ error: 'Stop and activity are required.' }, { status: 400 });

  const stop = await prisma.stop.findUnique({ where: { id: stopId }, include: { trip: true, city: true } });
  if (!stop || (stop.trip.userId !== session.userId && !session.isAdmin)) {
    return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
  }
  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  if (activity.cityId !== stop.cityId) {
    return NextResponse.json({ error: `This activity is not in ${stop.city.name}.` }, { status: 400 });
  }

  // Date-based day offset (from a calendar drag/add) or explicit offset
  let offset = Number(dayOffset) || 0;
  if (date) {
    const d = parseKey(date);
    offset = daysBetween(stop.arrivalDate, d);
  }
  const nights = daysBetween(stop.arrivalDate, stop.departureDate); // total days in stop
  if (offset < 0 || offset >= nights) {
    return NextResponse.json({ error: 'Day is outside this stop’s dates.' }, { status: 400 });
  }

  const created = await prisma.stopActivity.create({
    data: { stopId, activityId, dayOffset: offset, startTime: startTime || null, cost: activity.cost },
  });
  return NextResponse.json({ ok: true, id: created.id });
}
