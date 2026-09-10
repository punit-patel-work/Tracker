/** Inline stroke icons — no icon dependency, so the bundle stays at react only. */
import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: Props) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...rest,
  };
}

export const Flame = (p: Props) => (
  <svg {...base(p)}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export const Dumbbell = (p: Props) => (
  <svg {...base(p)}>
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>
);

export const Sliders = (p: Props) => (
  <svg {...base(p)}>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="1" x2="7" y1="14" y2="14" />
    <line x1="9" x2="15" y1="8" y2="8" />
    <line x1="17" x2="23" y1="16" y2="16" />
  </svg>
);

export const History = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export const BarChart = (p: Props) => (
  <svg {...base(p)}>
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

export const User = (p: Props) => (
  <svg {...base(p)}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const LogOut = (p: Props) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

export const Sun = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const Moon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const Plus = (p: Props) => (
  <svg {...base(p)}>
    <path d="M5 12h14M12 5v14" />
  </svg>
);

export const Check = (p: Props) => (
  <svg {...base(p)} strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Trash = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);

export const Search = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const Play = (p: Props) => (
  <svg {...base({ ...p })} fill="currentColor">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

export const Stop = (p: Props) => (
  <svg {...base(p)} fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

export const Calendar = (p: Props) => (
  <svg {...base(p)}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18M8 2v4M16 2v4" />
  </svg>
);

export const Database = (p: Props) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

export const Trophy = (p: Props) => (
  <svg {...base(p)}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export const Activity = (p: Props) => (
  <svg {...base(p)}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const TrendingUp = (p: Props) => (
  <svg {...base(p)}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const Sparkles = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

export const Layers = (p: Props) => (
  <svg {...base(p)}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </svg>
);

export const Pencil = (p: Props) => (
  <svg {...base(p)}>
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

export const Save = (p: Props) => (
  <svg {...base(p)}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export const X = (p: Props) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const Clock = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const HelpCircle = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export const Info = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const Undo = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 7v6h6" />
    <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
  </svg>
);

export const Download = (p: Props) => (
  <svg {...base(p)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

export const Repeat = (p: Props) => (
  <svg {...base(p)}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

export const Star = ({ filled, ...p }: Props & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3Z" />
  </svg>
);

export const ChevronRight = (p: Props) => (
  <svg {...base(p)}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ChevronDown = (p: Props) => (
  <svg {...base(p)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ArrowLeft = (p: Props) => (
  <svg {...base(p)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const Target = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

export const Home = (p: Props) => (
  <svg {...base(p)}>
    <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const Grip = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="9" cy="6" r="1.4" fill="currentColor" />
    <circle cx="15" cy="6" r="1.4" fill="currentColor" />
    <circle cx="9" cy="12" r="1.4" fill="currentColor" />
    <circle cx="15" cy="12" r="1.4" fill="currentColor" />
    <circle cx="9" cy="18" r="1.4" fill="currentColor" />
    <circle cx="15" cy="18" r="1.4" fill="currentColor" />
  </svg>
);

export const Zap = (p: Props) => (
  <svg {...base(p)}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const Scale = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3v18M5 7h14" />
    <path d="M5 7 2 14a3.5 3.5 0 0 0 6 0L5 7ZM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7Z" />
  </svg>
);

export const Timer = (p: Props) => (
  <svg {...base(p)}>
    <path d="M10 2h4M12 14l3-3" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);
