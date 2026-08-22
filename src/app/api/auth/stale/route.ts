import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE } from '@/lib/auth';

export async function GET(request: Request) {
  const jar = await cookies();
  jar.delete(COOKIE);
  return NextResponse.redirect(new URL('/login', request.url));
}
