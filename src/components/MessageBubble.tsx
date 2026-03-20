'use client';

import { ChatMessage } from '@/lib/types';
import { Locale, t } from '@/lib/i18n';

interface MessageBubbleProps {
  message: ChatMessage;
  locale: Locale;
}

export default function MessageBubble({ message, locale }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 px-4 py-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
          isUser ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        {isUser ? t(locale, 'userAvatar') : t(locale, 'aiAvatar')}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-500 text-white rounded-tr-sm'
            : 'bg-white text-gray-800 rounded-tl-sm shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="prose prose-sm max-w-none prose-table:text-sm prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-table:border prose-th:border prose-td:border prose-th:bg-gray-50"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-semibold mt-3 mb-1">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr class="my-3 border-gray-200" />')
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-amber-300 pl-3 py-1 my-2 text-amber-800 bg-amber-50 rounded-r">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => /^[\s-:]+$/.test(c))) return '<!-- separator -->';
      const cellsHtml = cells.map(c => `<td class="px-3 py-2 border border-gray-200">${c.trim()}</td>`).join('');
      return `<tr>${cellsHtml}</tr>`;
    })
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');

  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>(?:\s*<!-- separator -->\s*<tr>[\s\S]*?<\/tr>)*)/g,
    '<table class="border-collapse border border-gray-200 my-3 w-full text-sm">$1</table>'
  );
  html = html.replace(/<!-- separator -->/g, '');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, '');

  return html;
}
