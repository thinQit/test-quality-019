import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import db from '@/lib/db';
import { signJwt, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    createdAt: string;
    updatedAt: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signJwt({ sub: user.id, role: 'admin', jti: randomUUID() });
    const response: LoginResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? '',
        role: 'admin',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    };

    return NextResponse.json({ success: true, data: response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
