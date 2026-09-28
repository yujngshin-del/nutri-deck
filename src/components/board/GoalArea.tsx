import { GOAL_POSITION } from "../../data/missions";
import { pointPercent, spaceByPosition } from "../../game/boardLayout";
import { cx } from "../../utils/format";

export function GoalArea({ hot }: { hot: boolean }) {
  const point = pointPercent(spaceByPosition(GOAL_POSITION));
  return (
    <div
      className={cx(
        "absolute z-[5] w-[96px] -translate-x-1/2 -translate-y-1/2",
        hot && "drop-shadow-[0_0_12px_rgba(217,159,48,0.45)]",
      )}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <svg viewBox="0 0 120 70" className="h-auto w-full" aria-hidden>
        <path d="M28 66V28" stroke="#8a6236" strokeWidth="4" strokeLinecap="round" />
        <path d="M92 66V28" stroke="#8a6236" strokeWidth="4" strokeLinecap="round" />
        <rect x="10" y="6" width="100" height="36" rx="6" fill="#f7f1e6" stroke="#8a6236" strokeWidth="3" />
        <rect x="16" y="12" width="88" height="24" rx="3" fill="#fffaf2" stroke="#d7c09a" />
      </svg>
      <span className="absolute left-1/2 top-[16%] -translate-x-1/2 text-[clamp(10px,1.15vw,14px)] font-black tracking-[0.16em] text-[#6b5132]">
        GOAL
      </span>
    </div>
  );
}
