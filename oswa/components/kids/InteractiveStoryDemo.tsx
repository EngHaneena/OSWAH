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
      <div className="bg-white/80 rounded-3xl p-6 shadow text-center">
        <p className="text-3xl mb-2">🌟🌟🌟</p>
        <p className="text-[#52B788] font-bold text-xl" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>أحسنت! أكملت القصة!</p>
        <button onClick={() => { setStep(0); setDone(false); setSelected(null); }} className="mt-3 text-xs text-[#48CAE4] underline">
          إعادة من البداية
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-3xl p-5 shadow">
      <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-4">
        ⚠️ [محتوى تجريبي — يُستبدل بقصة موثقة قبل الإطلاق]
      </p>
      <div className="flex gap-1 mb-4">
        {STORY_STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i <= step ? 'bg-[#48CAE4]' : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="leading-relaxed mb-4 text-[#22301B]" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>{current.text}</p>
      <p className="font-medium text-[#F4A261] mb-3" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>{current.question}</p>
      <div className="space-y-2">
        {current.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleChoice(i)}
            disabled={selected !== null}
            className={`w-full text-right rounded-2xl border-2 py-3 px-4 text-sm transition-all focus-visible:ring-2 ${
              selected === i
                ? i === current.correct ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-300 bg-red-50'
                : 'border-[#48CAE4] hover:bg-sky-50'
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
