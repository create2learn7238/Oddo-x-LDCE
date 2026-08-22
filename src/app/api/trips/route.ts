import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';
import { parseKey } from '@/lib/dates';

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { name, description, startDate, endDate, coverEmoji, coverColor, coverImage, budgetTotal } = await req.json().catch(() => ({}));
  if (!name?.trim()) return NextResponse.json({ error: 'Trip name is required.' }, { status: 400 });
  if (!startDate || !endDate) return NextResponse.json({ error: 'Start and end dates are required.' }, { status: 400 });

  const start = parseKey(startDate);
  const end = parseKey(endDate);
  if (end < start) return NextResponse.json({ error: 'End date must be on or after the start date.' }, { status: 400 });

  const trip = await prisma.trip.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      startDate: start,
      endDate: end,
      coverEmoji: coverEmoji || '🧳',
      coverColor: coverColor || '#0f766e',
      budgetTotal: budgetTotal ? Number(budgetTotal) : null,
      userId: session.userId,
    },
  });
  return NextResponse.json({ ok: true, id: trip.id });
}
