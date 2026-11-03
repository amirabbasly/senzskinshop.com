const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
};

const Svg = ({ children, className = 'h-5 w-5', ...rest }) => (
  <svg {...base} className={className} {...rest}>
    {children}
  </svg>
);

export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);
export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);
export const ArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
);
export const ArrowUpLeft = (p) => (
  <Svg {...p}>
    <path d="M17 17 7 7" />
    <path d="M7 17V7h10" />
  </Svg>
);
export const Search = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
);
export const ShoppingBag = (p) => (
  <Svg {...p}>
    <path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z" />
    <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
  </Svg>
);
export const User = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.5 3.6-5.4 7-5.4s6.2 1.9 7 5.4" />
  </Svg>
);
export const Phone = (p) => (
  <Svg {...p}>
    <path d="M6.5 3.5h3l1.2 4-2 1.3a11.5 11.5 0 0 0 5.5 5.5l1.3-2 4 1.2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  </Svg>
);
export const Mail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);
export const MapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);
export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
);
export const Instagram = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none" />
  </Svg>
);
export const Telegram = (p) => (
  <Svg {...p}>
    <path d="m21 4-3 16-5.5-4.5L9 19l-.5-4.5L21 4Z" />
    <path d="M21 4 8.5 14.5" />
  </Svg>
);
export const Whatsapp = (p) => (
  <Svg {...p}>
    <path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.7Z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.5-1-1 .8a5 5 0 0 1-2.3-2.3l.8-1L10.5 9c-.5 0-1.5.1-1.5.5Z" />
  </Svg>
);
export const Star = ({ filled = true, ...p }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.6Z" />
  </Svg>
);
export const Truck = (p) => (
  <Svg {...p}>
    <path d="M3 7h10v9H3z" />
    <path d="M13 10h4l3 3v3h-7z" />
    <circle cx="6.5" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </Svg>
);
export const ShieldCheck = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);
export const Headset = (p) => (
  <Svg {...p}>
    <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
    <rect x="3" y="13" width="3.5" height="6" rx="1.6" />
    <rect x="17.5" y="13" width="3.5" height="6" rx="1.6" />
    <path d="M19 19a3 3 0 0 1-3 2h-2" />
  </Svg>
);
export const RefreshCw = (p) => (
  <Svg {...p}>
    <path d="M20 11a8 8 0 0 0-13.7-4.6L4 8.7" />
    <path d="M4 4v5h5" />
    <path d="M4 13a8 8 0 0 0 13.7 4.6L20 15.3" />
    <path d="M20 20v-5h-5" />
  </Svg>
);
export const Trash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5h6v2" />
    <path d="M6.5 7 7.5 20h9L17.5 7" />
    <path d="M10.5 11v5.5M13.5 11v5.5" />
  </Svg>
);
export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);
export const X = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const Sliders = (p) => (
  <Svg {...p}>
    <path d="M5 6h14M5 12h14M5 18h14" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="8" cy="18" r="2" />
  </Svg>
);
export const Package = (p) => (
  <Svg {...p}>
    <path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" />
    <path d="M4 7.2 12 11l8-3.8M12 21v-10" />
  </Svg>
);
export const Tag = (p) => (
  <Svg {...p}>
    <path d="M20 12.5 12.5 20 4 11.5V4h7.5L20 12.5Z" />
    <circle cx="8" cy="8" r="1.4" />
  </Svg>
);
export const LogOut = (p) => (
  <Svg {...p}>
    <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" />
    <path d="M11 8l-4 4 4 4M7 12h10" />
  </Svg>
);
export const LayoutDashboard = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
  </Svg>
);
export const Home = (p) => (
  <Svg {...p}>
    <path d="M3.5 10.5 12 3.8l8.5 6.7V20a.8.8 0 0 1-.8.8h-4.4v-6.3H8.7v6.3H4.3a.8.8 0 0 1-.8-.8v-9.5Z" />
  </Svg>
);
export const Grid = (p) => (
  <Svg {...p}>
    <path d="M4 9h16M4 15h16M9 4v16M15 4v16" />
  </Svg>
);
export const Settings = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 8.9 19a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3.7 8.9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8.3a1.7 1.7 0 0 0 1-1.6V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </Svg>
);
export const Pencil = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L20 8l-4-4L4 16v4Z" />
    <path d="m14.5 5.5 4 4" />
  </Svg>
);
export const Upload = (p) => (
  <Svg {...p}>
    <path d="M12 16V4m0 0L7 9m5-5 5 5" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </Svg>
);
export const ImageIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.8" />
    <path d="m4.5 17 5-4.5 4 3.5 2.5-2 3.5 3" />
  </Svg>
);
export const Heart = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3Z" />
  </Svg>
);
export const CreditCard = (p) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2.5" />
    <path d="M3 10h18M6.5 14.5h3" />
  </Svg>
);
export const Sparkles = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
    <path d="M18.5 16.5 19.2 18l1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7.7-1.5Z" />
  </Svg>
);
export const Leaf = (p) => (
  <Svg {...p}>
    <path d="M5 19c0-8 5-13 15-13 0 10-5 15-13 15H5v-2Z" />
    <path d="M9 15c2-3 4.5-5 8-6.5" />
  </Svg>
);
export const Droplet = (p) => (
  <Svg {...p}>
    <path d="M12 3.5s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5Z" />
  </Svg>
);
export const Loader = (p) => (
  <Svg {...p}>
    <path d="M12 3v3M12 18v3M4.2 7.2l2.1 2.1M17.7 14.7l2.1 2.1M3 12h3M18 12h3M4.2 16.8l2.1-2.1M17.7 9.3l2.1-2.1" />
  </Svg>
);
export const Ticket = (p) => (
  <Svg {...p}>
    <path d="M3 9V6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5V9a3 3 0 0 0 0 6v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V15a3 3 0 0 0 0-6Z" />
    <path d="M9 9v6" strokeDasharray="2 2" />
  </Svg>
);

export const Share2 = (p) => (
  <Svg {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="17.5" cy="6" r="2.5" />
    <circle cx="17.5" cy="18" r="2.5" />
    <path d="m8.3 10.8 6.9-3.6M8.3 13.2l6.9 3.6" />
  </Svg>
);

export const Users = (p) => (
  <Svg {...p}>
    <circle cx="9.5" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.7-3.1 3-4.8 6-4.8s5.3 1.7 6 4.8" />
    <path d="M16 5.6a3 3 0 0 1 0 5.8M17.5 14.9c2 .6 3.3 2.2 3.8 4.6" />
  </Svg>
);
