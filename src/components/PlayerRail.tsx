import { TRACK_SPACES } from "../data/missions";
import type { Player } from "../game/boardRules";
import { GamePiece } from "./GamePiece";

export function PlayerRail({
  players,
  currentPlayerId,
}: {
  players: Player[];
  currentPlayerId: number | null;
}) {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {players.map((player) => {
        const active = player.id === currentPlayerId;
        const atGoal = player.position >= TRACK_SPACES;
        return (
          <li
            key={player.id}
            className="flex min-w-[168px] items-center gap-2 rounded-2xl bg-[#fffaf3] px-2.5 py-1.5 ring-1 ring-[#eadcc4]"
            style={{
              background: active ? "#fff" : undefined,
              boxShadow: active
                ? `0 0 0 2px ${player.color}, 0 8px 18px rgba(92,64,28,0.1)`
                : "0 8px 18px rgba(92,64,28,0.08)",
            }}
          >
            <GamePiece playerId={player.id} color={player.color} active={active} label={String(player.id)} size="rail" />
            <span className="min-w-0 text-left">
              <span className="flex items-center gap-1.5">
                <span className="text-sm font-black text-[#3f342c]">{player.name}</span>
                {active && (
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-black text-white" style={{ background: player.color }}>
                    차례
                  </span>
                )}
              </span>
              <span className="block text-xs font-bold text-[#8a6a3b]">{player.role}</span>
              <span className="mt-0.5 block text-[11px] font-bold leading-4 text-[#5c4a38]">
                현재 위치 {atGoal ? "GOAL" : `${player.position} / ${TRACK_SPACES}`}
                <span className="mx-1 text-[#a38b6d]">·</span>
                획득 점수 {player.totalScore}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
