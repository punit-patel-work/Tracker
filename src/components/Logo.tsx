export interface LogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  variant?: 'mark' | 'full' | 'glyph';
  className?: string;
  showSub?: boolean;
}
const SIZE_MAP = { sm: 28, md: 36, lg: 52 };
export function LogoGlyph({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M8 12h8M5 8v8M8 6v12M16 6v12M19 8v8M3 12h2M19 12h2" />
  </svg>;
}
export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return <span className={`logo-mark-svg ${className}`} style={{ width: size, height: size }}><LogoGlyph size={size * 0.65} /></span>;
}
export function Logo({ size = 'md', variant = 'full', className = '', showSub = true }: LogoProps) {
  const pixels = typeof size === 'number' ? size : SIZE_MAP[size];
  if (variant === 'glyph') return <LogoGlyph size={pixels} className={className} />;
  if (variant === 'mark') return <LogoMark size={pixels} className={className} />;
  return <div className={`brand-lockup ${className}`}><LogoMark size={pixels} /><div className="brand-text">
    <span className="brand-title">Gym Tracker</span>{showSub && <span className="brand-sub">Your training journal</span>}
  </div></div>;
}
export default Logo;
