import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { decrypt } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET: AI ayarlarını oku
export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }
    try { await decrypt(session); } catch { return NextResponse.json({ error: 'Oturum dolmuş' }, { status: 401 }); }

    const result = await db.select({
      aiPrompt: settings.aiPrompt,
      aiModel: settings.aiModel,
    }).from(settings).limit(1);

    const data = result[0] || { aiPrompt: '', aiModel: 'openai/gpt-4o-mini' };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: AI ayarlarını güncelle
export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }
    try { await decrypt(session); } catch { return NextResponse.json({ error: 'Oturum dolmuş' }, { status: 401 }); }

    const { aiPrompt, aiModel } = await request.json();

    // Get existing settings row
    const existing = await db.select({ id: settings.id }).from(settings).limit(1);

    if (existing.length > 0) {
      const updateData: Record<string, any> = {};
      if (aiPrompt !== undefined) updateData.aiPrompt = aiPrompt;
      if (aiModel !== undefined) updateData.aiModel = aiModel;

      if (Object.keys(updateData).length > 0) {
        await db.update(settings).set(updateData).where(eq(settings.id, existing[0].id));
      }
    } else {
      await db.insert(settings).values({
        aiPrompt: aiPrompt || '',
        aiModel: aiModel || 'openai/gpt-4o-mini',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
