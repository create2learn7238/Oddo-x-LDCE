import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  const trips = await prisma.trip.findMany({
    where: { userId: session.userId },
    select: { id: true, name: true },
    orderBy: { startDate: 'desc' },
  });
  return NextResponse.json({ trips });
}
