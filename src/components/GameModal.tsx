import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { FoodCardGrid } from "./FoodCardGrid";
import { MealTray } from "./MealTray";
import {
  GOAL_POSITION,
  buildLevel3Mission,
  level2Mission,
  missionForRound,
  studyNutrients,
} from "../data/missions";
import { stageTitle, type BoardSession } from "../game/boardRules";
import { NUTRIENT_META } from "../types";
import type { NutrientKey } from "../types";
import { formatNutrient } from "../utils/format";

export function GameModal({
  session,
  seconds,
  selected,
  busy,
  onToggle,
  onSubmit,
  onConfirm,
}: {
  session: BoardSession;
  seconds: number;
  selected: string[];
  busy: boolean;
  onToggle: (foodCode: string) => void;
  onSubmit: () => void;
  onConfirm: () => void;
}) {
  const result = session.phase === "roundResult" || session.phase === "sessionResult";

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-3 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-modal-title"
        className="flex max-h-[88vh] w-[min(92vw,1080px)] flex-col overflow-hidden rounded-[32px] bg-[#fbfaf7] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-black tracking-[0.16em] text-brand">
              {session.stage === "level1" ? "LEVEL 1" : session.stage === "level2" ? "LEVEL 2" : "LEVEL 3"}
              {session.phase === "study" ? "  ·  영양정보 학습" : ""}
            </p>
            <h2 id="game-modal-title" className="mt-1 text-2xl font-black sm:text-3xl">
              {session.phase === "study" ? "영양정보를 기억하세요" : stageTitle(session.stage)}
            </h2>
          </div>
          {session.stage === "level1" && session.phase !== "study" && session.phase !== "sessionResult" && (
            <p className="rounded-full bg-white px-3 py-1 text-sm font-black shadow-sm">
              ROUND {session.round} / {studyNutrients.length}
            </p>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          {session.phase === "study" && <StudyBody seconds={seconds} />}
          {session.phase === "answer" && <QuestionBody session={session} />}
          {session.phase === "roundResult" && session.feedback && (
            <RoundResult session={session} />
          )}
          {session.phase === "sessionResult" && <SessionResult session={session} />}

          {(session.phase === "study" || session.phase === "answer") && (
            <>
              {session.phase === "answer" && session.stage !== "level1" && (
                <div className="mb-4 max-w-md">
                  <MealTray
                    foods={session.foods.filter((food) => selected.includes(food.food_code))}
                    onRemove={onToggle}
                  />
                </div>
              )}
              <FoodCardGrid columns="lg:grid-cols-3">
                {session.foods.map((food) => (
                  <FoodCard
                    key={food.food_code}
                    food={food}
                    showNutrition={session.phase === "study"}
                    highlightKeys={session.phase === "study" ? studyNutrients.map((item) => item.key) : []}
                    selected={session.phase === "answer" && selected.includes(food.food_code)}
                    disabled={session.phase !== "answer"}
                    onSelect={onToggle}
                  />
                ))}
              </FoodCardGrid>
            </>
          )}
          {result && <span className="sr-only">결과</span>}
        </div>

        <footer className="border-t border-black/5 px-6 py-4 sm:px-8">
          {session.phase === "answer" && (
            <button
              type="button"
              disabled={selected.length === 0 || busy}
              onClick={onSubmit}
              className="rounded-full bg-neutral-900 px-8 py-3 text-base font-extrabold text-white disabled:opacity-40"
            >
              {session.stage === "level1" ? "답 제출" : "계산하기"}
            </button>
          )}
          {result && (
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-[#2fbe78] px-10 py-3 text-base font-extrabold text-white"
            >
              확인
            </button>
          )}
          {session.phase === "study" && (
            <p className="text-sm font-semibold text-neutral-500">
              {seconds}초 후 영양정보가 사라지고 문제가 시작됩니다.
            </p>
          )}
        </footer>
      </section>
    </div>,
    document.body,
  );
}

function StudyBody({ seconds }: { seconds: number }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <p className="text-base font-semibold text-neutral-600">
        이번 게임에서는 음식의 영양정보를 기억합니다. 학습 영양소는 단백질, 식이섬유, 나트륨입니다.
      </p>
      <p className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white text-3xl font-black text-brand shadow">
        {seconds}
      </p>
    </div>
  );
}

function QuestionBody({ session }: { session: BoardSession }) {
  if (session.stage === "level1") {
    const mission = missionForRound(session.round);
    return (
      <div className="mb-5">
        <p className="text-sm font-black text-brand">{studyNutrients[session.round - 1]?.label}</p>
        <h3 className="mt-1 text-xl font-black sm:text-2xl">{mission.prompt}</h3>
      </div>
    );
  }

  if (session.stage === "level2") {
    return (
      <div className="mb-5">
        <h3 className="text-xl font-black sm:text-2xl">{level2Mission.prompt}</h3>
        <p className="mt-2 text-sm text-neutral-600">
          차이 {level2Mission.successGap}kcal 이내면 성공해서 2점, 그 외에는 0점입니다. 영양정보는 숨겨져 있습니다.
        </p>
      </div>
    );
  }

  const mission = buildLevel3Mission();
  return (
    <div className="mb-5">
      <h3 className="text-xl font-black sm:text-2xl">{mission.prompt}</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {mission.conditions.map((condition, index) => (
          <li key={condition.id} className="rounded-2xl bg-white px-3 py-2 text-sm font-bold shadow-sm">
            {index + 1}. {condition.label} {condition.op === "gte" ? "≥" : "≤"} {condition.value}
            {condition.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoundResult({ session }: { session: BoardSession }) {
  const feedback = session.feedback;
  if (!feedback) return null;
  const correct = feedback.points > 0;
  const level3 = feedback.conditions.length > 1;

  return (
    <div className="mx-auto max-w-xl py-6 text-center">
      <p className="text-4xl font-black">
        {level3 ? "MISSION RESULT" : session.stage === "level2" ? (correct ? "성공!" : "아쉽습니다.") : correct ? "정답!" : "오답입니다"}
      </p>
      {feedback.answerNames.length > 0 && (
        <p className="mt-4 text-lg font-bold">
          {correct
            ? `${feedback.answerNames.join(", ")}입니다.`
            : `정답은 ${feedback.answerNames.join(", ")}입니다.`}
        </p>
      )}
      <p className="mt-3 text-sm leading-6 text-neutral-600">{feedback.detail}</p>
      {feedback.totals && feedback.conditions.length === 1 && (
        <p className="mt-4 text-sm font-bold">
          {feedback.conditions[0]?.targetText}
          <span className="mx-2 text-neutral-300">/</span>
          {feedback.conditions[0]?.actualText}
        </p>
      )}
      {feedback.totals && (
        <dl className="mx-auto mt-4 grid max-w-md gap-1 text-left text-sm">
          {(Object.keys(NUTRIENT_META) as NutrientKey[]).map((key) => (
            <div key={key} className="flex justify-between">
              <dt>{NUTRIENT_META[key].label}</dt>
              <dd className="font-bold">{formatNutrient(key, feedback.totals?.[key] ?? 0)}</dd>
            </div>
          ))}
        </dl>
      )}
      {level3 && (
        <ul className="mt-5 space-y-2 text-left">
          {feedback.conditions.map((condition) => (
            <li key={condition.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
              <span className="flex items-center gap-2 font-bold">
                {condition.met ? <Check className="h-4 w-4 text-brand" /> : <X className="h-4 w-4 text-rose-500" />}
                {condition.label} {condition.targetText}
              </span>
              <span className="font-black">
                {condition.actualText} · {condition.met ? "+1" : "+0"}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-3xl font-black text-brand">+{feedback.points} POINT</p>
      {session.stage === "level1" && session.round < studyNutrients.length && (
        <p className="mt-2 text-sm text-neutral-500">확인을 누르면 다음 문제가 이어집니다.</p>
      )}
      {session.stage === "level1" && session.round >= studyNutrients.length && (
        <p className="mt-2 text-sm text-neutral-500">확인을 누르면 LEVEL 1 총점을 확인합니다.</p>
      )}
      {session.stage !== "level1" && (
        <p className="mt-2 text-sm font-semibold text-neutral-700">
          {movePreview(session, feedback.points)}
        </p>
      )}
    </div>
  );
}

function movePreview(session: BoardSession, points: number): string {
  const position = session.players[session.currentPlayerIndex]?.position ?? 0;
  const steps = Math.max(0, Math.min(points, GOAL_POSITION - position));
  if (steps === 0) return "말은 이동하지 않습니다.";
  if (position + steps >= GOAL_POSITION) return `말이 ${steps}칸 이동해 GOAL에 도착합니다.`;
  return `말이 ${steps}칸 이동합니다.`;
}

function SessionResult({ session }: { session: BoardSession }) {
  const steps = Math.max(
    0,
    Math.min(
      session.pendingPoints,
      GOAL_POSITION - (session.players[session.currentPlayerIndex]?.position ?? 0),
    ),
  );
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <p className="text-sm font-black tracking-wide text-brand">LEVEL 1 완료</p>
      <ul className="mt-5 space-y-2 text-left">
        {session.roundLog.map((note) => (
          <li key={note.round} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
            <span className="font-bold">
              ROUND {note.round} · {note.label}
            </span>
            <span className="font-black">+{note.points}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-neutral-500">총 획득 점수</p>
      <p className="text-4xl font-black text-brand">{session.pendingPoints} POINT</p>
      <p className="mt-3 text-base font-bold">
        {steps === 0 ? "말은 이동하지 않습니다." : `말이 ${steps}칸 이동합니다.`}
      </p>
    </div>
  );
}
