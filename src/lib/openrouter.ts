/**
 * OpenRouter API Service
 * 
 * Provides AI-powered product description enrichment via OpenRouter.
 * Supports multiple LLM models (GPT-4o-mini, Gemini, Claude, etc.)
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface EnrichmentInput {
  productName: string;
  productNameEn?: string;
  category?: string;
  description: string;
  descriptionEn?: string;
  usage: string;
  usageEn?: string;
  customPrompt?: string;
  model?: string;
}

export interface EnrichmentOutput {
  description: string;
  descriptionEn: string;
  usage: string;
  usageEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  features: string[];
  featuresEn: string[];
}

// Popular models available on OpenRouter
export const AVAILABLE_MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Hızlı & Ekonomik', provider: 'OpenAI' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Hızlı & Akıllı', provider: 'Google' },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', description: 'Yüksek Kalite', provider: 'Anthropic' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'En İyi OpenAI', provider: 'OpenAI' },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'En İyi Google', provider: 'Google' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Açık Kaynak', provider: 'Meta' },
] as const;

export const DEFAULT_MODEL = 'openai/gpt-4o-mini';

/**
 * Call OpenRouter API with a prompt and get a response
 */
async function callOpenRouter(
  messages: { role: string; content: string }[],
  model: string = DEFAULT_MODEL,
  apiKey: string
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aquachems.com',
      'X-Title': 'Aquachems Admin Panel',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('OpenRouter API error:', response.status, errorBody);
    throw new Error(`OpenRouter API hatası: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error('OpenRouter API geçersiz yanıt döndürdü');
  }

  return data.choices[0].message.content;
}

/**
 * Build the system prompt for product enrichment
 */
function buildSystemPrompt(customPrompt?: string): string {
  const basePrompt = `Sen bir endüstriyel kimyasal ürün uzmanı ve SEO içerik yazarısın. Aquachems firması için ürün açıklamaları yazıyorsun.

GÖREV: Verilen ham ürün bilgilerini SEO'ya uygun, profesyonel ve zenginleştirilmiş şekilde yeniden yaz.

KURALLAR:
1. Açıklamalar doğal, akıcı ve profesyonel olmalı
2. SEO anahtar kelimelerini doğal şekilde yerleştir (keyword stuffing yapma)
3. Teknik doğruluğu koru, uydurma bilgi ekleme
4. Türkçe ve İngilizce versiyonlar birbirinin bire bir çevirisi değil, her dil için ayrı optimize edilmiş olmalı
5. Kısa açıklama (shortDescription) tam olarak 140-160 karakter arası olmalı (Google meta description)
6. Özellikler (features) 4-6 madde arasında, kısa ve öz olmalı
7. Kullanıldığı yerler (description) detaylı, sektörleri ve uygulama alanlarını kapsayan paragraflar olmalı
8. Kullanım şekli (usage) adım adım veya açıklayıcı tarzda olmalı`;

  const customSection = customPrompt
    ? `\n\nEK TALİMATLAR (kullanıcıdan):\n${customPrompt}`
    : '';

  return basePrompt + customSection;
}

/**
 * Build the user prompt with product data
 */
function buildUserPrompt(input: EnrichmentInput): string {
  return `Aşağıdaki ürün bilgilerini zenginleştir:

ÜRÜN ADI (Türkçe): ${input.productName}
ÜRÜN ADI (İngilizce): ${input.productNameEn || 'Belirtilmemiş'}
KATEGORİ: ${input.category || 'Belirtilmemiş'}

HAM AÇIKLAMA (Kullanıldığı Yerler - Türkçe):
${input.description || 'Belirtilmemiş'}

HAM AÇIKLAMA (Kullanıldığı Yerler - İngilizce):
${input.descriptionEn || 'Belirtilmemiş'}

HAM KULLANIM ŞEKLİ (Türkçe):
${input.usage || 'Belirtilmemiş'}

HAM KULLANIM ŞEKLİ (İngilizce):
${input.usageEn || 'Belirtilmemiş'}

Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir şey ekleme:
{
  "description": "Zenginleştirilmiş Türkçe kullanıldığı yerler açıklaması",
  "descriptionEn": "Enriched English usage areas description",
  "usage": "Zenginleştirilmiş Türkçe kullanım şekli",
  "usageEn": "Enriched English usage method",
  "shortDescription": "140-160 karakter Türkçe kısa SEO açıklaması",
  "shortDescriptionEn": "140-160 character English short SEO description",
  "features": ["özellik1", "özellik2", "özellik3", "özellik4"],
  "featuresEn": ["feature1", "feature2", "feature3", "feature4"]
}`;
}

/**
 * Enrich product description, usage, short description, and features
 * using OpenRouter LLM API
 */
export async function enrichProductContent(
  input: EnrichmentInput,
  apiKey: string
): Promise<EnrichmentOutput> {
  const model = input.model || DEFAULT_MODEL;

  const messages = [
    { role: 'system', content: buildSystemPrompt(input.customPrompt) },
    { role: 'user', content: buildUserPrompt(input) },
  ];

  const rawResponse = await callOpenRouter(messages, model, apiKey);

  // Parse JSON from response - handle markdown code blocks
  let jsonStr = rawResponse.trim();

  // Remove markdown code block if present
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  try {
    const parsed = JSON.parse(jsonStr);

    // Validate required fields
    return {
      description: parsed.description || input.description,
      descriptionEn: parsed.descriptionEn || input.descriptionEn || '',
      usage: parsed.usage || input.usage,
      usageEn: parsed.usageEn || input.usageEn || '',
      shortDescription: parsed.shortDescription || '',
      shortDescriptionEn: parsed.shortDescriptionEn || '',
      features: Array.isArray(parsed.features) ? parsed.features : [],
      featuresEn: Array.isArray(parsed.featuresEn) ? parsed.featuresEn : [],
    };
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', rawResponse);
    throw new Error('AI yanıtı geçerli JSON formatında değil. Lütfen tekrar deneyin.');
  }
}
