import { BOARD_H, BOARD_W, boardSpaces, trackPaths } from "../../game/boardLayout";
import { BoardSpace } from "./BoardSpace";

export function BoardTrack({
  occupiedPositions,
  activePosition,
}: {
  occupiedPositions: number[];
  activePosition: number | null;
}) {
  const occupied = new Set(occupiedPositions);
  return (
    <>
      <svg
        viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        aria-hidden
      >
        <path d={trackPaths.groove} fill="none" stroke="#8d6844" strokeWidth="64" strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />
        <path d={trackPaths.groove} fill="none" stroke="#d7b07a" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" />
        <path d={trackPaths.groove} fill="none" stroke="#e8cfa6" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
        <path d={trackPaths.groove} fill="none" stroke="#f8efdf" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
      </svg>
      {boardSpaces
        .filter((space) => space.type === "normal")
        .map((space) => (
          <BoardSpace
            key={space.position}
            space={space}
            occupied={occupied.has(space.position)}
            active={activePosition === space.position}
          />
        ))}
    </>
  );
}
