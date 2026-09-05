import { NextRequest, NextResponse } from 'next/server';
import { enrichProductContent, type EnrichmentInput } from '@/lib/openrouter';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Auth check - verify admin session via cookie
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    try {
      const { decrypt } = await import('@/lib/auth');
      await decrypt(session);
    } catch {
      return NextResponse.json({ error: 'Oturum süresi dolmuş' }, { status: 401 });
    }

    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API anahtarı yapılandırılmamış. .env dosyasına OPENROUTER_API_KEY ekleyin.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();

    const {
      productName,
      productNameEn,
      category,
      description,
      descriptionEn,
      usage,
      usageEn,
      model,
      customPrompt,
    } = body;

    // Validate required fields
    if (!productName) {
      return NextResponse.json(
        { error: 'Ürün adı gereklidir' },
        { status: 400 }
      );
    }

    if (!description && !usage) {
      return NextResponse.json(
        { error: 'En az bir açıklama alanı (kullanıldığı yerler veya kullanım şekli) gereklidir' },
        { status: 400 }
      );
    }

    // Call AI enrichment
    const input: EnrichmentInput = {
      productName,
      productNameEn: productNameEn || '',
      category: category || '',
      description: description || '',
      descriptionEn: descriptionEn || '',
      usage: usage || '',
      usageEn: usageEn || '',
      model,
      customPrompt,
    };

    const result = await enrichProductContent(input, apiKey);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('AI enrichment error:', error);

    // Return user-friendly error messages
    let message = 'AI zenginleştirme sırasında bir hata oluştu';

    if (error.message?.includes('API hatası: 401')) {
      message = 'OpenRouter API anahtarı geçersiz. Lütfen kontrol edin.';
    } else if (error.message?.includes('API hatası: 429')) {
      message = 'Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin.';
    } else if (error.message?.includes('API hatası: 402')) {
      message = 'OpenRouter hesabınızda yeterli kredi yok.';
    } else if (error.message?.includes('JSON')) {
      message = 'AI yanıtı işlenemedi. Lütfen tekrar deneyin veya farklı bir model seçin.';
    } else if (error.message) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
