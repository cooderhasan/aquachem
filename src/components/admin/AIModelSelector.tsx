'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, ChevronDown, Check } from 'lucide-react';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '@/lib/openrouter';

interface AIModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export default function AIModelSelector({ value, onChange }: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === value);
  const displayName = selectedModel?.name || value.split('/').pop() || DEFAULT_MODEL;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200"
      >
        <Bot size={14} className="text-violet-500" />
        <span className="font-medium">{displayName}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <p className="text-xs text-slate-500 font-medium px-2 py-1">Model Seçin</p>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${value === model.id
                  ? 'bg-violet-50 border border-violet-200'
                  : 'hover:bg-slate-50'
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{model.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">{model.provider}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{model.description}</p>
                </div>
                {value === model.id && (
                  <Check size={16} className="text-violet-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Custom model input */}
          <div className="p-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 px-2 mb-1">Özel model adı girin</p>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="örn: mistralai/mistral-7b"
                className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-violet-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (customModel.trim()) {
                    onChange(customModel.trim());
                    setIsOpen(false);
                    setCustomModel('');
                  }
                }}
                className="px-2.5 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Kullan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
