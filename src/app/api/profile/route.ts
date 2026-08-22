import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { readSession, setSession } from '@/lib/auth';

export async function PATCH(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) {
    if (!body.name.trim()) return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
    data.name = body.name.trim();
  }
  if (body.photo !== undefined) data.photo = body.photo?.trim() || null;
  if (body.language !== undefined) data.language = body.language;
  if (body.email !== undefined) {
    const clean = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    const clash = await prisma.user.findUnique({ where: { email: clean } });
    if (clash && clash.id !== session.userId) {
      return NextResponse.json({ error: 'That email is already in use.' }, { status: 409 });
    }
    data.email = clean;
  }
  let newPass: string | undefined;
  if (body.password) {
    if (body.password.length < 6) return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    newPass = await bcrypt.hash(body.password, 10);
    data.password = newPass;
  }
  const user = await prisma.user.update({ where: { id: session.userId }, data });
  if (user) await setSession(user); // refresh cookie with updated name/email
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  await prisma.user.delete({ where: { id: session.userId } });
  return NextResponse.json({ ok: true });
}
