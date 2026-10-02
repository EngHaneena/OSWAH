'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ASWA_VERSE } from '@/constants/verse';
import { ProphetGlow } from '@/components/ornaments/IslamicPattern';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.push('/');
  }

  async function handleGuest() {
    setLoading(true);
    const result = await supabase.auth.signInAnonymously();
    if (result.error) {
      setError('فشل الدخول كضيف. يُرجى المحاولة لاحقاً.');
      setLoading(false);
      return;
    }
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-[#F6F1E3] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* شعار */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <ProphetGlow className="w-16 h-16" />
          </div>
          <h1 className="text-4xl text-[#22301B] mb-2" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
            أسوة
          </h1>
          <p className="text-sm text-[#B89B5E] font-quran leading-relaxed">
            ﴿ {ASWA_VERSE.text} ﴾
          </p>
        </div>

        {/* بطاقة تسجيل الدخول */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#B89B5E]/20">
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[#3F5233]/30 mb-5">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm transition-colors ${
                mode === 'login'
                  ? 'bg-[#3F5233] text-white'
                  : 'bg-transparent text-[#3F5233] hover:bg-[#3F5233]/10'
              }`}
            >
              دخول
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm transition-colors ${
                mode === 'signup'
                  ? 'bg-[#3F5233] text-white'
                  : 'bg-transparent text-[#3F5233] hover:bg-[#3F5233]/10'
              }`}
            >
              تسجيل
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm text-[#4A6038] mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#3F5233]/30 bg-white/80 px-4 py-2.5 text-[#22301B] placeholder-[#B89B5E] focus:outline-none focus:ring-2 focus:ring-[#3F5233] transition text-right"
                placeholder="name@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#4A6038] mb-1">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-[#3F5233]/30 bg-white/80 px-4 py-2.5 text-[#22301B] placeholder-[#B89B5E] focus:outline-none focus:ring-2 focus:ring-[#3F5233] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="text-red-700 text-sm rounded-lg bg-red-50 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#3F5233] hover:bg-[#22301B] text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#B89B5E]"
            >
              {loading ? 'جارٍ...' : mode === 'login' ? 'دخول' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="flex items-center gap-2 my-4">
            <hr className="flex-1 border-[#B89B5E]/30" />
            <span className="text-xs text-[#B89B5E]">أو</span>
            <hr className="flex-1 border-[#B89B5E]/30" />
          </div>

          <button
            onClick={handleGuest}
            disabled={loading}
            className="w-full border border-[#B89B5E] text-[#3F5233] hover:bg-[#B89B5E]/10 rounded-xl py-3 text-sm transition-colors disabled:opacity-60"
          >
            دخول كضيف (بدون حساب)
          </button>
        </div>

        <p className="text-center text-xs text-[#4A6038] mt-4">
          لا تُخزّن نصوص مشاكلك. المنصة أداة تعليمية.
        </p>
      </div>
    </main>
  );
}
