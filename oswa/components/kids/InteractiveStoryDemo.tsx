'use client';
import { useState } from 'react';

const STORY_STEPS = [
  {
    text: '[نص قصة تجريبية — يُستبدل بقصة موثقة قبل الإطلاق] كان الصحابي رضي الله عنه يتميز بصفة عظيمة...',
    question: 'ما هذه الصفة؟',
    choices: ['[خيار تجريبي أ]', '[خيار تجريبي ب]'],
    correct: 0,
  },
  {
    text: '[استمرار القصة التجريبية] وتعلمنا من هذا الموقف...',
    question: 'ما الدرس الذي تعلمناه؟',
    choices: ['[خيار تجريبي أ]', '[خيار تجريبي ب]'],
    correct: 0,
  },
];

export default function InteractiveStoryDemo() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const current = STORY_STEPS[step];

  function handleChoice(i: number) {
    setSelected(i);
    setTimeout(() => {
      if (step < STORY_STEPS.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 600);
  }

  if (done) {
    return (
      <div className="bg-white/90 dark:bg-[#F5F2EB] rounded-[2rem] p-8 shadow-lg text-center border border-amber-500/20">
        <p className="text-4xl mb-3">🌟🌟🌟</p>
        <p className="text-[#52B788] font-bold text-2xl" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>أحسنت! أكملت القصة!</p>
        <button onClick={() => { setStep(0); setDone(false); setSelected(null); }} className="mt-4 text-sm text-[#48CAE4] font-bold hover:underline">
          إعادة من البداية 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-[#F5F2EB] rounded-[2rem] p-6 sm:p-8 shadow-lg border border-amber-500/20">
      <p className="text-xs text-amber-700 bg-amber-100/70 rounded-xl px-3 py-2 mb-4">
        ⚠️ [محتوى تجريبي — يُستبدل بقصة موثقة قبل الإطلاق]
      </p>
      <div className="flex gap-1.5 mb-5">
        {STORY_STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-2.5 rounded-full transition-colors ${i <= step ? 'bg-[#48CAE4]' : 'bg-gray-200 dark:bg-slate-300'}`} />
        ))}
      </div>
      <p className="leading-relaxed mb-4 text-[#22301B] dark:text-[#1E293B] text-lg font-medium" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>{current.text}</p>
      <p className="font-bold text-[#F4A261] mb-3 text-lg" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>{current.question}</p>
      <div className="space-y-3">
        {current.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleChoice(i)}
            disabled={selected !== null}
            className={`w-full text-right rounded-2xl border-2 py-3.5 px-5 text-base font-medium transition-all focus-visible:ring-2 ${
              selected === i
                ? i === current.correct ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-300 bg-red-50 text-red-800'
                : 'border-[#48CAE4] dark:border-sky-300 bg-white/70 dark:bg-white text-[#1E293B] hover:bg-sky-50 dark:hover:bg-sky-50'
            }`}
            style={{ fontFamily: 'Baloo Bhaijaan 2' }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
