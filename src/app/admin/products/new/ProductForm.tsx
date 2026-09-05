'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, Undo2, Settings2 } from 'lucide-react';
import { createProduct } from '../actions';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import ToastParams from '@/components/admin/ToastParams';
import AIModelSelector from '@/components/admin/AIModelSelector';
import AIPreviewModal from '@/components/admin/AIPreviewModal';
import { toast } from 'sonner';
import { DEFAULT_MODEL } from '@/lib/openrouter';

interface Category {
    id: number;
    title: string;
}

interface Product {
    id: number;
    title: string;
    titleEn: string | null;
    categoryId: number | null;
    description: string | null;
    descriptionEn: string | null;
    usage: string | null;
    usageEn: string | null;
    slug: string;
    image: string | null;
    images: string | null;
}

interface ProductFormProps {
    categories: Category[];
    product?: Product;
    initialAiSettings?: {
        aiPrompt?: string;
        aiModel?: string;
    };
}

interface AIResult {
    description: string;
    descriptionEn: string;
    usage: string;
    usageEn: string;
    shortDescription: string;
    shortDescriptionEn: string;
    features: string[];
    featuresEn: string[];
}

export default function ProductForm({ categories, product, initialAiSettings }: ProductFormProps) {
    const [loading, setLoading] = useState(false);

    // Parse existing images: combine main image and additional images
    const initialImages = useMemo(() => {
        const imgs: string[] = [];
        if (product?.image) {
            imgs.push(product.image);
        }
        if (product?.images) {
            try {
                const additionalImages = JSON.parse(product.images);
                if (Array.isArray(additionalImages)) {
                    imgs.push(...additionalImages.filter((img: string) => img !== product.image));
                }
            } catch {
                // Invalid JSON, ignore
            }
        }
        return imgs;
    }, [product]);

    const [images, setImages] = useState<string[]>(initialImages);
    const isEditing = !!product;

    // Controlled textarea states for AI integration
    const [description, setDescription] = useState(product?.description || '');
    const [descriptionEn, setDescriptionEn] = useState(product?.descriptionEn || '');
    const [usage, setUsage] = useState(product?.usage || '');
    const [usageEn, setUsageEn] = useState(product?.usageEn || '');

    // AI-related states
    const [aiLoading, setAiLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(() => {
        return initialAiSettings?.aiModel || (typeof window !== 'undefined' ? localStorage.getItem('ai-model') : '') || DEFAULT_MODEL;
    });
    const [showPromptSettings, setShowPromptSettings] = useState(false);
    const [customPrompt, setCustomPrompt] = useState(() => {
        return initialAiSettings?.aiPrompt || (typeof window !== 'undefined' ? localStorage.getItem('ai-custom-prompt') : '') || '';
    });
    const [savingPrompt, setSavingPrompt] = useState(false);
    const [promptSaved, setPromptSaved] = useState(false);
    const promptDebounceRef = useRef<NodeJS.Timeout | null>(null);

    const [showPreview, setShowPreview] = useState(false);
    const [aiResult, setAiResult] = useState<AIResult | null>(null);
    const [originalTexts, setOriginalTexts] = useState<{
        description: string;
        descriptionEn: string;
        usage: string;
        usageEn: string;
    } | null>(null);
    const [canUndo, setCanUndo] = useState(false);

    const router = useRouter();

    // Sync with DB if props change or fetch on mount
    useEffect(() => {
        if (initialAiSettings?.aiPrompt) {
            setCustomPrompt(initialAiSettings.aiPrompt);
        }
        if (initialAiSettings?.aiModel) {
            setSelectedModel(initialAiSettings.aiModel);
        }

        fetch('/api/ai-settings')
            .then((res) => res.json())
            .then((res) => {
                if (res.success && res.data) {
                    if (res.data.aiPrompt) {
                        setCustomPrompt(res.data.aiPrompt);
                    }
                    if (res.data.aiModel) {
                        setSelectedModel(res.data.aiModel);
                    }
                }
            })
            .catch(() => {});
    }, [initialAiSettings]);

    // Save prompt to DB and localStorage
    const savePromptToDb = useCallback(async (promptText: string) => {
        setSavingPrompt(true);
        try {
            await fetch('/api/ai-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiPrompt: promptText }),
            });
            if (typeof window !== 'undefined') {
                localStorage.setItem('ai-custom-prompt', promptText);
            }
            setPromptSaved(true);
            setTimeout(() => setPromptSaved(false), 2500);
        } catch (e) {
            console.error('Failed to save AI prompt:', e);
        } finally {
            setSavingPrompt(false);
        }
    }, []);

    // Save model preference to DB and localStorage
    const handleModelChange = useCallback((model: string) => {
        setSelectedModel(model);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ai-model', model);
        }
        fetch('/api/ai-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aiModel: model }),
        }).catch(() => {});
    }, []);

    // Save custom prompt preference with debounce
    const handleCustomPromptChange = useCallback((prompt: string) => {
        setCustomPrompt(prompt);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ai-custom-prompt', prompt);
        }

        if (promptDebounceRef.current) {
            clearTimeout(promptDebounceRef.current);
        }
        promptDebounceRef.current = setTimeout(() => {
            savePromptToDb(prompt);
        }, 1200);
    }, [savePromptToDb]);

    // Load recommended default SEO prompt
    const loadDefaultSeoPrompt = useCallback(() => {
        const defaultSeo = `Aquachems endüstriyel kimyasal ürünleri için açıklama yazıyorsun. Şu kurallara uy:

1. SEO ODAKLI YAZ: Ürün adını ve sektör anahtar kelimelerini ilk cümlede kullan. Google'da üst sıralarda çıkacak şekilde doğal keyword yerleştir.
2. TEKNİK BİLGİYİ KORU: Mevcut metindeki teknik bilgileri, kullanım oranlarını ve güvenlik detaylarını koru, uydurma bilgi ekleme.
3. VURGULAMA VE FORMAT: Önemli ürün avantajlarını, etki mekanizmasını ve teknik özellikleri **kalın** yazarak vurgula.
4. ENDÜSTRİYEL KİMYA DİLİ: Su şartlandırma, kazan ve soğutma suyu, ters ozmoz (RO), membran kimyasalları, dezenfektan ve endüstriyel temizlik alanlarındaki uzmanlığı yansıt.
5. İKİ DİL UYUMU: Türkçe ve İngilizce açıklamaların birbiriyle birebir uyumlu, profesyonel B2B ihracat standartlarında olmasını sağla.`;

        setCustomPrompt(defaultSeo);
        savePromptToDb(defaultSeo);
        toast.success('Örnek SEO promptu yüklendi ve veritabanına kaydedildi');
    }, [savePromptToDb]);

    // Call AI enrichment API
    const callAIEnrich = useCallback(async () => {
        // Get form values
        const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
        const titleEnInput = document.querySelector<HTMLInputElement>('input[name="titleEn"]');
        const categorySelect = document.querySelector<HTMLSelectElement>('select[name="categoryId"]');

        const productName = titleInput?.value || '';
        const productNameEn = titleEnInput?.value || '';
        const categoryOption = categorySelect?.selectedOptions[0];
        const category = categoryOption?.textContent || '';

        if (!productName) {
            toast.error('Lütfen önce ürün adını girin');
            return;
        }

        if (!description && !usage) {
            toast.error('En az bir açıklama alanını doldurun (Kullanıldığı Yerler veya Kullanım Şekli)');
            return;
        }

        setAiLoading(true);

        try {
            const response = await fetch('/api/ai-enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName,
                    productNameEn,
                    category,
                    description,
                    descriptionEn,
                    usage,
                    usageEn,
                    model: selectedModel,
                    customPrompt: customPrompt || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'AI zenginleştirme başarısız oldu');
            }

            setAiResult(data.data);
            setShowPreview(true);
        } catch (error: any) {
            console.error('AI enrichment failed:', error);
            toast.error(error.message || 'AI zenginleştirme sırasında bir hata oluştu');
        } finally {
            setAiLoading(false);
        }
    }, [description, descriptionEn, usage, usageEn, selectedModel, customPrompt]);

    // Apply AI results to form
    const applyAIResults = useCallback(() => {
        if (!aiResult) return;

        // Save originals for undo
        setOriginalTexts({
            description,
            descriptionEn,
            usage,
            usageEn,
        });

        // Apply enriched texts
        setDescription(aiResult.description);
        setDescriptionEn(aiResult.descriptionEn);
        setUsage(aiResult.usage);
        setUsageEn(aiResult.usageEn);
        setCanUndo(true);
        setShowPreview(false);

        toast.success('AI zenginleştirme uygulandı!');
    }, [aiResult, description, descriptionEn, usage, usageEn]);

    // Undo AI changes
    const undoAIChanges = useCallback(() => {
        if (!originalTexts) return;

        setDescription(originalTexts.description);
        setDescriptionEn(originalTexts.descriptionEn);
        setUsage(originalTexts.usage);
        setUsageEn(originalTexts.usageEn);
        setCanUndo(false);
        setOriginalTexts(null);

        toast.info('Değişiklikler geri alındı');
    }, [originalTexts]);

    // Retry AI enrichment
    const retryAIEnrich = useCallback(async () => {
        setAiLoading(true);
        try {
            const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
            const titleEnInput = document.querySelector<HTMLInputElement>('input[name="titleEn"]');
            const categorySelect = document.querySelector<HTMLSelectElement>('select[name="categoryId"]');

            const response = await fetch('/api/ai-enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: titleInput?.value || '',
                    productNameEn: titleEnInput?.value || '',
                    category: categorySelect?.selectedOptions[0]?.textContent || '',
                    description,
                    descriptionEn,
                    usage,
                    usageEn,
                    model: selectedModel,
                    customPrompt: customPrompt || undefined,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'AI zenginleştirme başarısız oldu');
            }

            setAiResult(data.data);
        } catch (error: any) {
            toast.error(error.message || 'Tekrar denerken hata oluştu');
        } finally {
            setAiLoading(false);
        }
    }, [description, descriptionEn, usage, usageEn, selectedModel, customPrompt]);

    async function clientAction(formData: FormData) {
        setLoading(true);
        try {
            // Override form data with controlled state values
            formData.set('description', description);
            formData.set('descriptionEn', descriptionEn);
            formData.set('usage', usage);
            formData.set('usageEn', usageEn);

            // Add AI-generated fields if available
            if (aiResult) {
                formData.set('shortDescription', aiResult.shortDescription || '');
                formData.set('shortDescriptionEn', aiResult.shortDescriptionEn || '');
                formData.set('features', JSON.stringify(aiResult.features || []));
                formData.set('featuresEn', JSON.stringify(aiResult.featuresEn || []));
            }

            let result;
            if (isEditing && product) {
                formData.append('id', product.id.toString());
                const { updateProduct } = await import('../actions');
                result = await updateProduct(formData);
            } else {
                result = await createProduct(formData);
            }

            if (result.success) {
                toast.success(result.message);
                setTimeout(() => {
                    router.push('/admin/products');
                    router.refresh();
                }, 1500);
            } else {
                toast.error(result.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error('Beklenmedik bir hata oluştu');
        }
    }

    // Prepare preview data
    const previewFields = aiResult ? [
        {
            label: '📝 Kullanıldığı Yerler (Türkçe)',
            original: description,
            enriched: aiResult.description,
        },
        {
            label: '📝 Usage Areas (English)',
            original: descriptionEn,
            enriched: aiResult.descriptionEn,
        },
        {
            label: '🔧 Kullanım Şekli (Türkçe)',
            original: usage,
            enriched: aiResult.usage,
        },
        {
            label: '🔧 Usage Method (English)',
            original: usageEn,
            enriched: aiResult.usageEn,
        },
        {
            label: '🔍 Kısa SEO Açıklaması (Türkçe)',
            original: '',
            enriched: aiResult.shortDescription,
        },
        {
            label: '🔍 Short SEO Description (English)',
            original: '',
            enriched: aiResult.shortDescriptionEn,
        },
    ] : [];

    return (
        <div className="max-w-4xl mx-auto">
            <Suspense fallback={null}>
                <ToastParams />
            </Suspense>
            <div className="mb-6">
                <Link href="/admin/products" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 font-medium">
                    <ArrowLeft size={18} />
                    Ürünlere Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form action={clientAction} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Adı</label>
                            <input
                                name="title"
                                type="text"
                                required
                                defaultValue={product?.title}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Ürün Adı (İngilizce)</label>
                            <input
                                name="titleEn"
                                type="text"
                                defaultValue={product?.titleEn || ''}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                            <select
                                name="categoryId"
                                defaultValue={product?.categoryId || ''}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Görselleri</label>
                        <MultiImageUpload
                            values={images}
                            onChange={setImages}
                            maxImages={6}
                            label=""
                            description="Önerilen: 800x800 px (kare) • WebP/PNG formatı • Max 2MB"
                        />
                        {/* Main image (first one) */}
                        <input type="hidden" name="image" value={images[0] || ''} />
                        {/* All images as JSON array */}
                        <input type="hidden" name="images" value={JSON.stringify(images)} />
                    </div>

                    {/* AI Enrichment Section */}
                    <div className="border-2 border-dashed border-violet-200 rounded-xl p-5 bg-gradient-to-br from-violet-50/50 to-sky-50/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-sky-500 rounded-lg flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm">AI Açıklama Zenginleştirici</h3>
                                    <p className="text-xs text-slate-500">Açıklamaları SEO uyumlu şekilde yeniden yazar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Prompt Settings Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPromptSettings(!showPromptSettings)}
                                    className={`p-2 rounded-lg transition-colors ${showPromptSettings ? 'bg-violet-100 text-violet-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                    title="Prompt Ayarları"
                                >
                                    <Settings2 size={16} />
                                </button>

                                {/* Model Selector */}
                                <AIModelSelector value={selectedModel} onChange={handleModelChange} />
                            </div>
                        </div>

                        {/* Custom Prompt Settings */}
                        {showPromptSettings && (
                            <div className="mb-4 p-3.5 bg-white rounded-xl border border-violet-200 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Merkezi AI Prompt Talimatları (Veritabanında Saklanır)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={loadDefaultSeoPrompt}
                                            className="text-xs text-violet-600 hover:text-violet-800 font-medium underline cursor-pointer"
                                        >
                                            Örnek SEO Promptunu Yükle
                                        </button>
                                        {savingPrompt && (
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                <Loader2 size={12} className="animate-spin" /> Kaydediliyor...
                                            </span>
                                        )}
                                        {promptSaved && (
                                            <span className="text-[11px] text-emerald-600 font-medium">
                                                ✓ Kaydedildi
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => handleCustomPromptChange(e.target.value)}
                                    placeholder="Örn: Profesyonel ve teknik bir dilde yaz, madde madde listele, SEO anahtar kelimelerini doğal şekilde yerleştir..."
                                    className="w-full p-2.5 text-xs text-slate-700 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-violet-400 h-28 resize-y leading-relaxed font-sans"
                                />
                                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-[11px] text-slate-500">
                                        💾 Bu prompt veritabanında saklanır; ofiste veya evde farklı bilgisayardan bağlansanız da aynen korunur.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => savePromptToDb(customPrompt)}
                                        className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-md font-medium transition-colors cursor-pointer"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* AI Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={callAIEnrich}
                                disabled={aiLoading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-700 hover:to-sky-700 text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {aiLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Sparkles size={16} />
                                )}
                                {aiLoading ? 'AI Yazıyor...' : '✨ Tüm Açıklamaları AI ile Zenginleştir'}
                            </button>

                            {canUndo && (
                                <button
                                    type="button"
                                    onClick={undoAIChanges}
                                    className="flex items-center gap-1.5 px-3 py-2.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors font-medium text-sm border border-orange-200"
                                >
                                    <Undo2 size={14} />
                                    Geri Al
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Kullanıldığı Yerler</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-32"
                            placeholder="Ürün özelliklerini buraya yazın..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">Kullanıldığı Yerler (İngilizce)</label>
                        <textarea
                            name="descriptionEn"
                            value={descriptionEn}
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-32"
                            placeholder="Write product features/usage areas here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Kullanım Şekli</label>
                        <textarea
                            name="usage"
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-24"
                            placeholder="Örn: Otomotiv, Tekstil, Gıda sanayi..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">Kullanım Şekli (İngilizce)</label>
                        <textarea
                            name="usageEn"
                            value={usageEn}
                            onChange={(e) => setUsageEn(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-24"
                            placeholder="E.g., Automotive, Textile, Food industry..."
                        />
                    </div>

                    {/* AI-generated hidden fields */}
                    {aiResult && (
                        <>
                            <input type="hidden" name="shortDescription" value={aiResult.shortDescription || ''} />
                            <input type="hidden" name="shortDescriptionEn" value={aiResult.shortDescriptionEn || ''} />
                            <input type="hidden" name="features" value={JSON.stringify(aiResult.features || [])} />
                            <input type="hidden" name="featuresEn" value={JSON.stringify(aiResult.featuresEn || [])} />
                        </>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Ürünü Kaydet')}
                        </button>
                    </div>

                </form>
            </div>

            {/* AI Preview Modal */}
            <AIPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                onApply={applyAIResults}
                onRetry={retryAIEnrich}
                isRetrying={aiLoading}
                fields={previewFields}
                features={aiResult ? { tr: aiResult.features, en: aiResult.featuresEn } : undefined}
                featuresOriginal={{ tr: [], en: [] }}
            />
        </div>
    );
}
