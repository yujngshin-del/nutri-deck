import { Link } from "react-router-dom";
import { SimplePage } from "../components/SimplePage";
import { useGame } from "../context/GameContext";
import { formatPlayedAt } from "../utils/format";

export function MyPage() {
  const { matches, clearMatches } = useGame();

  return (
    <SimplePage title="마이페이지">
      <h1 className="text-3xl font-black">마이페이지</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        로그인 없이, 이 브라우저에 남은 보드게임 기록만 보여 줍니다.
      </p>
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-500">끝난 게임</p>
        <p className="text-4xl font-black text-brand">{matches.length}회</p>
      </section>
      <ul className="mt-4 space-y-2">
        {matches.map((match) => (
          <li key={match.id} className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
            <span className="font-bold">우승 {match.winnerName}</span>
            <span className="mt-1 block text-xs text-neutral-500">
              {formatPlayedAt(match.playedAt)} ·{" "}
              {[...match.players]
                .sort((left, right) => right.position - left.position || left.id - right.id)
                .map((player, index) => `${index + 1}위 ${player.name}`)
                .join(" · ")}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2">
        <Link to="/" className="rounded-full bg-[#2fbe78] px-5 py-3 text-sm font-bold text-white">
          게임 시작하기
        </Link>
        {matches.length > 0 && (
          <button
            type="button"
            onClick={clearMatches}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-bold"
          >
            기록 지우기
          </button>
        )}
      </div>
    </SimplePage>
  );
}
