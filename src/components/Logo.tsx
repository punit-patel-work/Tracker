export interface LogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  variant?: 'mark' | 'full' | 'glyph';
  className?: string;
  showSub?: boolean;
}

const SIZE_MAP = {
  sm: 28,
  md: 36,
  lg: 52,
};

/**
 * Precision Athletic Brand Mark
 * Combines calibrated barbell plates with an upward progressive-overload peak chevron.
 */
export function LogoMark({
  size = 36,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-mark-svg ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gt-mark-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--logo-bg-start, #141722)" />
          <stop offset="100%" stopColor="var(--logo-bg-end, #090a0f)" />
        </linearGradient>
        <linearGradient id="gt-mark-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary, #00e599)" stopOpacity="0.55" />
          <stop offset="50%" stopColor="var(--primary, #00e599)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary, #00e599)" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="gt-emerald-core" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3af7bd" />
          <stop offset="100%" stopColor="#00d68f" />
        </linearGradient>
      </defs>

      {/* Squircle Chassis */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="24"
        fill="url(#gt-mark-bg)"
        stroke="url(#gt-mark-border)"
        strokeWidth="2.5"
      />

      {/* Subtle top edge specular highlight */}
      <path
        d="M 28 5.5 L 72 5.5"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Left Outer Plate */}
      <rect
        x="14"
        y="34"
        width="6"
        height="32"
        rx="3"
        fill="url(#gt-emerald-core)"
        opacity="0.8"
      />

      {/* Left Inner Plate */}
      <rect
        x="23"
        y="24"
        width="8"
        height="52"
        rx="4"
        fill="url(#gt-emerald-core)"
      />

      {/* Left Barbell Collar */}
      <rect
        x="33"
        y="38"
        width="4"
        height="24"
        rx="2"
        fill="url(#gt-emerald-core)"
        opacity="0.9"
      />

      {/* Central Barbell Shaft */}
      <rect
        x="37"
        y="46"
        width="26"
        height="8"
        rx="4"
        fill="url(#gt-emerald-core)"
      />

      {/* Right Barbell Collar */}
      <rect
        x="63"
        y="38"
        width="4"
        height="24"
        rx="2"
        fill="url(#gt-emerald-core)"
        opacity="0.9"
      />

      {/* Right Inner Plate */}
      <rect
        x="69"
        y="24"
        width="8"
        height="52"
        rx="4"
        fill="url(#gt-emerald-core)"
      />

      {/* Right Outer Plate */}
      <rect
        x="80"
        y="34"
        width="6"
        height="32"
        rx="3"
        fill="url(#gt-emerald-core)"
        opacity="0.8"
      />

      {/* Upward Progressive Overload Peak Chevron */}
      <path
        d="M 38 41 L 50 27 L 62 41"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Standalone Glyph (pure emblem without chassis)
 */
export function LogoGlyph({
  size = 24,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-glyph-svg ${className}`}
      aria-hidden="true"
    >
      <rect x="14" y="34" width="6" height="32" rx="3" fill="currentColor" opacity="0.8" />
      <rect x="23" y="24" width="8" height="52" rx="4" fill="currentColor" />
      <rect x="33" y="38" width="4" height="24" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="37" y="46" width="26" height="8" rx="4" fill="currentColor" />
      <rect x="63" y="38" width="4" height="24" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="69" y="24" width="8" height="52" rx="4" fill="currentColor" />
      <rect x="80" y="34" width="6" height="32" rx="3" fill="currentColor" opacity="0.8" />
      <path
        d="M 38 41 L 50 27 L 62 41"
        stroke="var(--logo-chevron, #ffffff)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full Brand Lockup with Typography
 */
export function Logo({
  size = 'md',
  variant = 'full',
  className = '',
  showSub = true,
}: LogoProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] ?? 36;

  if (variant === 'glyph') {
    return <LogoGlyph size={pixelSize} className={className} />;
  }

  if (variant === 'mark') {
    return <LogoMark size={pixelSize} className={className} />;
  }

  return (
    <div className={`brand-lockup ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 11 }}>
      <LogoMark size={pixelSize} />
      <div className="brand-text">
        <span className="brand-title">
          Gym <span className="brand-accent">Tracker</span>
        </span>
        {showSub && (
          <span className="brand-sub">Strength &amp; cardio log</span>
        )}
      </div>
    </div>
  );
}
export default Logo;
