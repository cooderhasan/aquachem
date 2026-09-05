'use client';

import React, { useState } from 'react';
import { X, Check, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface FieldComparison {
  label: string;
  original: string;
  enriched: string;
}

interface AIPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onRetry: () => void;
  isRetrying: boolean;
  fields: FieldComparison[];
  features?: { tr: string[]; en: string[] };
  featuresOriginal?: { tr: string[]; en: string[] };
}

/**
 * Simple word-level diff for highlighting changes
 */
function computeWordDiff(original: string, enriched: string): { type: 'same' | 'added' | 'removed'; text: string }[] {
  if (!original && enriched) {
    return [{ type: 'added', text: enriched }];
  }
  if (original && !enriched) {
    return [{ type: 'removed', text: original }];
  }
  if (!original && !enriched) {
    return [];
  }

  const originalWords = original.split(/(\s+)/);
  const enrichedWords = enriched.split(/(\s+)/);

  // Simple LCS-based diff
  const m = originalWords.length;
  const n = enrichedWords.length;

  // For very long texts, fall back to simple comparison
  if (m * n > 100000) {
    if (original === enriched) {
      return [{ type: 'same', text: original }];
    }
    return [
      { type: 'removed', text: original },
      { type: 'added', text: enriched },
    ];
  }

  // Build LCS table
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalWords[i - 1] === enrichedWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];
  let i = m, j = n;

  const tempResult: { type: 'same' | 'added' | 'removed'; text: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalWords[i - 1] === enrichedWords[j - 1]) {
      tempResult.push({ type: 'same', text: originalWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempResult.push({ type: 'added', text: enrichedWords[j - 1] });
      j--;
    } else {
      tempResult.push({ type: 'removed', text: originalWords[i - 1] });
      i--;
    }
  }

  tempResult.reverse();

  // Merge consecutive same-type entries
  for (const item of tempResult) {
    if (result.length > 0 && result[result.length - 1].type === item.type) {
      result[result.length - 1].text += item.text;
    } else {
      result.push({ ...item });
    }
  }

  return result;
}

function DiffView({ original, enriched }: { original: string; enriched: string }) {
  const diff = computeWordDiff(original, enriched);

  if (diff.length === 0) {
    return <span className="text-slate-400 italic">Boş</span>;
  }

  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {diff.map((part, idx) => {
        if (part.type === 'added') {
          return (
            <span key={idx} className="bg-emerald-100 text-emerald-800 px-0.5 rounded">
              {part.text}
            </span>
          );
        }
        if (part.type === 'removed') {
          return (
            <span key={idx} className="bg-red-100 text-red-800 line-through px-0.5 rounded">
              {part.text}
            </span>
          );
        }
        return <span key={idx}>{part.text}</span>;
      })}
    </div>
  );
}

function FeaturesDiff({ original, enriched, label }: { original: string[]; enriched: string[]; label: string }) {
  if (enriched.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-600 mb-2">{label}</h4>
      <div className="space-y-1.5">
        {enriched.map((feature, idx) => {
          const isNew = !original.includes(feature);
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 text-sm p-2 rounded ${isNew ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'
                }`}
            >
              <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isNew ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className={isNew ? 'text-emerald-800' : 'text-slate-700'}>{feature}</span>
              {isNew && <span className="text-xs text-emerald-600 ml-auto flex-shrink-0">yeni</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AIPreviewModal({
  isOpen,
  onClose,
  onApply,
  onRetry,
  isRetrying,
  fields,
  features,
  featuresOriginal,
}: AIPreviewModalProps) {
  const [expandedFields, setExpandedFields] = useState<Set<number>>(new Set(fields.map((_, i) => i)));

  if (!isOpen) return null;

  const toggleField = (index: number) => {
    setExpandedFields(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-sky-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-sky-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">AI Önizleme</h2>
              <p className="text-xs text-slate-500">Değişiklikleri inceleyin, beğenirseniz uygulayın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 bg-emerald-100 border border-emerald-300 rounded" />
            <span className="text-slate-600">Eklenen</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded" />
            <span className="text-slate-600">Çıkarılan</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 bg-white border border-slate-300 rounded" />
            <span className="text-slate-600">Değişmedi</span>
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleField(index)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="font-medium text-slate-700 text-sm">{field.label}</span>
                {expandedFields.has(index) ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </button>
              {expandedFields.has(index) && (
                <div className="p-4 bg-white">
                  <DiffView original={field.original} enriched={field.enriched} />
                </div>
              )}
            </div>
          ))}

          {/* Features Section */}
          {features && (features.tr.length > 0 || features.en.length > 0) && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-50">
                <span className="font-medium text-slate-700 text-sm">✨ Otomatik Oluşturulan Özellikler</span>
              </div>
              <div className="p-4 bg-white space-y-4">
                <FeaturesDiff
                  original={featuresOriginal?.tr || []}
                  enriched={features.tr}
                  label="Türkçe Özellikler"
                />
                <FeaturesDiff
                  original={featuresOriginal?.en || []}
                  enriched={features.en}
                  label="English Features"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
          >
            İptal
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
              Tekrar Dene
            </button>
            <button
              onClick={onApply}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-700 hover:to-sky-700 text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-violet-500/25"
            >
              <Check size={16} />
              Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
