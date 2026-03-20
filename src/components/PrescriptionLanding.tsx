'use client';

import { useState } from 'react';
import { Prescription } from '@/lib/types';
import { Locale, t } from '@/lib/i18n';

interface PrescriptionLandingProps {
  prescription: Prescription;
  locale: Locale;
  onBack: () => void;
}

// Mock pricing
function getPrice(id: number): { single: number; course: number; courseDays: number } {
  const base = 68 + (id % 5) * 10;
  return { single: base, course: base * 6, courseDays: 14 };
}

export default function PrescriptionLanding({ prescription, locale, onBack }: PrescriptionLandingProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const price = getPrice(prescription.id);

  const handlePayment = () => {
    setShowPayment(false);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-600">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-800">{t(locale, 'landingTitle')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 py-6 space-y-5">
          {/* Prescription header */}
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 items-center justify-center text-2xl mb-3">
              {locale === 'zh' ? '方' : 'Rx'}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{prescription.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t(locale, 'prescriptionId')}: XD-{String(prescription.id).padStart(3, '0')} | {t(locale, 'category')}: {prescription.category}
            </p>
          </div>

          {/* Price card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white">
            <p className="text-sm opacity-80">{t(locale, 'priceLabel')}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold">¥{price.single}</span>
              <span className="text-sm opacity-80">/ {locale === 'zh' ? '剂' : 'dose'}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-sm">
                {t(locale, 'courseLabel')}：{price.courseDays} {t(locale, 'courseDays')}
              </p>
              <p className="text-sm mt-1">
                {t(locale, 'coursePrice')}：<span className="font-semibold text-lg">¥{price.course}</span>
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {([
              ['efficacy', prescription.efficacy],
              ['indication', prescription.indication],
              ['symptoms', prescription.symptoms],
              ['patternPoints', prescription.patternPoints],
              ['dosage', prescription.dosage],
              ['precautions', prescription.precautions],
            ] as const).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-emerald-700 mb-1">
                  {t(locale, key)}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 border-t bg-white px-4 py-4 space-y-2">
        <button
          onClick={() => setShowPayment(true)}
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
        >
          {t(locale, 'buyNow')} · ¥{price.single}
        </button>
        <button
          onClick={() => setShowContact(true)}
          className="w-full py-3 rounded-xl border border-emerald-500 text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
        >
          {t(locale, 'contactDoctor')}
        </button>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <div className="absolute inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{t(locale, 'paymentTitle')}</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">{prescription.name}</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">¥{price.single}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              >
                {t(locale, 'paymentCancel')}
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600"
              >
                {t(locale, 'paymentConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact modal */}
      {showContact && (
        <div className="absolute inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{t(locale, 'contactTitle')}</h3>
            <p className="text-sm text-gray-600">{t(locale, 'contactMsg')}</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-800">{t(locale, 'wechatId')}</p>
              <p className="text-sm text-gray-600">{t(locale, 'phoneNumber')}</p>
              <p className="text-sm text-gray-500">{t(locale, 'workHours')}</p>
            </div>
            <button
              onClick={() => setShowContact(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600"
            >
              {t(locale, 'contactClose')}
            </button>
          </div>
        </div>
      )}

      {/* Payment success toast */}
      {paymentSuccess && (
        <div className="absolute top-20 left-4 right-4 bg-emerald-500 text-white rounded-xl p-4 shadow-lg z-50 animate-bounce">
          <p className="font-semibold">{t(locale, 'paymentSuccess')}</p>
          <p className="text-sm opacity-90 mt-1">{t(locale, 'paymentSuccessMsg')}</p>
        </div>
      )}
    </div>
  );
}
