const foods = [
  { name: "오렌지", x: 35, y: 31 },
  { name: "브로콜리", x: 50, y: 32 },
  { name: "베리", x: 70, y: 36 },
  { name: "토마토", x: 30, y: 45 },
  { name: "영양소", x: 70, y: 45 },
  { name: "접시", x: 29, y: 56 },
  { name: "레몬", x: 71, y: 56 },
  { name: "포도", x: 35, y: 70 },
  { name: "수박", x: 50, y: 73 },
  { name: "당근", x: 65, y: 70 },
] as const;

const foodTone: Record<(typeof foods)[number]["name"], string> = {
  오렌지: "#ffe3c2",
  브로콜리: "#d9f5e3",
  베리: "#ebe4ff",
  토마토: "#ffe0db",
  영양소: "#e7f0ff",
  접시: "#fff6e8",
  레몬: "#fff3c4",
  포도: "#f3e8ff",
  수박: "#e5f8ea",
  당근: "#ffe6cc",
};

export function BoardCenter() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden>
      <div className="absolute left-[26%] top-[26%] h-[50%] w-[48%] rounded-[28px] bg-[#f6ead4]/90 shadow-[inset_0_0_0_1px_rgba(196,148,86,0.28)]" />
      {foods.map((food) => (
        <span
          key={food.name}
          className="absolute grid aspect-square w-[4.8%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_3px_0_rgba(160,120,70,0.18)]"
          style={{ left: `${food.x}%`, top: `${food.y}%`, background: foodTone[food.name] }}
        >
          <FoodIcon name={food.name} />
        </span>
      ))}
      <div className="absolute left-1/2 top-[50%] w-[172px] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="rounded-[18px] border border-[#ead7b4] bg-[#fffaf2] px-2.5 py-2.5 shadow-[0_8px_16px_rgba(92,64,28,0.08)]">
          <div className="mx-auto mb-1 flex items-end justify-center gap-2">
            <MiniIcon kind="note" />
            <MiniIcon kind="plate" />
            <MiniIcon kind="apple" />
          </div>
          <p className="text-[11px] font-black tracking-[0.16em] text-[#1f9d55]">NUTRI-DECK</p>
          <p className="mt-1 text-[11px] font-black leading-4 text-[#3f342c]">
            <span className="block">배운 영양정보로</span>
            <span className="block whitespace-nowrap">먼저 GOAL에 도착하세요!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function FoodIcon({ name }: { name: (typeof foods)[number]["name"] }) {
  return (
    <svg viewBox="0 0 32 32" className="h-[88%] w-[88%]">
      {name === "토마토" && (
        <>
          <circle cx="16" cy="18" r="8" fill="#e85d4c" />
          <path d="M16 10c1-3 4-3 5-2" stroke="#3f6212" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <ellipse cx="20" cy="9" rx="3" ry="1.4" fill="#65a30d" transform="rotate(24 20 9)" />
        </>
      )}
      {name === "오렌지" && (
        <>
          <circle cx="16" cy="17" r="8" fill="#f08a24" />
          <path d="M16 9v16M10 17h12" stroke="#fff3e0" strokeWidth="1" opacity="0.7" />
        </>
      )}
      {name === "브로콜리" && (
        <>
          <path d="M16 28v-8" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="14" r="4" fill="#3c9a62" />
          <circle cx="20" cy="14" r="4" fill="#2f8a52" />
          <circle cx="16" cy="11" r="4.2" fill="#49b072" />
        </>
      )}
      {name === "베리" && (
        <>
          <circle cx="12" cy="16" r="3.2" fill="#5b4cdb" />
          <circle cx="18" cy="14" r="3.4" fill="#7c4ddb" />
          <circle cx="16" cy="20" r="3.2" fill="#6d3ec4" />
          <path d="M18 10c1-2 3-2 3.2-1" stroke="#3f6212" strokeWidth="1" fill="none" />
        </>
      )}
      {name === "레몬" && (
        <ellipse cx="16" cy="17" rx="9" ry="6.5" fill="#f0c429" transform="rotate(-20 16 17)" />
      )}
      {name === "수박" && (
        <>
          <path d="M7 18a9 9 0 0 0 18 0z" fill="#3c9a62" />
          <path d="M9 18a7 7 0 0 0 14 0z" fill="#f25f6a" />
          <circle cx="13" cy="21" r="0.7" fill="#3f342c" />
          <circle cx="17" cy="22" r="0.7" fill="#3f342c" />
        </>
      )}
      {name === "당근" && (
        <>
          <path d="M16 12c4 4 5 10 0 16-5-6-4-12 0-16z" fill="#f08a24" />
          <path d="M13 11c2-4 3-4 4 0M17 10c1-3 3-3 3 0" stroke="#3c9a62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </>
      )}
      {name === "포도" && (
        <>
          <circle cx="13" cy="16" r="2.6" fill="#7c3aed" />
          <circle cx="18" cy="16" r="2.6" fill="#8b5cf6" />
          <circle cx="15.5" cy="20" r="2.6" fill="#6d28d9" />
          <path d="M16 12c1-3 3-3 4-1" stroke="#3f6212" strokeWidth="1.2" fill="none" />
        </>
      )}
      {name === "접시" && (
        <>
          <ellipse cx="16" cy="19" rx="9" ry="5" fill="#fff" stroke="#d7c09a" strokeWidth="1.4" />
          <ellipse cx="16" cy="18" rx="5" ry="2.6" fill="#f7efe2" />
          <path d="M23 10c1.2 2 .6 4-.6 5" stroke="#8a6a3b" strokeWidth="1.2" fill="none" />
        </>
      )}
      {name === "영양소" && (
        <>
          <circle cx="16" cy="10" r="3" fill="#2f6fed" />
          <circle cx="9" cy="22" r="3" fill="#1f9d55" />
          <circle cx="23" cy="22" r="3" fill="#e85d4c" />
          <path d="M16 13 10 19M16 13l6 6M12 22h8" stroke="#8a6a3b" strokeWidth="1.1" />
        </>
      )}
    </svg>
  );
}

function MiniIcon({ kind }: { kind: "note" | "plate" | "apple" }) {
  if (kind === "note") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <rect x="5" y="3" width="12" height="18" rx="2" fill="#fff" stroke="#c4a574" />
        <path d="M8 9h6M8 13h6" stroke="#8a6a3b" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "plate") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <ellipse cx="12" cy="14" rx="8" ry="4" fill="#fff" stroke="#c4a574" />
        <path d="M18 6c1 2 .6 4-.4 5" stroke="#8a6a3b" fill="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <circle cx="12" cy="14" r="6" fill="#e85d4c" />
      <path d="M12 8c1-2 3-2 3.5-1.4" stroke="#3f6212" fill="none" />
    </svg>
  );
}
