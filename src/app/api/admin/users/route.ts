import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth';

export async function DELETE(req: Request) {
  const session = await readSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 });
  if (id === session.userId) return NextResponse.json({ error: 'You cannot remove yourself.' }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (target.isAdmin) return NextResponse.json({ error: 'Cannot remove an admin in demo mode.' }, { status: 400 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
