'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/i18n';

interface DisclaimerBannerProps {
  locale: Locale;
}

export default function DisclaimerBanner({ locale }: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center relative">
      <p className="text-amber-800 text-sm pr-6">{t(locale, 'disclaimer')}</p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700 text-lg leading-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
