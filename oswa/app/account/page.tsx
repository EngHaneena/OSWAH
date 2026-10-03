'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';

export default function AccountPage() {
  const router = useRouter();
  const { t, isArabic, dir } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'undisclosed' | ''>('');
  const [age, setAge] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user && !user.is_anonymous) {
          setUser(user);
          setIsGuest(false);

          // Fetch profile from supabase table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (profile) {
            setDisplayName(profile.display_name || '');
            setGender(profile.gender || '');
            setAge(profile.age ? String(profile.age) : '');
          } else {
            // Default from metadata if profile row doesn't exist yet
            setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
            setGender(user.user_metadata?.gender || '');
            setAge(user.user_metadata?.age ? String(user.user_metadata.age) : '');
          }
        } else {
          // Guest or anonymous
          setIsGuest(true);
          const savedName = localStorage.getItem('oswa_guest_name') || '';
          const savedGender = (localStorage.getItem('oswa_guest_gender') as any) || '';
          const savedAge = localStorage.getItem('oswa_guest_age') || '';

          setDisplayName(savedName);
          setGender(savedGender);
          setAge(savedAge);
        }
      } catch (err) {
        console.error('Error loading account:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  // Validation
  const validateForm = () => {
    if (!displayName.trim()) {
      setErrorMessage(t('account.nameRequired'));
      return false;
    }
    if (displayName.trim().length > 40) {
      setErrorMessage(t('account.nameTooLong'));
      return false;
    }
    if (age.trim() !== '') {
      const numAge = parseInt(age, 10);
      if (isNaN(numAge) || numAge < 3 || numAge > 120) {
        setErrorMessage(t('account.ageInvalid'));
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const parsedAge = age.trim() !== '' ? parseInt(age, 10) : null;
      const cleanGender = gender !== '' ? gender : null;

      if (user && !isGuest) {
        // Upsert to profiles table
        const { error: profileError } = await supabase.from('profiles').upsert({
          user_id: user.id,
          display_name: displayName.trim(),
          gender: cleanGender,
          age: parsedAge,
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

        // Also update auth user metadata for convenience
        await supabase.auth.updateUser({
          data: {
            full_name: displayName.trim(),
            gender: cleanGender,
            age: parsedAge,
          },
        });
      } else {
        // Guest mode: save locally only
        localStorage.setItem('oswa_is_guest', 'true');
        localStorage.setItem('oswa_guest_name', displayName.trim());
        if (cleanGender) localStorage.setItem('oswa_guest_gender', cleanGender);
        else localStorage.removeItem('oswa_guest_gender');
        if (parsedAge) localStorage.setItem('oswa_guest_age', String(parsedAge));
        else localStorage.removeItem('oswa_guest_age');
      }

      setSuccessMessage(t('account.savedSuccess'));
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const exportObject = {
      exportDate: new Date().toISOString(),
      accountType: isGuest ? 'guest' : 'registered',
      email: user?.email || null,
      profile: {
        display_name: displayName,
        gender: gender || null,
        age: age ? parseInt(age, 10) : null,
      },
      privacyNote:
        'All data is exported for your personal transparency and data portability.',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oswa_profile_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (user && !isGuest) {
        // Delete profile row (RLS policy enables user to delete own row)
        await supabase.from('profiles').delete().eq('user_id', user.id);
        // Delete favorites and any user data
        await supabase.from('favorites').delete().eq('user_id', user.id);
        await supabase.from('kid_progress').delete().eq('user_id', user.id);

        // Sign out
        await supabase.auth.signOut();
      }

      // Clear guest data
      localStorage.removeItem('oswa_is_guest');
      localStorage.removeItem('oswa_guest_name');
      localStorage.removeItem('oswa_guest_gender');
      localStorage.removeItem('oswa_guest_age');

      setShowDeleteModal(false);
      router.push('/');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setErrorMessage(err.message || 'فشل حذف الحساب');
      setDeleting(false);
    }
  };

  const parsedAge = age ? parseInt(age, 10) : null;
  const isKidsAge = parsedAge !== null && !isNaN(parsedAge) && parsedAge < 13;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" dir={dir}>
      <main className="max-w-xl mx-auto">
        {/* Breadcrumb back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-gold)] hover:underline"
          >
            <span>{isArabic ? '←' : '→'}</span>
            <span>{t('team.backHome')}</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-3xl p-6 sm:p-8 shadow-sm border border-[var(--color-gold)]/25 backdrop-blur-md">
          {/* Header */}
          <header className="text-center mb-6">
            <div className="w-20 h-20 bg-[var(--color-olive)] text-[var(--color-cream)] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3 shadow-md ring-2 ring-[var(--color-gold)]/30">
              {displayName ? displayName.charAt(0).toUpperCase() : '👤'}
            </div>
            <h1
              className="text-2xl sm:text-3xl text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-1"
              style={{ fontFamily: 'Aref Ruqaa, serif' }}
            >
              {t('account.title')}
            </h1>
            <p className="text-xs text-[var(--color-ink-light)] dark:text-[#a0a896]">
              {isGuest ? t('account.guestMode') : user?.email}
            </p>
          </header>

          <IslamicDivider />

          {/* Guest Storage Banner */}
          {isGuest && (
            <div className="my-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-[var(--color-ink)] dark:text-[#e4ddcc] flex items-start gap-2.5">
              <span className="text-amber-600 dark:text-amber-400 text-base">ℹ️</span>
              <div className="space-y-1">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  {t('account.guestMode')}
                </p>
                <p>{t('account.guestStorageNotice')}</p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-block text-xs font-bold text-[var(--color-olive)] dark:text-[var(--color-gold-light)] hover:underline"
                  >
                    {t('account.convertToAccount')} ←
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Notice Banner (Required by Challenge Guidelines) */}
          <div className="my-5 p-4 rounded-2xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 text-xs text-[var(--color-ink)] dark:text-[#e4ddcc] space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[var(--color-olive)] dark:text-[var(--color-gold-light)]">
              <span>🛡️</span>
              <span>ضوابط الخصوصية والأمان</span>
            </div>
            <p>{t('account.privacyNotice')}</p>
            <p className="text-[11px] text-[var(--color-ink-light)] dark:text-[#a0a896]">
              {t('account.privacyRights')}
            </p>
          </div>

          {/* Gentle Kids Suggestion if age < 13 */}
          {isKidsAge && (
            <div className="my-5 p-4 rounded-2xl bg-[#52B788]/15 border border-[#52B788]/30 text-xs text-[var(--color-ink)] dark:text-[#e4ddcc] flex items-center justify-between gap-3 animate-fade-in-up">
              <div className="flex items-start gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <h4 className="font-bold text-[#2d6a4f] dark:text-[#74c69d]">
                    {t('account.kidsSuggestionTitle')}
                  </h4>
                  <p className="text-[11px] mt-0.5">{t('account.kidsSuggestionMessage')}</p>
                </div>
              </div>
              <Link
                href="/kids"
                className="shrink-0 px-3 py-1.5 bg-[#52B788] text-white rounded-full text-xs font-bold shadow hover:bg-[#40916c] transition-colors"
              >
                {t('account.visitKids')}
              </Link>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm text-[var(--color-ink-light)]">
              {t('account.saving')}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 mt-6">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] dark:text-[#e4ddcc] mb-1.5">
                  {t('account.displayName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('account.displayNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-gold)]/30 bg-white/70 dark:bg-black/30 text-[var(--color-ink)] dark:text-[var(--color-cream)] placeholder-[var(--color-gold)]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] transition"
                />
                <span className="block text-[11px] text-[var(--color-ink-light)] dark:text-[#8e9986] mt-1 text-end">
                  {displayName.length}/40
                </span>
              </div>

              {/* Gender and Age Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] dark:text-[#e4ddcc] mb-1.5">
                    {t('account.gender')}{' '}
                    <span className="text-[11px] font-normal text-[var(--color-ink-light)]">
                      {t('account.genderOptional')}
                    </span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-gold)]/30 bg-white/70 dark:bg-[#151f0f] text-[var(--color-ink)] dark:text-[var(--color-cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] transition"
                  >
                    <option value="">{t('account.genderSelect')}</option>
                    <option value="male">{t('account.genderMale')}</option>
                    <option value="female">{t('account.genderFemale')}</option>
                    <option value="undisclosed">{t('account.genderUndisclosed')}</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] dark:text-[#e4ddcc] mb-1.5">
                    {t('account.age')}{' '}
                    <span className="text-[11px] font-normal text-[var(--color-ink-light)]">
                      {t('account.ageOptional')}
                    </span>
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t('account.agePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-gold)]/30 bg-white/70 dark:bg-black/30 text-[var(--color-ink)] dark:text-[var(--color-cream)] placeholder-[var(--color-gold)]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] transition"
                  />
                  <span className="block text-[11px] text-[var(--color-ink-light)] dark:text-[#8e9986] mt-1">
                    {t('account.ageHint')}
                  </span>
                </div>
              </div>

              {/* Status messages */}
              {errorMessage && (
                <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div role="status" className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-xs">
                  ✓ {successMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--color-olive)] hover:bg-[var(--color-ink)] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                >
                  {saving ? t('account.saving') : t('account.save')}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="py-2.5 px-3 rounded-xl border border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)]/10 text-[var(--color-ink)] dark:text-[#e4ddcc] text-xs font-semibold transition"
                  >
                    📦 {t('account.exportData')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="py-2.5 px-3 rounded-xl border border-red-400/40 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
                  >
                    🗑️ {t('account.deleteAccount')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Confirmation Modal for Delete Account */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deleteModalTitle"
        >
          <div className="bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-red-500/30 animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>
            <h3 id="deleteModalTitle" className="text-lg font-bold text-center text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-2">
              {t('account.deleteConfirmTitle')}
            </h3>
            <p className="text-xs text-[var(--color-ink-light)] dark:text-[#a0a896] text-center mb-6 leading-relaxed">
              {t('account.deleteConfirmMessage')}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--color-gold)]/30 text-xs font-medium text-[var(--color-ink)] dark:text-[var(--color-cream)] hover:bg-black/5"
              >
                {t('account.cancel')}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-50"
              >
                {deleting ? t('account.saving') : t('account.confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
