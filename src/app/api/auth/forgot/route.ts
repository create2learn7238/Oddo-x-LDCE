import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  // Demo mode: no email service — always report success without revealing whether the account exists.
  return NextResponse.json({ ok: true, message: 'If an account exists for that email, a reset link has been sent.' });
}
