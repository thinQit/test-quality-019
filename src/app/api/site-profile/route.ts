import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const profileSchema = z.object({
  title: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  ctaText: z.string().min(1).optional(),
  ctaHref: z.string().min(1).optional()
});

export async function GET() {
  try {
    const profile = await db.siteProfile.findFirst();
    if (!profile) {
      return NextResponse.json({
        success: true,
        data: { title: '', tagline: '', ctaText: '', ctaHref: '' }
      });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = requireAdmin(request.headers.get('authorization'), request.headers.get('x-api-key'));
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const existing = await db.siteProfile.findFirst();
    const data = parsed.data;

    const profile = existing
      ? await db.siteProfile.update({ where: { id: existing.id }, data })
      : await db.siteProfile.create({
          data: {
            title: data.title ?? '',
            tagline: data.tagline ?? '',
            ctaText: data.ctaText ?? '',
            ctaHref: data.ctaHref ?? ''
          }
        });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
