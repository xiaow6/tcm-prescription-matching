'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, ConversationState, UserProfile, Prescription } from '@/lib/types';
import { Locale, t } from '@/lib/i18n';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import ProfileForm from './ProfileForm';
import PrescriptionLanding from './PrescriptionLanding';
import DisclaimerBanner from './DisclaimerBanner';
import prescriptionsData from '@/data/prescriptions.json';

let idCounter = 0;
function generateId() {
  return 'msg-' + (++idCounter) + '-' + Math.random().toString(36).slice(2, 8);
}

export default function ChatContainer() {
  const [locale, setLocale] = useState<Locale>('zh');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [convState, setConvState] = useState<ConversationState>({
    stage: 'collecting',
    roundCount: 0,
  });
  const [landingPrescription, setLandingPrescription] = useState<Prescription | null>(null);

  const handleProfileSubmit = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];
      const apiMessages = allMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          stage: convState.stage,
          roundCount: convState.roundCount,
          userProfile,
          locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Request failed (${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullText = '';
        const assistantId = generateId();

        const assistantMsg: ChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId ? { ...m, content: fullText } : m
                    )
                  );
                }
              } catch {
                // Skip invalid JSON chunks
              }
            }
          }
        }

        setConvState({ stage: 'collecting', roundCount: 0 });
      } else {
        const data = await response.json();

        if (data.type === 'follow_up') {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: data.message,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, assistantMsg]);
          setConvState(prev => ({
            ...prev,
            roundCount: data.roundCount || prev.roundCount + 1,
          }));
        } else if (data.type === 'no_match') {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: data.message,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, assistantMsg]);
          setConvState({ stage: 'collecting', roundCount: 0 });
        } else if (data.error) {
          throw new Error(data.error);
        }

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `${t(locale, 'errorPrefix')}${error instanceof Error ? error.message : t(locale, 'unknownError')}${t(locale, 'errorSuffix')}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  }, [messages, convState, userProfile, locale]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setConvState({ stage: 'collecting', roundCount: 0 });
    setLandingPrescription(null);
  }, []);

  const handlePrescriptionClick = useCallback((prescriptionId: number) => {
    const p = (prescriptionsData as Prescription[]).find(rx => rx.id === prescriptionId);
    if (p) setLandingPrescription(p);
  }, []);

  // Landing page view
  if (landingPrescription) {
    return (
      <PrescriptionLanding
        prescription={landingPrescription}
        locale={locale}
        onBack={() => setLandingPrescription(null)}
      />
    );
  }

  const profileBadge = userProfile ? (
    <span className="text-xs text-gray-400 ml-1">
      {userProfile.name || (userProfile.gender === '男'
        ? (locale === 'zh' ? '先生' : 'Mr.')
        : (locale === 'zh' ? '女士' : 'Ms.'))}
      {userProfile.age ? ` ${userProfile.age}${locale === 'zh' ? '岁' : 'y'}` : ''}
    </span>
  ) : null;

  // Profile form
  if (!userProfile) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <DisclaimerBanner locale={locale} />
        <div className="shrink-0 bg-white border-b px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-base text-emerald-700 font-medium">
            {locale === 'zh' ? '医' : 'Dr'}
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-800">{t(locale, 'appTitle')}</h1>
            <p className="text-xs text-gray-400">{t(locale, 'appSubtitle')}</p>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ProfileForm onSubmit={handleProfileSubmit} locale={locale} onLocaleChange={setLocale} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DisclaimerBanner locale={locale} />
      {/* Header */}
      <div className="shrink-0 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-base text-emerald-700 font-medium">
            {locale === 'zh' ? '医' : 'Dr'}
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-800">
              {t(locale, 'appTitle')}
              {profileBadge}
            </h1>
            <p className="text-xs text-gray-400">{t(locale, 'appSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Prescription quick access - show after recommendations */}
          {messages.some(m => m.role === 'assistant' && m.content.includes('XD-')) && (
            <PrescriptionButtons
              messages={messages}
              onClick={handlePrescriptionClick}
              locale={locale}
            />
          )}
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="text-sm text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              {t(locale, 'newChat')}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onExampleClick={sendMessage} locale={locale} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} locale={locale} />
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} locale={locale} />
    </div>
  );
}

// Extract prescription IDs from AI response and show clickable buttons
function PrescriptionButtons({
  messages,
  onClick,
  locale,
}: {
  messages: ChatMessage[];
  onClick: (id: number) => void;
  locale: Locale;
}) {
  // Find prescription IDs mentioned in assistant messages (XD-001 format)
  const ids = new Set<number>();
  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const matches = msg.content.matchAll(/XD-(\d{2,3})/g);
      for (const m of matches) {
        ids.add(parseInt(m[1]));
      }
    }
  }

  if (ids.size === 0) return null;

  return (
    <div className="flex gap-1">
      {Array.from(ids).slice(0, 3).map(id => {
        const p = (prescriptionsData as Prescription[]).find(rx => rx.id === id);
        if (!p) return null;
        return (
          <button
            key={id}
            onClick={() => onClick(id)}
            className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
            title={p.name}
          >
            {locale === 'zh' ? '查看处方' : 'View Rx'}
          </button>
        );
      })}
    </div>
  );
}
