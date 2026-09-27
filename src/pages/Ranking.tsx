import { Link } from "react-router-dom";
import { SimplePage } from "../components/SimplePage";
import { useGame } from "../context/GameContext";
import { formatPlayedAt } from "../utils/format";

export function Ranking() {
  const { matches } = useGame();

  return (
    <SimplePage title="랭킹">
      <h1 className="text-3xl font-black">랭킹</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        이 브라우저에서 끝난 보드게임의 우승 기록입니다. 이 기기에만 남는 시연 기록입니다.
      </p>
      {matches.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="font-bold">아직 시연 기록이 없습니다.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-[#2fbe78] px-5 py-2 text-sm font-bold text-white">
            게임 시작하기
          </Link>
        </div>
      ) : (
        <ol className="mt-6 space-y-2">
          {matches.map((match, index) => (
            <li key={match.id} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="w-8 text-lg font-black text-brand">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">
                  {match.winnerName}
                  {match.reachedGoal ? " · GOAL" : ""}
                </p>
                <p className="text-xs text-neutral-500">{formatPlayedAt(match.playedAt)}</p>
              </div>
              <p className="text-sm font-bold text-neutral-500">{match.players.length}명</p>
            </li>
          ))}
        </ol>
      )}
    </SimplePage>
  );
}
