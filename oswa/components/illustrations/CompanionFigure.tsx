import { COMPANION_RENDER_MODE } from '@/config/illustration';

interface CompanionFigureProps {
  robeColor?: string;
  headCover?: 'turban' | 'kufiya' | 'hijab';
  heightClass?: 'short' | 'medium' | 'tall';
  className?: string;
  name?: string;
}

/**
 * شخصية الصحابي — من الخلف فقط (بدون وجوه)
 * COMPANION_RENDER_MODE = 'back_only'
 * لا تُرسم أي ملامح وجه أو جسد من الأمام
 */
export function CompanionFigure({
  robeColor = '#3F5233',
  headCover = 'turban',
  heightClass = 'medium',
  className = '',
  name,
}: CompanionFigureProps) {
  // الوضع الحالي: من الخلف فقط
  if (COMPANION_RENDER_MODE !== 'back_only') {
    return null; // لا يُعرض حتى يُحدد الوضع
  }

  const heights: Record<string, number> = { short: 120, medium: 140, tall: 160 };
  const h = heights[heightClass];
  const w = 70;

  const headColors: Record<string, string> = {
    turban: '#D4B97A',
    kufiya: '#F6F1E3',
    hijab: '#B89B5E',
  };

  return (
    <svg
      aria-label={name ? `صورة من الخلف لـ ${name}` : 'صحابي — من الخلف'}
      role="img"
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-render-mode="back_only"
      data-no-face="true"
      data-no-front-body="true"
    >
      {/* رأس — من الخلف فقط */}
      <ellipse
        cx={w / 2}
        cy={18}
        rx={12}
        ry={13}
        fill={headColors[headCover]}
      />
      {/* عمامة */}
      {headCover === 'turban' && (
        <>
          <ellipse cx={w / 2} cy={12} rx={14} ry={6} fill={robeColor} opacity="0.85" />
          <ellipse cx={w / 2} cy={10} rx={10} ry={5} fill={robeColor} opacity="0.7" />
        </>
      )}
      {headCover === 'kufiya' && (
        <rect x={w / 2 - 14} y={4} width={28} height={20} rx={2} fill="#F6F1E3" stroke="#B89B5E" strokeWidth="0.5" />
      )}
      {headCover === 'hijab' && (
        <ellipse cx={w / 2} cy={15} rx={18} ry={14} fill={headColors.hijab} />
      )}
      {/* جسد — من الخلف فقط */}
      <path
        d={`M${w / 2 - 16} 30 Q${w / 2} 28 ${w / 2 + 16} 30 L${w / 2 + 22} ${h} L${w / 2 - 22} ${h} Z`}
        fill={robeColor}
      />
      {/* تأثير الثوب */}
      <path
        d={`M${w / 2} 30 L${w / 2} ${h - 10}`}
        stroke="#22301B"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  );
}
