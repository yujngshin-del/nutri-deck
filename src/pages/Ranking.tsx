import { Link } from "react-router-dom";
import { SimplePage } from "../components/SimplePage";
import { useGame } from "../context/GameContext";
import type { MatchRecord } from "../types";
import { formatPlayedAt } from "../utils/format";

interface RankingRow {
  key: string;
  name: string;
  totalScore: number;
  position: number;
  reachedGoal: boolean;
  playedAt: string;
  playerCount: number;
  gameNumber: number;
}

function bestInMatch(match: MatchRecord) {
  return [...match.players].sort(
    (left, right) => right.totalScore - left.totalScore || right.position - left.position || left.id - right.id,
  )[0];
}

function rankingRows(matches: MatchRecord[]): RankingRow[] {
  const oldestFirst = [...matches].reverse();
  return oldestFirst
    .map((match, index) => {
      const best = bestInMatch(match);
      return {
        key: match.id,
        name: best?.name ?? match.winnerName,
        totalScore: best?.totalScore ?? 0,
        position: best?.position ?? 0,
        reachedGoal: best?.reachedGoal ?? false,
        playedAt: match.playedAt,
        playerCount: match.players.length,
        gameNumber: index + 1,
      };
    })
    .sort(
      (left, right) =>
        right.totalScore - left.totalScore ||
        right.position - left.position ||
        right.playedAt.localeCompare(left.playedAt),
    );
}

export function Ranking() {
  const { matches } = useGame();
  const rows = rankingRows(matches);

  return (
    <SimplePage title="랭킹">
      <h1 className="text-3xl font-black">랭킹</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        각 판에서 가장 높은 점수를 받은 기록만 올립니다. 그 기록들을 점수순으로 보여 주며, 점수는 합산하지 않습니다.
        이 기기에만 남는 기록입니다.
      </p>
      {rows.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="font-bold">아직 시연 기록이 없습니다.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-[#2fbe78] px-5 py-2 text-sm font-bold text-white">
            게임 시작하기
          </Link>
        </div>
      ) : (
        <ol className="mt-6 space-y-2">
          {rows.map((row, index) => (
            <li key={row.key} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="min-w-0">
                <span className="font-extrabold">
                  <span className="mr-2 text-brand">{index + 1}위</span>
                  {row.name}
                </span>
                <span className="mt-1 block text-xs font-semibold text-neutral-500">
                  {row.gameNumber}판 · {formatPlayedAt(row.playedAt)} · {row.playerCount}명
                </span>
              </span>
              <span className="shrink-0 text-right text-sm font-bold text-neutral-700">
                {row.totalScore}점
                <span className="mt-1 block text-xs font-semibold text-neutral-500">
                  {row.reachedGoal ? "GOAL" : `${row.position}칸`}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </SimplePage>
  );
}
