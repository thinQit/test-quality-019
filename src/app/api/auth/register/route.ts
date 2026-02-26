import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import db from '@/lib/db';
import { hashPassword, signJwt } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional()
});

type RegisterResponse = {
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
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { email, password, name } = parsed.data;
    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.adminUser.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        role: 'admin'
      }
    });

    const token = signJwt({ sub: user.id, role: 'admin', jti: randomUUID() });
    const response: RegisterResponse = {
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

    return NextResponse.json({ success: true, data: response }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
