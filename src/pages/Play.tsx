import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateNutritionByCodes, fetchFoodByCode, postEvaluateMission } from "../api/nutritionApi";
import { BoardTrack } from "../components/BoardTrack";
import { Footer } from "../components/Footer";
import { GameModal } from "../components/GameModal";
import { Header } from "../components/Header";
import { PlayerRail } from "../components/PlayerRail";
import { useGame } from "../context/GameContext";
import {
  GOAL_POSITION,
  STUDY_SECONDS,
  buildLevel3Mission,
  level2Mission,
  missionForRound,
  studyNutrients,
} from "../data/missions";
import {
  beginMove,
  confirmRound,
  createSession,
  finishMove,
  openTurn,
  recordRound,
  stageTitle,
  stageZoneLabel,
  type BoardSession,
} from "../game/boardRules";
import { useCountdown } from "../hooks/useCountdown";
import { bestFoods } from "../utils/missionEvaluator";
import { readBoardSession, writeBoardSession } from "../utils/scoreStore";

interface StartRequest {
  playerCount?: number;
  demoCards?: boolean;
  fresh?: boolean;
}

const modalPhases = new Set(["study", "answer", "roundResult", "sessionResult"]);

export function Play() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordMatch } = useGame();
  const recorded = useRef(false);
  const [session, setSession] = useState<BoardSession | null>(() => {
    const incoming = location.state as StartRequest | null;
    if (incoming?.fresh && incoming.playerCount) {
      return createSession(clampPlayers(incoming.playerCount), Boolean(incoming.demoCards));
    }
    return readBoardSession();
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [displayPositions, setDisplayPositions] = useState<Record<number, number>>({});

  const timeLeft = useCountdown(session?.phase === "study", session?.studyToken ?? 0, STUDY_SECONDS);

  useEffect(() => {
    document.title = "Nutri-Deck 보드";
  }, []);

  useEffect(() => {
    if (!session) {
      navigate("/", { replace: true });
      return;
    }
    writeBoardSession(session);
  }, [session, navigate]);

  useEffect(() => {
    if (!session || session.phase !== "study" || timeLeft !== 0) return;
    setSession((current) =>
      current && current.phase === "study" ? { ...current, phase: "answer" } : current,
    );
  }, [session, timeLeft]);

  useEffect(() => {
    if (session?.phase === "answer" || session?.phase === "study" || session?.phase === "board") {
      setSelected([]);
    }
  }, [session?.phase, session?.currentPlayerIndex, session?.round, session?.stage]);

  useEffect(() => {
    if (!session) return;
    const finals = Object.fromEntries(session.players.map((player) => [player.id, player.position]));
    const feedback = session.feedback;
    const player = session.players[session.currentPlayerIndex];
    if (session.phase !== "moving" || !feedback || !player) {
      setDisplayPositions(finals);
      return;
    }

    if (feedback.steps === 0) {
      setDisplayPositions(finals);
      const timer = window.setTimeout(() => {
        setSession((current) => (current?.phase === "moving" ? finishMove(current) : current));
      }, 700);
      return () => window.clearTimeout(timer);
    }

    const from = player.position - feedback.steps;
    let step = 0;
    setDisplayPositions({ ...finals, [player.id]: from });
    const timer = window.setInterval(() => {
      step += 1;
      setDisplayPositions({ ...finals, [player.id]: from + step });
      if (step >= feedback.steps) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setSession((current) => (current?.phase === "moving" ? finishMove(current) : current));
        }, 280);
      }
    }, 560);
    return () => window.clearInterval(timer);
  }, [session]);

  useEffect(() => {
    if (!session || session.phase !== "done" || !session.winnerId || recorded.current) return;
    const winner = session.players.find((player) => player.id === session.winnerId);
    if (!winner) return;
    recorded.current = true;
    recordMatch({
      id: String(session.startedAt),
      playedAt: new Date().toISOString(),
      winnerName: winner.name,
      reachedGoal: winner.position >= GOAL_POSITION,
      players: session.players.map((player) => ({
        name: player.name,
        position: player.position,
        totalScore: player.totalScore,
        reachedGoal: player.position >= GOAL_POSITION,
      })),
    });
  }, [session, recordMatch]);

  if (!session) return null;

  const current = session.players[session.currentPlayerIndex] ?? session.players[0];
  const modalOpen = modalPhases.has(session.phase);

  function toggle(foodCode: string) {
    if (session?.phase !== "answer") return;
    if (session.stage === "level1") {
      setSelected([foodCode]);
      return;
    }
    setSelected((codes) =>
      codes.includes(foodCode) ? codes.filter((code) => code !== foodCode) : [...codes, foodCode],
    );
  }

  async function submit() {
    if (!session || session.phase !== "answer" || selected.length === 0 || busy) return;
    setBusy(true);
    try {
      if (session.stage === "level1") {
        const mission = missionForRound(session.round);
        const food = await fetchFoodByCode(selected[0] ?? "");
        const judgement = await postEvaluateMission({
          kind: "level1",
          selected: food,
          dealt: session.foods,
          mission,
        });
        const answerNames = bestFoods(session.foods, mission).map((item) => item.food_name);
        setSession((currentSession) =>
          currentSession
            ? recordRound(
                currentSession,
                judgement.points,
                {
                  headline: judgement.headline,
                  detail: judgement.detail,
                  answerNames,
                  conditions: judgement.conditions,
                  totals: null,
                },
                studyNutrients[session.round - 1]?.label ?? "영양소",
              )
            : currentSession,
        );
        return;
      }

      const calculated = await calculateNutritionByCodes(selected);
      if (session.stage === "level2") {
        const judgement = await postEvaluateMission({
          kind: "level2",
          totals: calculated.totals,
          mission: level2Mission,
        });
        setSession((currentSession) =>
          currentSession
            ? recordRound(
                currentSession,
                judgement.points,
                {
                  headline: judgement.headline,
                  detail: judgement.detail,
                  answerNames: [],
                  conditions: judgement.conditions,
                  totals: calculated.totals,
                },
                "한 끼",
              )
            : currentSession,
        );
        return;
      }

      const mission = buildLevel3Mission();
      const judgement = await postEvaluateMission({
        kind: "level3",
        totals: calculated.totals,
        mission,
      });
      setSession((currentSession) =>
        currentSession
          ? recordRound(
              currentSession,
              judgement.points,
              {
                headline: judgement.headline,
                detail: judgement.detail,
                answerNames: [],
                conditions: judgement.conditions,
                totals: calculated.totals,
              },
              "영양조건",
            )
          : currentSession,
      );
    } finally {
      setBusy(false);
    }
  }

  function confirm() {
    setSession((currentSession) => {
      if (!currentSession) return currentSession;
      if (currentSession.phase === "roundResult") return confirmRound(currentSession);
      if (currentSession.phase === "sessionResult") return beginMove(currentSession);
      return currentSession;
    });
  }

  function restart() {
    if (!session) return;
    recorded.current = false;
    setSession(createSession(session.playerCount, session.demoCards));
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#eef6f0]">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black tracking-wide text-brand">
            {session.stage === "level1" ? "LEVEL 1" : session.stage === "level2" ? "LEVEL 2" : "LEVEL 3"}
            <span className="ml-2 text-neutral-700">{stageZoneLabel(session.stage)}</span>
          </p>
          <PlayerRail
            players={session.players.map((player) => ({
              ...player,
              position: displayPositions[player.id] ?? player.position,
            }))}
            currentPlayerId={session.phase === "done" ? null : current?.id ?? null}
          />
        </div>

        <BoardTrack
          players={session.players}
          displayPositions={displayPositions}
          currentPlayerId={modalOpen || session.phase === "done" ? null : current?.id ?? null}
        />

        <div className="mx-auto mt-6 w-full max-w-xl text-center">
          {session.phase === "board" && current && (
            <>
              <p className="text-2xl font-black sm:text-3xl">{current.name}의 차례입니다</p>
              <p className="mt-1 text-sm text-neutral-600">{stageTitle(session.stage)}</p>
              <button
                type="button"
                onClick={() => setSession((currentSession) => (currentSession ? openTurn(currentSession) : currentSession))}
                className="mt-4 rounded-full bg-gradient-to-b from-[#43d58f] to-[#2fbe78] px-10 py-3 text-base font-extrabold text-white shadow-[0_10px_24px_rgba(47,190,120,0.35)]"
              >
                게임 시작
              </button>
            </>
          )}
          {session.phase === "moving" && session.feedback && current && (
            <>
              <p className="text-2xl font-black">{session.feedback.headline}</p>
              <p className="mt-2 text-lg font-bold text-brand">
                {current.name} 획득 점수 {session.feedback.points} POINT
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-700">{session.feedback.detail}</p>
            </>
          )}
          {session.phase === "done" && (
            <WinnerPanel session={session} onRestart={restart} onHome={() => navigate("/")} />
          )}
        </div>
      </main>
      <Footer />
      {modalOpen && (
        <GameModal
          session={session}
          seconds={timeLeft}
          selected={selected}
          busy={busy}
          onToggle={toggle}
          onSubmit={() => void submit()}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}

function WinnerPanel({
  session,
  onRestart,
  onHome,
}: {
  session: BoardSession;
  onRestart: () => void;
  onHome: () => void;
}) {
  const winner = session.players.find((player) => player.id === session.winnerId) ?? session.players[0];
  const reached = (winner?.position ?? 0) >= GOAL_POSITION;
  const ranked = [...session.players].sort(
    (left, right) => right.position - left.position || left.id - right.id,
  );

  return (
    <section className="rounded-[32px] bg-white px-6 py-8 shadow-sm">
      <p className="text-sm font-black tracking-wide text-brand">GAME OVER</p>
      <h2 className="mt-2 text-4xl font-black">{winner?.name} 우승</h2>
      <p className="mt-2 text-neutral-600">
        {reached ? "가장 먼저 GOAL에 도착했습니다." : "모든 차례가 끝났습니다. 가장 멀리 이동한 플레이어입니다."}
      </p>
      <ol className="mx-auto mt-5 max-w-sm space-y-2 text-left">
        {ranked.map((player) => (
          <li key={player.id} className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
            <span className="font-extrabold">
              {player.name}
              <span className="ml-1 text-xs font-semibold text-neutral-400">{player.role}</span>
            </span>
            <span className="font-bold">
              {player.position >= GOAL_POSITION ? "GOAL" : `${player.position}칸`}
              {player.id === winner?.id ? " 🏆" : ""}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full bg-[#2fbe78] px-6 py-3 text-sm font-extrabold text-white"
        >
          다시 플레이
        </button>
        <button
          type="button"
          onClick={onHome}
          className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-extrabold"
        >
          처음으로
        </button>
      </div>
    </section>
  );
}

function clampPlayers(count: number): number {
  return Math.min(4, Math.max(1, Math.round(count)));
}
