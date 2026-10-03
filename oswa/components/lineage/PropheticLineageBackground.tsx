'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

interface PropheticLineageBackgroundProps {
  isHighlighted?: boolean;
}

export default function PropheticLineageBackground({
  isHighlighted = false,
}: PropheticLineageBackgroundProps) {
  const { isArabic } = useTranslation();

  // Opacity classes based on watermark mode vs highlighted mode
  // Watermark: subtle 12%-18% opacity, non-distracting
  // Highlighted: 70%-85% opacity with clear illuminated nodes
  const containerOpacity = isHighlighted
    ? 'opacity-80 dark:opacity-90 scale-[1.01]'
    : 'opacity-15 dark:opacity-20 scale-100';

  return (
    <div
      data-testid="lineage-tree-background"
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center transition-all duration-700 ease-out ${containerOpacity}`}
    >
      <svg
        viewBox="0 0 1440 960"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover text-[#3F5233] dark:text-[#E6C36A]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle gold glow filter for nodes */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Radial gradient for Prophet ﷺ apex node */}
          <radialGradient id="apexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#B89B5E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B89B5E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================
            1. Graceful Decorative Connecting Branches (SVG Bezier Paths)
            Arching around the central hero space to preserve central legibility
            ======================================================== */}
        <g
          stroke="currentColor"
          strokeWidth={isHighlighted ? '1.8' : '1.2'}
          strokeLinecap="round"
          className="transition-all duration-500 opacity-60 dark:opacity-75"
        >
          {/* Central Trunk: Base from Adnan (720, 910) rising through Ma'add and Nizar */}
          <path d="M 720 920 C 720 880, 720 850, 720 810" />

          {/* Bifurcation at Nizar (720, 810) into Right and Left Flanks */}
          {/* Right Flank: Arching up towards Mudar, Ilyas, Mudrikah, Khuzaymah, Kinana, Nadr, Malik, Fihr, Ghalib, Lu'ayy, Ka'b */}
          <path d="M 720 810 C 820 805, 940 780, 1030 735" />
          <path d="M 1030 735 C 1120 690, 1200 630, 1245 545" />
          <path d="M 1245 545 C 1285 460, 1285 365, 1245 280" />
          <path d="M 1245 280 C 1200 190, 1100 130, 990 95" />
          <path d="M 990 95 C 900 65, 800 65, 720 65" />

          {/* Left Flank: Arching up towards Murrah, Kilab, Qusayy, Abd Manaf, Hashim, Abd al-Muttalib, Abdullah */}
          <path d="M 720 810 C 620 805, 500 780, 410 735" />
          <path d="M 410 735 C 320 690, 240 630, 195 545" />
          <path d="M 195 545 C 155 460, 155 365, 195 280" />
          <path d="M 195 280 C 240 190, 340 130, 450 95" />
          <path d="M 450 95 C 540 65, 640 65, 720 65" />

          {/* Symmetrical Arabesque Leaf Flourishes & Palmettes */}
          {/* Bottom Root Flourishes */}
          <path d="M 720 920 C 690 935, 650 940, 620 930 Q 660 920, 700 920" fill="currentColor" fillOpacity="0.2" />
          <path d="M 720 920 C 750 935, 790 940, 820 930 Q 780 920, 740 920" fill="currentColor" fillOpacity="0.2" />

          {/* Side Arabesque Buds */}
          <path d="M 1245 545 C 1290 530, 1330 540, 1350 560 Q 1310 565, 1270 555" fill="currentColor" fillOpacity="0.15" />
          <path d="M 195 545 C 150 530, 110 540, 90 560 Q 130 565, 170 555" fill="currentColor" fillOpacity="0.15" />

          <path d="M 1245 280 C 1300 260, 1340 280, 1360 300 Q 1310 300, 1260 285" fill="currentColor" fillOpacity="0.15" />
          <path d="M 195 280 C 140 260, 100 280, 80 300 Q 130 300, 180 285" fill="currentColor" fillOpacity="0.15" />
        </g>

        {/* ========================================================
            2. Lineage Nodes & Calligraphic Medallions
            ======================================================== */}
        <g className="font-serif">
          {/* ROOT: عدنان (Generation 22) - Bottom Center */}
          <g transform="translate(720, 920)">
            <circle r={isHighlighted ? 26 : 22} fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
            <circle r="4" fill="currentColor" />
            <text y="-8" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              عدنان
            </text>
            <text y="9" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              {isArabic ? 'رأس النسب' : 'Adnan'}
            </text>
          </g>

          {/* Generation 21: معد */}
          <g transform="translate(720, 860)">
            <circle r="18" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              معد
            </text>
          </g>

          {/* Generation 20: نزار */}
          <g transform="translate(720, 800)">
            <circle r="19" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.2" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              نزار
            </text>
          </g>

          {/* ==================== RIGHT FLANK (الأجداد من مضر إلى كعب) ==================== */}
          {/* Generation 19: مضر */}
          <g transform="translate(860, 770)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              مضر
            </text>
          </g>

          {/* Generation 18: إلياس */}
          <g transform="translate(980, 730)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              إلياس
            </text>
          </g>

          {/* Generation 17: مدركة */}
          <g transform="translate(1090, 675)">
            <circle r="21" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              مدركة
            </text>
          </g>

          {/* Generation 16: خزيمة */}
          <g transform="translate(1180, 610)">
            <circle r="21" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              خزيمة
            </text>
          </g>

          {/* Generation 15: كنانة (Pivotal - اصطفاه الله) */}
          <g transform="translate(1240, 530)">
            <circle r={isHighlighted ? 25 : 22} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <text y="-5" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              كنانة
            </text>
            <text y="9" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.8" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              {isArabic ? 'المصطفى' : 'Kinana'}
            </text>
          </g>

          {/* Generation 14: النضر */}
          <g transform="translate(1270, 440)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              النضر
            </text>
          </g>

          {/* Generation 13: مالك */}
          <g transform="translate(1265, 350)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              مالك
            </text>
          </g>

          {/* Generation 12: فهر (قريش) (Pivotal - جامع القبيلة) */}
          <g transform="translate(1230, 260)">
            <circle r={isHighlighted ? 28 : 24} fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <text y="-6" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              فهر
            </text>
            <text y="9" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" fillOpacity="0.9" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              (قريش)
            </text>
          </g>

          {/* Generation 11: غالب */}
          <g transform="translate(1160, 180)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              غالب
            </text>
          </g>

          {/* Generation 10: لؤي */}
          <g transform="translate(1070, 125)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              لؤي
            </text>
          </g>

          {/* Generation 9: كعب */}
          <g transform="translate(970, 85)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              كعب
            </text>
          </g>

          {/* ==================== LEFT FLANK (الأجداد من مرة إلى عبد الله) ==================== */}
          {/* Generation 8: مرة */}
          <g transform="translate(860, 65)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              مرة
            </text>
          </g>

          {/* Generation 7: كلاب */}
          <g transform="translate(580, 65)">
            <circle r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              كلاب
            </text>
          </g>

          {/* Generation 6: قصي (Pivotal - مجمع قريش وسيد مكة) */}
          <g transform="translate(470, 85)">
            <circle r={isHighlighted ? 26 : 22} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <text y="-5" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              قصي
            </text>
            <text y="9" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.8" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              {isArabic ? 'المُجمِّع' : 'Qusayy'}
            </text>
          </g>

          {/* Generation 5: عبد مناف */}
          <g transform="translate(370, 125)">
            <circle r="21" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              عبد مناف
            </text>
          </g>

          {/* Generation 4: هاشم (Pivotal - عمرو العُلا صاحب الإيلاف) */}
          <g transform="translate(280, 180)">
            <circle r={isHighlighted ? 26 : 22} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.6" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <text y="-5" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              هاشم
            </text>
            <text y="9" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.8" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              {isArabic ? 'صاحب الإيلاف' : 'Hashim'}
            </text>
          </g>

          {/* Generation 3: عبد المطلب (Pivotal - شيبة الحمد وسيد الوادي) */}
          <g transform="translate(210, 260)">
            <circle r={isHighlighted ? 28 : 24} fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <text y="-6" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              عبد المطلب
            </text>
            <text y="9" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.85" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              {isArabic ? 'حافر زمزم' : 'Muttalib'}
            </text>
          </g>

          {/* Generation 2: عبد الله (Pivotal - والد النبي ﷺ) */}
          <g transform="translate(170, 350)">
            <circle r={isHighlighted ? 27 : 23} fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <text y="-5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              عبد الله
            </text>
            <text y="9" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.85" style={{ fontFamily: 'var(--font-amiri), serif' }}>
              {isArabic ? 'والد النبي' : 'Abdullah'}
            </text>
          </g>

          {/* ========================================================
              3. APEX CROWN: محمد ﷺ (Generation 1) — Top Center
              Illuminated with radiant concentric rosettes and calligraphic honorifics
              ======================================================== */}
          <g transform="translate(720, 65)">
            {/* Ambient Radial Golden Aura */}
            <circle r="70" fill="url(#apexGlow)" />
            {/* Outer 12-pointed Star Rosette */}
            <circle r={isHighlighted ? 44 : 38} fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" filter={isHighlighted ? 'url(#goldGlow)' : undefined} />
            <circle r={isHighlighted ? 36 : 30} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle r={isHighlighted ? 28 : 24} fill="currentColor" fillOpacity="0.12" />

            <text
              y="-4"
              textAnchor="middle"
              fontSize="17"
              fontWeight="bold"
              fill="currentColor"
              style={{ fontFamily: 'var(--font-amiri), serif' }}
            >
              محمد ﷺ
            </text>
            <text
              y="13"
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill="currentColor"
              fillOpacity="0.9"
              style={{ fontFamily: 'var(--font-amiri), serif' }}
            >
              {isArabic ? 'سيد المرسلين' : 'The Chosen'}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
