/**
 * مكون زخرفة هندسية إسلامية — SVG خفيفة
 * تُستخدم كفواصل وإطارات وخلفية (5–8% شفافية)
 */
export function IslamicBorder({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto opacity-[0.07] ${className}`}
      fill="none"
    >
      <pattern id="geo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon
          points="20,2 38,11 38,29 20,38 2,29 2,11"
          stroke="#B89B5E"
          strokeWidth="1"
        />
        <line x1="20" y1="2" x2="20" y2="38" stroke="#B89B5E" strokeWidth="0.5" opacity="0.5" />
        <line x1="2" y1="20" x2="38" y2="20" stroke="#B89B5E" strokeWidth="0.5" opacity="0.5" />
      </pattern>
      <rect width="200" height="40" fill="url(#geo)" />
    </svg>
  );
}

export function IslamicDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 my-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#B89B5E] opacity-40" />
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <polygon points="10,1 19,5.5 19,14.5 10,19 1,14.5 1,5.5" stroke="#B89B5E" strokeWidth="1" />
        <circle cx="10" cy="10" r="2" fill="#B89B5E" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#B89B5E] opacity-40" />
    </div>
  );
}

export function ProphetGlow({ className = '' }: { className?: string }) {
  /**
   * رمز النبي ﷺ — نور مشرق فقط
   * لا يُرسم أي شكل بشري أو ظل أو ملامح وجه
   */
  return (
    <svg
      aria-label="نور مشرق"
      role="img"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-prophet-glow ${className}`}
      fill="none"
      data-no-human-form="true"
    >
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE082" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#B89B5E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B89B5E" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* توهج ذهبي أبيض هادئ — radial glow فقط */}
      <ellipse cx="100" cy="100" rx="90" ry="90" fill="url(#glowGrad)" />
      <ellipse cx="100" cy="100" rx="50" ry="50" fill="#FFE082" fillOpacity="0.15" />
    </svg>
  );
}

export function VerseFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative px-8 py-6 ${className}`}>
      {/* زوايا زخرفية */}
      <svg aria-hidden="true" className="absolute top-0 right-0 w-12 h-12 text-[#B89B5E] opacity-60" viewBox="0 0 48 48" fill="none">
        <path d="M48 0 L48 24 L24 24 L24 48 L0 48" stroke="#B89B5E" strokeWidth="1.5" fill="none"/>
        <circle cx="48" cy="0" r="3" fill="#B89B5E" fillOpacity="0.5" />
      </svg>
      <svg aria-hidden="true" className="absolute top-0 left-0 w-12 h-12 text-[#B89B5E] opacity-60" viewBox="0 0 48 48" fill="none">
        <path d="M0 0 L0 24 L24 24 L24 48 L48 48" stroke="#B89B5E" strokeWidth="1.5" fill="none"/>
        <circle cx="0" cy="0" r="3" fill="#B89B5E" fillOpacity="0.5" />
      </svg>
      <svg aria-hidden="true" className="absolute bottom-0 right-0 w-12 h-12 text-[#B89B5E] opacity-60" viewBox="0 0 48 48" fill="none">
        <path d="M48 48 L48 24 L24 24 L24 0 L0 0" stroke="#B89B5E" strokeWidth="1.5" fill="none"/>
        <circle cx="48" cy="48" r="3" fill="#B89B5E" fillOpacity="0.5" />
      </svg>
      <svg aria-hidden="true" className="absolute bottom-0 left-0 w-12 h-12 text-[#B89B5E] opacity-60" viewBox="0 0 48 48" fill="none">
        <path d="M0 48 L0 24 L24 24 L24 0 L48 0" stroke="#B89B5E" strokeWidth="1.5" fill="none"/>
        <circle cx="0" cy="48" r="3" fill="#B89B5E" fillOpacity="0.5" />
      </svg>
      {children}
    </div>
  );
}

export function IslamicCardFrame({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative rounded-3xl border border-[var(--color-gold)]/25 ${className}`}>
      <span className="absolute -top-1.5 -start-1.5 text-[var(--color-gold)] text-xs select-none" aria-hidden="true">✦</span>
      <span className="absolute -top-1.5 -end-1.5 text-[var(--color-gold)] text-xs select-none" aria-hidden="true">✦</span>
      <span className="absolute -bottom-1.5 -start-1.5 text-[var(--color-gold)] text-xs select-none" aria-hidden="true">✦</span>
      <span className="absolute -bottom-1.5 -end-1.5 text-[var(--color-gold)] text-xs select-none" aria-hidden="true">✦</span>
      {children}
    </div>
  );
}

