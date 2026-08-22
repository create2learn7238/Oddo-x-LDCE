import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { tripId, activityId } = await req.json().catch(() => ({}));
  if (!tripId || !activityId) return NextResponse.json({ error: 'Trip and activity are required.' }, { status: 400 });

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || (trip.userId !== session.userId && !session.isAdmin)) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }
  const activity = await prisma.activity.findUnique({ where: { id: activityId }, include: { city: true } });
  if (!activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 });

  const stops = await prisma.stop.findMany({ where: { tripId }, orderBy: { arrivalDate: 'asc' } });
  let stop = stops.find((s) => s.cityId === activity.cityId);
  let createdStop = false;

  if (!stop) {
    // No stop in this city yet — create one after the last stop (or at the trip start)
    const last = stops[stops.length - 1];
    const base = last ? last.departureDate : trip.startDate;
    const arrival = new Date(base);
    const departure = new Date(base);
    departure.setDate(departure.getDate() + 2);
    stop = await prisma.stop.create({
      data: {
        tripId,
        cityId: activity.cityId,
        arrivalDate: arrival,
        departureDate: departure,
        sequence: stops.length,
      },
    });
    createdStop = true;
  }

  await prisma.stopActivity.create({
    data: { stopId: stop.id, activityId: activity.id, dayOffset: 0, startTime: '10:00', cost: activity.cost },
  });

  return NextResponse.json({
    ok: true,
    message: createdStop
      ? `Added ${activity.city.name} as a new stop, then scheduled the activity.`
      : `Scheduled on your ${activity.city.name} stop (Day 1).`,
  });
}
