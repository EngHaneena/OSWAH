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
    <div className="bg-white/80 rounded-3xl p-5 shadow">
      <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-4">
        ⚠️ [بيانات تجريبية — تُستبدل بمحتوى موثق قبل الإطلاق]
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#4A6038] mb-2">الصحابي</p>
          {MATCH_DATA.map(d => (
            <div
              key={d.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(d.id)}
              className={`rounded-xl p-3 text-xs border-2 min-h-[52px] flex items-center transition-all ${
                correct.has(d.id) ? 'border-green-400 bg-green-50 text-green-800' :
                wrongAnim === d.id ? 'border-red-300 bg-red-50 animate-pulse' :
                'border-[#48CAE4] bg-sky-50'
              }`}
            >
              <span style={{ fontFamily: 'Baloo Bhaijaan 2' }}>{d.companion}</span>
              {correct.has(d.id) && <span className="mr-2 text-base">⭐</span>}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#4A6038] mb-2">الخُلق</p>
          {shuffledTraits.map(d => (
            !correct.has(d.id) ? (
              <div
                key={d.id}
                draggable
                onDragStart={() => setDragging(d.id)}
                className="rounded-xl p-3 text-xs border-2 border-[#F4A261] bg-orange-50 cursor-grab active:cursor-grabbing hover:bg-orange-100 transition-all min-h-[52px] flex items-center"
              >
                {d.trait}
              </div>
            ) : null
          ))}
        </div>
      </div>
      {stars > 0 && (
        <p className="text-center text-[#F4A261] font-bold mt-4" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
          {'⭐'.repeat(stars)} أحسنت! {stars} نجمة!
        </p>
      )}
      {stars === MATCH_DATA.length && (
        <p className="text-center text-green-600 font-bold mt-2" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
          🎉 مبروك! أكملت اللعبة!
        </p>
      )}
    </div>
  );
}
