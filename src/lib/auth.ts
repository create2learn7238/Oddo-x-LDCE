import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from '@prisma/client';
import { prisma } from './db';

const SECRET = new TextEncoder().encode(process.env.GT_SECRET || 'globetrotter-hackathon-secret-key-2026');
export const COOKIE = 'gt_session';

export type Session = { userId: string; email: string; name: string; isAdmin: boolean; language: string; photo: string | null };

export async function signSession(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    language: user.language,
    ...(user.photo ? { photo: user.photo } : {}),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      isAdmin: Boolean(payload.isAdmin),
      language: String(payload.language ?? 'en'),
      photo: payload.photo ? String(payload.photo) : null,
    };
  } catch {
    return null;
  }
}

export async function setSession(user: User) {
  const token = await signSession(user);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 3600,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Server-component guard: returns the session or redirects to /login */
export async function requireUser(next?: string): Promise<Session> {
  const session = await readSession();
  if (!session) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : '/login');
  }
  // Verify user still exists in the database to prevent stale cookie sessions
  const exists = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!exists) {
    // Redirect through the stale session route handler to safely clear cookie on server-side GET
    redirect('/api/auth/stale');
  }
  return session;
}
