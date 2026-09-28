const chips = [
  { label: "단백질", note: "g", className: "left-[6%] top-[22%] bg-[#e7f8ee] text-[#157a3e]", hide: "hidden md:block" },
  { label: "식이섬유", note: "g", className: "right-[7%] top-[20%] bg-[#e7f3ff] text-[#2457c5]", hide: "hidden md:block" },
  { label: "나트륨", note: "mg", className: "left-[8%] top-[58%] bg-[#fff1e4] text-[#c2410c]", hide: "hidden lg:block" },
  { label: "열량", note: "kcal", className: "right-[9%] top-[62%] bg-[#fff7d6] text-[#a16207]", hide: "hidden lg:block" },
  { label: "비타민", note: "", className: "left-[18%] bottom-[8%] bg-[#f3e8ff] text-[#6d28d9]", hide: "hidden xl:block" },
];

export function HomeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-[#7ddea8]/35 blur-2xl" />
      <div className="absolute right-[-3rem] top-24 h-72 w-72 rounded-full bg-[#ffd19a]/50 blur-2xl" />
      <div className="absolute bottom-10 left-[18%] h-56 w-56 rounded-full bg-[#c7ddff]/45 blur-2xl" />
      <div className="absolute bottom-[-2rem] right-[12%] h-48 w-48 rounded-full bg-[#ffd0d6]/40 blur-2xl" />
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`absolute rounded-full px-3 py-1.5 text-xs font-black shadow-sm ring-1 ring-white/80 ${chip.className} ${chip.hide}`}
        >
          {chip.label}
          {chip.note ? <span className="ml-1 font-bold opacity-70">{chip.note}</span> : null}
        </span>
      ))}
    </div>
  );
}
