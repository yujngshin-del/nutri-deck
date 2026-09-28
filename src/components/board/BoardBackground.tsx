const motifs = [
  { top: "7px", left: "7%" },
  { top: "7px", left: "22%" },
  { top: "7px", left: "38%" },
  { top: "7px", right: "38%" },
  { top: "7px", right: "22%" },
  { top: "7px", right: "7%" },
  { bottom: "7px", left: "7%" },
  { bottom: "7px", left: "24%" },
  { bottom: "7px", left: "42%" },
  { bottom: "7px", right: "42%" },
  { bottom: "7px", right: "24%" },
  { bottom: "7px", right: "7%" },
  { top: "28%", left: "7px" },
  { top: "52%", left: "7px" },
  { top: "28%", right: "7px" },
  { top: "52%", right: "7px" },
];

export function BoardFrame() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {motifs.map((spot, index) => (
        <span key={`${spot.top ?? spot.bottom}-${index}`} className="absolute text-[#8a5a2b]/70" style={spot}>
          <Motif index={index} />
        </span>
      ))}
    </div>
  );
}

export function BoardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="board-paper-grain absolute inset-0 rounded-[22px]" />
      <div className="absolute inset-[10px] rounded-[16px] shadow-[inset_0_0_0_1px_rgba(166,116,58,0.28)]" />
    </div>
  );
}

function Motif({ index }: { index: number }) {
  const kind = index % 4;
  if (kind === 0) {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
        <circle cx="8" cy="9" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5c.4-2 2-2.4 2.6-2" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
        <path d="M8 13c-2-2-3-4-2-7 3 1 5 3 5 6 0 1.2-1.2 2-3 1z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
        <ellipse cx="8" cy="9" rx="5" ry="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 9h6" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
      <path d="M4 12c2-5 6-6 8-8-2 3-3 5-4 8H4z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
