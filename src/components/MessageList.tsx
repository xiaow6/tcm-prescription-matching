'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/types';
import { Locale } from '@/lib/i18n';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  locale: Locale;
}

export default function MessageList({ messages, isLoading, locale }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="pb-4 pt-2">
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} locale={locale} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
