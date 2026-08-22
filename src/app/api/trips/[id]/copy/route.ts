import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id }, include: { stops: true } });
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

  const copy = await prisma.trip.create({
    data: {
      name: `${trip.name} (copy)`,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      coverEmoji: trip.coverEmoji,
      coverColor: trip.coverColor,
      coverImage: trip.coverImage,
      budgetTotal: trip.budgetTotal,
      isPublic: false,
      shareToken: null,
      userId: session.userId,
    },
  });

  for (const s of trip.stops) {
    const newStop = await prisma.stop.create({
      data: {
        tripId: copy.id,
        cityId: s.cityId,
        arrivalDate: s.arrivalDate,
        departureDate: s.departureDate,
        notes: s.notes,
        sequence: s.sequence,
      },
    });
    const sacts = await prisma.stopActivity.findMany({ where: { stopId: s.id } });
    if (sacts.length) {
      await prisma.stopActivity.createMany({
        data: sacts.map((a) => ({
          stopId: newStop.id,
          activityId: a.activityId,
          dayOffset: a.dayOffset,
          startTime: a.startTime,
          cost: a.cost,
        })),
      });
    }
  }
  return NextResponse.json({ ok: true, id: copy.id });
}
