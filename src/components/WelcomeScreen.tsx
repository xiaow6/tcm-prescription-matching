import { Locale, t, getExamples } from '@/lib/i18n';

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
  locale: Locale;
}

const icons = ['🫄', '🩺', '🦵', '💊', '😴', '🔴'];

export default function WelcomeScreen({ onExampleClick, locale }: WelcomeScreenProps) {
  const examples = getExamples(locale);

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl mb-4">
        {locale === 'zh' ? '医' : 'Dr'}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{t(locale, 'welcomeTitle')}</h2>
      <p className="text-gray-500 text-sm text-center mb-8 max-w-sm">{t(locale, 'welcomeSubtitle')}</p>

      <div className="w-full max-w-md space-y-2">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">{t(locale, 'tryExamples')}</p>
        <div className="grid gap-2">
          {examples.map((text, i) => (
            <button
              key={i}
              onClick={() => onExampleClick(text)}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors text-left text-sm text-gray-700"
            >
              <span className="text-lg shrink-0">{icons[i]}</span>
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
