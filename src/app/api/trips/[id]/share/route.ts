import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

const TOKENS = 'abcdefghjkmnpqrstuvwxyz23456789';
function genToken() {
  let t = '';
  for (let i = 0; i < 8; i++) t += TOKENS[Math.floor(Math.random() * TOKENS.length)];
  return t;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.userId) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

  const { isPublic, newToken } = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof isPublic === 'boolean') {
    data.isPublic = isPublic;
    // First time going public — generate a token
    if (isPublic && !trip.shareToken) data.shareToken = genToken();
  }
  if (newToken) data.shareToken = genToken();
  const updated = await prisma.trip.update({ where: { id }, data });
  return NextResponse.json({ ok: true, isPublic: updated.isPublic, shareToken: updated.shareToken });
}
