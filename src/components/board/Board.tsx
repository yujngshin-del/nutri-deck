import { TRACK_SPACES } from "../../data/missions";
import { pointPercent, spaceByPosition } from "../../game/boardLayout";
import type { Player } from "../../game/boardRules";
import { GamePiece } from "../GamePiece";
import { BoardBackground, BoardFrame } from "./BoardBackground";
import { BoardCenter } from "./BoardCenter";
import { BoardTrack } from "./BoardTrack";
import { GoalArea } from "./GoalArea";
import { StartArea } from "./StartArea";

export function Board({
  players,
  displayPositions,
  currentPlayerId,
  moveLabel,
}: {
  players: Player[];
  displayPositions: Record<number, number>;
  currentPlayerId: number | null;
  moveLabel?: string | null;
}) {
  const positions = players.map((player) => displayPositions[player.id] ?? player.position);
  const activePosition =
    currentPlayerId == null
      ? null
      : (displayPositions[currentPlayerId] ??
        players.find((player) => player.id === currentPlayerId)?.position ??
        null);

  return (
    <section
            className="board-shell relative mx-auto w-[min(100%,820px,calc((100svh-430px)*10/7))]"
      aria-label="Nutri-Deck 보드"
    >
      <div className="board-shadow pointer-events-none absolute -inset-x-6 bottom-1 h-8 rounded-[50%]" aria-hidden />
      <div className="board-wood relative rounded-[32px] p-5 sm:p-6">
        <BoardFrame />
        <div className="board-paper relative aspect-[1000/700] w-full rounded-[26px]">
          <BoardBackground />
          <BoardCenter />
          <BoardTrack occupiedPositions={positions} activePosition={activePosition} />
          <StartArea hot={activePosition === 0} />
          <GoalArea hot={activePosition != null && activePosition >= TRACK_SPACES} />
          {players.map((player) => {
            const position = displayPositions[player.id] ?? player.position;
            const point = pointPercent(spaceByPosition(position));
            const mates = players.filter(
              (other) => (displayPositions[other.id] ?? other.position) === position,
            );
            const slot = mates.findIndex((other) => other.id === player.id);
            const offset = pieceOffset(slot, mates.length);
            const active = player.id === currentPlayerId;
            const scale = offset.scale * (active ? 1.06 : 1);
            return (
              <div
                key={player.id}
                className="board-piece absolute z-[6]"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  zIndex: active ? 8 : 6 + slot,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
                }}
                aria-label={`${player.name} ${player.role} ${position >= TRACK_SPACES ? "GOAL" : `${position}칸`}`}
              >
                <div key={position} className="board-hop">
                  {active && moveLabel && (
                    <span className="board-float absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#fffaf2] px-2 py-0.5 text-[11px] font-black text-[#1f9d55] shadow">
                      {moveLabel}
                    </span>
                  )}
                  <GamePiece playerId={player.id} color={player.color} active={active} label={String(player.id)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function pieceOffset(slot: number, count: number): { x: number; y: number; scale: number } {
  if (count <= 1) return { x: 0, y: -30, scale: 1 };
  if (count === 2) return { x: slot === 0 ? -26 : 26, y: -30, scale: 0.9 };
  if (count === 3) return { x: (slot - 1) * 40, y: -28, scale: 0.78 };
  const column = slot % 2;
  const row = Math.floor(slot / 2);
  return {
    x: column === 0 ? -16 : 16,
    y: row === 0 ? -54 : -30,
    scale: 0.66,
  };
}
