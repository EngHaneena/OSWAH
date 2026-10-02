'use client';
import { useState } from 'react';
import { IslamicDivider, ProphetGlow } from '@/components/ornaments/IslamicPattern';
import WisdomResult from '@/components/cards/WisdomResult';
import Navbar from '@/components/layout/Navbar';

const EMOTION_TAGS = [
  { label: 'وحدة', icon: '🌑' },
  { label: 'حزن', icon: '💧' },
  { label: 'قلق', icon: '🌊' },
  { label: 'غضب', icon: '⚡' },
  { label: 'مرض', icon: '🌿' },
  { label: 'خيبة أمل', icon: '🌧️' },
];

export default function WisdomPage() {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!problem.trim() || problem.trim().length < 5) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('حدث خطأ في الاتصال. يُرجى المحاولة.');
    } finally {
      setLoading(false);
    }
  }

  function appendTag(label: string) {
    setProblem(p => p ? `${p}، ${label}` : label);
  }

  return (
    <div className="min-h-screen bg-[#F6F1E3] flex flex-col font-[--font-ibm-plex-arabic]" dir="rtl">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        {/* رأس الصفحة */}
        <header className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <ProphetGlow className="w-20 h-20" />
          </div>
          <h1 className="text-4xl md:text-5xl text-[#22301B] mb-3" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
            عظة وعبرة
          </h1>
          <p className="text-[#4A6038] text-base md:text-lg">
            اكتب ما تمر به، وسنعرض لك موقفاً من سيرة النبي ﷺ يضيء لك الطريق.
          </p>
        </header>

        {/* وسوم المشاعر العائمة */}
        <div className="relative h-24 mb-2 flex items-center justify-center pointer-events-none" aria-hidden="true">
          {EMOTION_TAGS.map((tag, i) => {
            // Some math to spread them out like a floating cloud
            const left = `${15 + (i * 15)}%`;
            const top = `${(i % 2 === 0 ? 10 : 40)}px`;
            const delay = `${i * 0.7}s`;
            
            return (
              <div 
                key={tag.label}
                className="absolute animate-float"
                style={{ left, top, animationDelay: delay }}
              >
                <button
                  type="button"
                  onClick={() => appendTag(tag.label)}
                  className="pointer-events-auto text-sm font-medium text-[#3F5233] bg-white/80 dark:bg-[#3F5233]/20 dark:text-[#f0e9d6] border border-[#B89B5E]/30 rounded-full px-4 py-2 hover:bg-[#3F5233] hover:text-white hover:scale-110 shadow-sm backdrop-blur-sm transition-all"
                >
                  {tag.icon} {tag.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* نموذج الإدخال */}
        <form onSubmit={handleSubmit} className="mb-8 bg-white/60 dark:bg-black/20 p-6 rounded-[2rem] shadow-sm border border-[#B89B5E]/20 animate-fade-in-up relative z-10" style={{ animationDelay: '0.1s' }}>
          <textarea
            value={problem}
            onChange={e => setProblem(e.target.value)}
            placeholder="ماذا تشعر به الآن؟ اكتب بحرية وفي مساحة آمنة تماماً..."
            maxLength={2000}
            rows={5}
            className="w-full rounded-2xl border border-[#3F5233]/20 bg-white dark:bg-black/40 dark:text-white px-5 py-4 text-[#22301B] placeholder-[#B89B5E]/80 focus:outline-none focus:ring-2 focus:ring-[#3F5233] focus:border-transparent resize-none mb-3 text-lg leading-relaxed shadow-inner transition-colors"
            aria-label="وصف ما تشعر به"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[#B89B5E] font-medium">{problem.length}/2000</span>
            <button
              type="submit"
              disabled={loading || problem.trim().length < 5}
              className="w-full sm:w-auto bg-[#3F5233] hover:bg-[#22301B] text-[#F6F1E3] rounded-xl px-8 py-3.5 font-bold text-lg transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 shadow-md focus-visible:ring-4 focus-visible:ring-[#B89B5E] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>نبحث في السيرة...</span>
                </>
              ) : (
                'استعرض من السيرة'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div role="alert" className="bg-red-50 text-red-700 border border-red-200 rounded-2xl px-5 py-4 mb-6 text-center animate-fade-in-up">
            {error}
          </div>
        )}

        {result && <WisdomResult data={result} problem={problem} />}

        <div className="mt-12 text-center pb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <IslamicDivider className="w-full max-w-sm mx-auto mb-6 opacity-50" />
          <p className="text-xs text-[#4A6038]">
            ⚠️ هذه المنصة أداة تعليمية وليست مرجعاً شرعياً. النصوص الشرعية من قاعدة بيانات مراجعة.
          </p>
        </div>
      </main>
    </div>
  );
}
