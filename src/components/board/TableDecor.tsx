export function TableDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <Molecule className="left-[4%] top-[18%] text-[#7c4ddb]" />
      <Molecule className="right-[5%] top-[22%] text-[#2f6fed]" />
      <Molecule className="bottom-[12%] left-[8%] text-[#1f9d55]" />
      <Molecule className="bottom-[16%] right-[7%] text-[#ea7a2f]" />
      <span className="absolute left-[6%] top-[42%] h-3 w-3 rounded-full bg-[#e85d4c]/70" />
      <span className="absolute right-[9%] top-[48%] h-2.5 w-4 rotate-12 rounded-full bg-[#f08a24]/80" />
      <span className="absolute bottom-[28%] left-[3%] h-3 w-3 rounded-full bg-[#65a30d]/70" />
    </div>
  );
}

function Molecule({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 72 72" className={`absolute h-16 w-16 opacity-70 ${className}`}>
      <circle cx="36" cy="18" r="7" fill="currentColor" opacity="0.85" />
      <circle cx="16" cy="48" r="6" fill="currentColor" opacity="0.55" />
      <circle cx="54" cy="50" r="8" fill="currentColor" opacity="0.4" />
      <path d="M32 24 20 43M40 24l12 20M22 48h24" stroke="currentColor" strokeWidth="2" opacity="0.45" />
    </svg>
  );
}
