import type { BoardSpaceDef } from "../../game/boardLayout";
import { pointPercent } from "../../game/boardLayout";
import { cx } from "../../utils/format";

export function BoardSpace({
  space,
  occupied,
  active,
}: {
  space: BoardSpaceDef;
  occupied: boolean;
  active: boolean;
}) {
  const point = pointPercent(space);
  return (
    <div
      className="absolute z-[4] w-[4.7%] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      data-space={space.position}
    >
      <div
        className={cx(
          "board-space grid aspect-square place-items-center rounded-full text-center text-[#6b5132]",
          active && "board-space-active",
          occupied && !active && "board-space-occupied",
        )}
      >
        <span className="text-[clamp(9px,1.05vw,13px)] font-black leading-none">{space.label}</span>
      </div>
    </div>
  );
}
