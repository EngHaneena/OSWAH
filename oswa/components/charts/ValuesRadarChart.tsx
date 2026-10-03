'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

interface ValuesRadarChartProps {
  values?: number[];
  className?: string;
}

export default function ValuesRadarChart({
  values = [88, 92, 78, 86, 84],
  className = '',
}: ValuesRadarChartProps) {
  const { t, locale, isArabic } = useTranslation();

  const labels = isArabic
    ? ['الحكمة والتروي', 'الصبر والمرونة', 'الحزم والعدل', 'الاحتواء والتعاطف', 'التشاور والمشاركة']
    : ['Wisdom & Prudence', 'Patience & Agility', 'Firmness & Justice', 'Empathy & Inclusion', 'Consultation (Shura)'];

  const size = 320;
  const center = size / 2;
  const radius = 100;
  const total = labels.length;

  // Compute coordinate for an angle and radius
  const getCoordinates = (index: number, val: number) => {
    // Start from top (-PI/2)
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric polygon grid points
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map((level) => {
    return Array.from({ length: total })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // Data polygon points
  const dataPoints = values.map((val, i) => getCoordinates(i, Math.min(100, Math.max(10, val))));
  const polygonPointsStr = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`flex flex-col items-center p-4 bg-[var(--color-surface)]/70 dark:bg-black/30 rounded-2xl border border-[var(--color-gold)]/25 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--color-gold)] text-sm">📊</span>
        <h4 className="text-sm font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)]">
          {t('radar.title')}
        </h4>
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[320px] h-auto overflow-visible select-none"
        role="img"
        aria-label={t('radar.title')}
      >
        <defs>
          {/* Theme Radar Gradient */}
          <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3F5233" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#B89B5E" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill="none"
            stroke="var(--color-gold)"
            strokeOpacity={0.25}
            strokeWidth="1"
            strokeDasharray={idx === gridLevels.length - 1 ? undefined : '2 3'}
          />
        ))}

        {/* Radial Axes */}
        {Array.from({ length: total }).map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--color-gold)"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Value Polygon */}
        <polygon
          points={polygonPointsStr}
          fill="url(#radarFillGrad)"
          stroke="#3F5233"
          className="dark:stroke-[#8da879]"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data Points (Dots & Value Tooltip) */}
        {dataPoints.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#B89B5E"
              stroke="#FFF"
              strokeWidth="1.5"
              className="transition-transform group-hover:scale-150"
            />
            {/* Value badge on node */}
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="text-[9px] font-bold fill-[var(--color-ink)] dark:fill-white opacity-80 group-hover:opacity-100"
            >
              {values[idx]}%
            </text>
          </g>
        ))}

        {/* Outer Axis Labels */}
        {labels.map((label, idx) => {
          const { x, y } = getCoordinates(idx, 122);
          const isTop = y < center - 40;
          const isBottom = y > center + 40;

          return (
            <text
              key={idx}
              x={x}
              y={y + (isTop ? -4 : isBottom ? 8 : 4)}
              textAnchor="middle"
              className="text-[10px] sm:text-[11px] font-semibold fill-[var(--color-ink)] dark:fill-[#e4ddcc]"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
