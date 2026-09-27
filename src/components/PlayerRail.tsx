import { GOAL_POSITION } from "../data/missions";
import type { Player } from "../game/boardRules";
import { cx } from "../utils/format";

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
        const atGoal = player.position >= GOAL_POSITION;
        return (
          <li
            key={player.id}
            className={cx(
              "flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm",
              active && "ring-2 ring-[#1f9d55]",
            )}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-xs font-black text-white"
              style={{ background: player.color }}
            >
              {player.id}
            </span>
            <span className="text-sm font-extrabold">
              {player.name}
              <span className="ml-1 font-semibold text-neutral-400">{player.role}</span>
            </span>
            <span className="text-xs font-bold text-neutral-500">
              {atGoal ? "GOAL" : `${player.position}/${GOAL_POSITION}`} · {player.totalScore}점
            </span>
          </li>
        );
      })}
    </ul>
  );
}
