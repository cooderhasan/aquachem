'use client';

import React from 'react';

/**
 * Simple markdown renderer for product descriptions.
 * Supports: **bold**, *italic*, - bullet lists, numbered lists, line breaks.
 * No external dependency needed.
 */

interface SimpleMarkdownProps {
  content: string;
  className?: string;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  // Match **bold**, *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      result.push(<strong key={key++} className="font-semibold text-slate-800">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      result.push(<em key={key++} className="italic">{match[3]}</em>);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

export default function SimpleMarkdown({ content, className = '' }: SimpleMarkdownProps) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(
          <ul key={key++} className="my-3 space-y-2 list-none pl-0">
            {currentList}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key++} className="my-3 space-y-2 list-none pl-0">
            {currentList}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      // Only add spacing if not consecutive
      if (elements.length > 0) {
        elements.push(<div key={key++} className="h-2" />);
      }
      continue;
    }

    // Bullet list: - item or • item
    const bulletMatch = trimmed.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      currentList.push(
        <li key={key++} className="flex items-start gap-2.5 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0" />
          <span>{parseInlineMarkdown(bulletMatch[1])}</span>
        </li>
      );
      continue;
    }

    // Numbered list: 1. item, 2. item
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (numberedMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      currentList.push(
        <li key={key++} className="flex items-start gap-2.5 text-slate-600">
          <span className="text-primary-600 font-semibold min-w-[1.5rem] flex-shrink-0">{numberedMatch[1]}.</span>
          <span>{parseInlineMarkdown(numberedMatch[2])}</span>
        </li>
      );
      continue;
    }

    // Regular paragraph line
    flushList();
    elements.push(
      <p key={key++} className="leading-relaxed text-slate-600 my-1">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  }

  // Flush any remaining list
  flushList();

  return <div className={className}>{elements}</div>;
}
