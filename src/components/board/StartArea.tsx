import { pointPercent, spaceByPosition } from "../../game/boardLayout";
import { cx } from "../../utils/format";

export function StartArea({ hot }: { hot: boolean }) {
  const point = pointPercent(spaceByPosition(0));
  return (
    <div
      className={cx(
        "absolute z-[12] w-[68px] -translate-x-1/2 -translate-y-1/2",
        hot && "drop-shadow-[0_0_10px_rgba(31,157,85,0.35)]",
      )}
      style={{ left: `calc(${point.x}% + 84px)`, top: `calc(${point.y}% - 1%)` }}
    >
      <svg viewBox="0 0 92 78" className="h-auto w-full" aria-hidden>
        <path d="M28 46v26" stroke="#8a6236" strokeWidth="3" strokeLinecap="round" />
        <path d="M64 46v26" stroke="#8a6236" strokeWidth="3" strokeLinecap="round" />
        <rect x="8" y="8" width="76" height="40" rx="6" fill="#f7f1e6" stroke="#8a6236" strokeWidth="3" />
        <rect x="14" y="14" width="64" height="28" rx="3" fill="#fffaf2" stroke="#d7c09a" />
      </svg>
      <span className="absolute left-1/2 top-[18%] -translate-x-1/2 text-[clamp(8px,1vw,12px)] font-black tracking-[0.14em] text-[#6b5132]">
        START
      </span>
    </div>
  );
}
