'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { Locale, t } from '@/lib/i18n';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function ProfileForm({ onSubmit, locale, onLocaleChange }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: '',
    age: '',
    medicalHistory: '',
    allergies: '',
  });
  const [showPregnant, setShowPregnant] = useState(false);

  const handleGenderChange = (gender: '男' | '女') => {
    setProfile(prev => ({ ...prev, gender }));
    setShowPregnant(gender === '女');
    if (gender === '男') {
      setProfile(prev => ({ ...prev, gender, isPregnant: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const canSubmit = profile.gender !== '';

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* Language toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => onLocaleChange('zh')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            locale === 'zh' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => onLocaleChange('en')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            locale === 'en' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          English
        </button>
      </div>

      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl mb-4">
        {locale === 'zh' ? '医' : 'Dr'}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{t(locale, 'profileTitle')}</h2>
      <p className="text-gray-500 text-sm text-center mb-6">{t(locale, 'profileSubtitle')}</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(locale, 'nameLabel')} <span className="text-gray-400 font-normal">{t(locale, 'nameOptional')}</span>
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t(locale, 'namePlaceholder')}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(locale, 'genderLabel')} <span className="text-red-400">{t(locale, 'genderRequired')}</span>
          </label>
          <div className="flex gap-3">
            {(['男', '女'] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => handleGenderChange(g)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  profile.gender === g
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {g === '男' ? t(locale, 'male') : t(locale, 'female')}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(locale, 'ageLabel')} <span className="text-gray-400 font-normal">{t(locale, 'nameOptional')}</span>
          </label>
          <input
            type="number"
            value={profile.age}
            onChange={e => setProfile(prev => ({ ...prev, age: e.target.value }))}
            placeholder={t(locale, 'agePlaceholder')}
            min="1"
            max="120"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Pregnant (female) */}
        {showPregnant && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, 'pregnantLabel')}</label>
            <div className="flex gap-3">
              {[
                { label: t(locale, 'pregnantNo'), value: false },
                { label: t(locale, 'pregnantYes'), value: true },
              ].map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, isPregnant: opt.value }))}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    profile.isPregnant === opt.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Medical history */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(locale, 'medicalHistoryLabel')} <span className="text-gray-400 font-normal">{t(locale, 'nameOptional')}</span>
          </label>
          <input
            type="text"
            value={profile.medicalHistory}
            onChange={e => setProfile(prev => ({ ...prev, medicalHistory: e.target.value }))}
            placeholder={t(locale, 'medicalHistoryPlaceholder')}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(locale, 'allergiesLabel')} <span className="text-gray-400 font-normal">{t(locale, 'nameOptional')}</span>
          </label>
          <input
            type="text"
            value={profile.allergies}
            onChange={e => setProfile(prev => ({ ...prev, allergies: e.target.value }))}
            placeholder={t(locale, 'allergiesPlaceholder')}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3 rounded-lg bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 transition-colors mt-2"
        >
          {t(locale, 'startConsultation')}
        </button>

        <p className="text-xs text-gray-400 text-center">{t(locale, 'privacyNotice')}</p>
      </form>
    </div>
  );
}
