'use client';
import { useState } from 'react';

const MATCH_DATA = [
  { companion: 'أبو بكر رضي الله عنه', trait: '[خلق تجريبي — يُستبدل]', id: '1' },
  { companion: 'عمر بن الخطاب رضي الله عنه', trait: '[خلق تجريبي — يُستبدل]', id: '2' },
  { companion: 'خديجة رضي الله عنها', trait: '[خلق تجريبي — يُستبدل]', id: '3' },
];

export default function MatchGameClient() {
  const [dragging, setDragging] = useState<string | null>(null);
  const [correct, setCorrect] = useState<Set<string>>(new Set());
  const [stars, setStars] = useState(0);
  const [wrongAnim, setWrongAnim] = useState<string | null>(null);

  function handleDrop(id: string) {
    if (!dragging) return;
    if (dragging === id) {
      setCorrect(prev => new Set([...prev, id]));
      setStars(prev => prev + 1);
    } else {
      setWrongAnim(id);
      setTimeout(() => setWrongAnim(null), 800);
    }
    setDragging(null);
  }

  const shuffledTraits = [...MATCH_DATA].sort(() => Math.random() - 0.5);

  return (
    <div className="bg-white/90 dark:bg-[#F5F2EB] rounded-[2rem] p-6 sm:p-8 shadow-lg border border-amber-500/20 text-[#1E293B]">
      <p className="text-xs text-amber-700 bg-amber-100/70 rounded-xl px-3 py-2 mb-4">
        ⚠️ [بيانات تجريبية — تُستبدل بمحتوى موثق قبل الإطلاق]
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#4A6038] dark:text-slate-700 mb-2">الصحابي</p>
          {MATCH_DATA.map(d => (
            <div
              key={d.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(d.id)}
              className={`rounded-2xl p-3.5 text-sm border-2 min-h-[56px] flex items-center justify-between transition-all ${
                correct.has(d.id) ? 'border-green-400 bg-green-50 text-green-800' :
                wrongAnim === d.id ? 'border-red-300 bg-red-50 text-red-800 animate-pulse' :
                'border-[#48CAE4] bg-sky-50 dark:bg-white text-[#1E293B]'
              }`}
            >
              <span style={{ fontFamily: 'Baloo Bhaijaan 2' }}>{d.companion}</span>
              {correct.has(d.id) && <span className="ms-2 text-base">⭐</span>}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#4A6038] dark:text-slate-700 mb-2">الخُلق</p>
          {shuffledTraits.map(d => (
            !correct.has(d.id) ? (
              <div
                key={d.id}
                draggable
                onDragStart={() => setDragging(d.id)}
                className="rounded-2xl p-3.5 text-sm border-2 border-[#F4A261] bg-orange-50 dark:bg-white text-[#1E293B] cursor-grab active:cursor-grabbing hover:bg-orange-100 dark:hover:bg-amber-50 transition-all min-h-[56px] flex items-center shadow-sm"
              >
                {d.trait}
              </div>
            ) : null
          ))}
        </div>
      </div>
      {stars > 0 && (
        <p className="text-center text-[#F4A261] font-bold mt-4 text-lg" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
          {'⭐'.repeat(stars)} أحسنت! {stars} نجمة!
        </p>
      )}
      {stars === MATCH_DATA.length && (
        <p className="text-center text-green-600 font-bold mt-2 text-xl" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
          🎉 مبروك! أكملت اللعبة!
        </p>
      )}
    </div>
  );
}
