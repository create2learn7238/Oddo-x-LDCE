import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const city = await prisma.city.findUnique({ where: { id } });
  if (!city) return NextResponse.json({ error: 'City not found' }, { status: 404 });
  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { savedCities: { select: { id: true } } } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const saved = user.savedCities.some((c) => c.id === id);
  if (saved) {
    await prisma.user.update({ where: { id: user.id }, data: { savedCities: { disconnect: { id } } } });
    return NextResponse.json({ ok: true, saved: false });
  }
  await prisma.user.update({ where: { id: user.id }, data: { savedCities: { connect: { id } } } });
  return NextResponse.json({ ok: true, saved: true });
}
