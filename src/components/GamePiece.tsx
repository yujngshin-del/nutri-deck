export function GamePiece({
  playerId,
  color,
  active,
  label,
  size = "board",
}: {
  playerId: number;
  color: string;
  active: boolean;
  label: string;
  size?: "board" | "rail" | "card";
}) {
  const frame = size === "card" ? "h-24 w-16" : size === "rail" ? "h-11 w-9" : "h-[58px] w-11";
  return (
    <span className={`grid justify-items-center ${frame}`} aria-hidden>
      <svg viewBox="0 0 72 92" className="h-full w-full">
        <ellipse cx="36" cy="84" rx="16" ry="4.5" fill="rgba(48,32,12,0.28)" />
        <ellipse cx="36" cy="80" rx="13" ry="4.2" fill={color} stroke={active ? "#f6d36b" : "transparent"} strokeWidth="1.8" />
        <ellipse cx="36" cy="78.6" rx="9" ry="2.2" fill="#fff" opacity="0.35" />
        <text x="36" y="81.2" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#fff">
          {label}
        </text>
        {playerId === 1 && <Chef color={color} />}
        {playerId === 2 && <Explorer color={color} />}
        {playerId === 3 && <Doctor color={color} />}
        {(playerId < 1 || playerId > 4) && <Chef color={color} />}
        {playerId === 4 && <FruitFriend color={color} />}
      </svg>
    </span>
  );
}

function Chef({ color }: { color: string }) {
  return (
    <g>
      <path d="M24 48h24l-2 22H26z" fill="#fffaf2" stroke="#d7c4a4" strokeWidth="1" />
      <path d="M26 56h20v14H26z" fill={color} />
      <circle cx="36" cy="36" r="9" fill="#f3c7a2" />
      <path d="M22 30c1-9 8-14 14-14s13 5 14 14c-4-3-7-1-9 2-2-4-6-5-9-3-3-3-6-3-10 1z" fill="#fff" />
      <path d="M27 28h18v3H27z" fill="#f4f1ea" />
      <circle cx="32.5" cy="36" r="1.1" fill="#3f342c" />
      <circle cx="39.5" cy="36" r="1.1" fill="#3f342c" />
      <path d="M33 40h6" stroke="#c47b62" strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

function Explorer({ color }: { color: string }) {
  return (
    <g>
      <path d="M24 50h24l-1 20H25z" fill={color} />
      <path d="M28 58h6l1 12h-8z" fill="#f6e7c1" />
      <circle cx="36" cy="38" r="8.5" fill="#e7b48a" />
      <path d="M16 34h40l-3 5H19z" fill="#f4d35e" />
      <path d="M24 24h24l-3 8H27z" fill="#e0b12e" />
      <path d="M46 48c6 1 10 4 12 8" stroke="#3f342c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="38" r="1.1" fill="#3f342c" />
      <circle cx="40" cy="38" r="1.1" fill="#3f342c" />
      <path d="M32 42c2 2 6 2 8 0" stroke="#c47b62" strokeWidth="1.1" fill="none" />
    </g>
  );
}

function Doctor({ color }: { color: string }) {
  return (
    <g>
      <path d="M22 48h28l-2 22H24z" fill="#f8fafc" stroke="#d5dde8" strokeWidth="1" />
      <path d="M34 50h4v16h-4z" fill={color} />
      <circle cx="36" cy="35" r="9" fill="#f3c7a2" />
      <path d="M24 30c2-8 7-11 12-11s10 3 12 11c-5 2-19 2-24 0z" fill="#2b241c" />
      <circle cx="32" cy="36" r="2.5" fill="none" stroke="#1e293b" strokeWidth="1.2" />
      <circle cx="40" cy="36" r="2.5" fill="none" stroke="#1e293b" strokeWidth="1.2" />
      <path d="M34.4 36h3.2" stroke="#1e293b" strokeWidth="1.2" />
      <rect x="46" y="52" width="8" height="10" rx="1.2" fill="#fff" stroke={color} strokeWidth="1" />
      <path d="M48 55h4M50 53v4" stroke={color} strokeWidth="1" />
    </g>
  );
}

function FruitFriend({ color }: { color: string }) {
  return (
    <g>
      <path d="M27 58h18l-2 12H29z" fill="#fffaf2" stroke="#d7c4a4" strokeWidth="1" />
      <path d="M30 62h12v8H30z" fill={color} />
      <circle cx="36" cy="40" r="13" fill={color} />
      <path d="M36 24c1.4 3.2 1 5.2-.2 7" stroke="#3f6212" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="43" cy="23" rx="6" ry="3" fill="#65a30d" transform="rotate(28 43 23)" />
      <circle cx="31.5" cy="39" r="1.3" fill="#3f342c" />
      <circle cx="40.5" cy="39" r="1.3" fill="#3f342c" />
      <path d="M32 45c2 1.8 6 1.8 8 0" stroke="#7c2d12" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="29" cy="36" rx="2.2" ry="1.2" fill="#fff" opacity="0.45" />
    </g>
  );
}
