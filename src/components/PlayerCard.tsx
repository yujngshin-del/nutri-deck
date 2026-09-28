import { TRACK_SPACES } from "../data/missions";
import type { Player } from "../game/boardRules";
import { GamePiece } from "./GamePiece";

export function PlayerCard({ player, active }: { player: Player; active: boolean }) {
  const atGoal = player.position >= TRACK_SPACES;
  return (
    <article
      className="w-[132px] overflow-hidden rounded-[22px] bg-[#fffaf3] text-center shadow-[0_10px_18px_rgba(72,44,16,0.12)] ring-1 ring-[#ead7b4]"
      style={active ? { boxShadow: `0 0 0 3px ${player.color}, 0 10px 18px rgba(72,44,16,0.12)` } : undefined}
    >
      <div className="player-portrait mx-2 mt-2 grid h-28 place-items-end pb-1" style={{ background: `${player.color}22` }}>
        <GamePiece playerId={player.id} color={player.color} active={active} label={String(player.id)} size="card" />
      </div>
      <p className="mt-2 text-sm font-black text-[#3f342c]">{player.name}</p>
      <p className="text-[11px] font-bold text-[#8a6a3b]">{player.role}</p>
      <p className="mb-2 mt-1 text-[11px] font-black text-[#5c4a38]">
        {atGoal ? "GOAL" : `${player.position} / ${TRACK_SPACES}`}
        <span className="mx-1 text-[#c4a574]">·</span>
        {player.totalScore}
      </p>
    </article>
  );
}
