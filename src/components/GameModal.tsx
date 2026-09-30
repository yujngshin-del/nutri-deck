import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { FoodCardGrid } from "./FoodCardGrid";
import { MealTray } from "./MealTray";
import { NutrientChart } from "./NutrientChart";
import {
  MAX_ATTEMPTS,
  TRACK_SPACES,
  level1Round,
  level1RoundPoints,
  level1Rounds,
  level2MissionById,
  level3MissionById,
  missionForRound,
} from "../data/missions";
import { stageTitle, type BoardSession } from "../game/boardRules";
import { NUTRIENT_META } from "../types";
import type { Food, NutrientKey } from "../types";
import { formatNutrient } from "../utils/format";
import { cardsForRound, mealRole, selectionCoversMeal } from "../utils/mealRole";

export function GameModal({
  session,
  seconds,
  selected,
  busy,
  onToggle,
  onSubmit,
  onConfirm,
  onRetry,
}: {
  session: BoardSession;
  seconds: number;
  selected: string[];
  busy: boolean;
  onToggle: (foodCode: string) => void;
  onSubmit: () => void;
  onConfirm: () => void;
  onRetry: () => void;
}) {
  const result = session.phase === "roundResult" || session.phase === "sessionResult";
  const current = session.players[session.currentPlayerIndex];
  const foods = current?.foodSet ?? [];
  const visible = visibleFoods(session, foods);
  const keys = questionKeys(session);
  const mealReady = session.stage === "level1" || selectionCoversMeal(foods, selected);
  const retry = canRetry(session);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-3 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-modal-title"
        className="flex max-h-[88vh] w-[min(92vw,920px)] flex-col overflow-hidden rounded-[32px] bg-[#fbfaf7] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-black tracking-[0.16em] text-brand">
              {current?.name}의 카드
              {"  ·  "}
              {session.stage === "level1" ? "LEVEL 1" : session.stage === "level2" ? "LEVEL 2" : "LEVEL 3"}
              {session.phase === "preview" ? "  ·  문제 확인" : ""}
              {session.phase === "study" ? "  ·  영양정보 학습" : ""}
            </p>
            <h2 id="game-modal-title" className="mt-1 text-2xl font-black sm:text-3xl">
              {session.phase === "preview"
                ? "문제를 먼저 확인하세요"
                : session.phase === "study"
                  ? "이 문제의 영양소를 기억하세요"
                  : stageTitle(session.stage)}
            </h2>
          </div>
          {session.phase !== "preview" && session.phase !== "sessionResult" && (
            <div className="text-right">
              <p className="rounded-full bg-white px-3 py-1 text-sm font-black shadow-sm">
                ROUND {session.round} / {session.stageMissionIds.length}
              </p>
              {session.stage !== "level1" && session.phase !== "roundResult" && (
                <p className="mt-2 text-lg font-black text-neutral-800">
                  기회 {session.attempt || 1} / {MAX_ATTEMPTS}
                </p>
              )}
            </div>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          {session.phase === "preview" && <PreviewBody session={session} />}
          {session.phase === "study" && <StudyBody session={session} seconds={seconds} keys={keys} />}
          {session.phase === "answer" && <QuestionBody session={session} />}
          {session.phase === "roundResult" && session.feedback && (
            <RoundResult session={session} />
          )}
          {session.phase === "sessionResult" && <SessionResult session={session} />}

          {(session.phase === "study" || session.phase === "answer") && (
            <>
              {session.phase === "answer" && session.stage !== "level1" && (
                <div className="mb-4 w-full max-w-sm">
                  <MealTray
                    foods={foods.filter((food) => selected.includes(food.food_code))}
                    onRemove={onToggle}
                    emptyText="밥과 국을 하나씩 고르고, 반찬이나 주찬 중 하나를 고르세요."
                  />
                </div>
              )}
              <CardGroups
                session={session}
                foods={visible}
                keys={keys}
                selected={selected}
                onToggle={onToggle}
              />
            </>
          )}
          {result && <span className="sr-only">결과</span>}
        </div>

        <footer className="border-t border-black/5 px-6 py-4 sm:px-8">
          {session.phase === "answer" && (
            <button
              type="button"
              disabled={busy || (session.stage === "level1" ? selected.length === 0 : !mealReady)}
              onClick={onSubmit}
              className="rounded-full bg-neutral-900 px-8 py-3 text-base font-extrabold text-white disabled:opacity-40"
            >
              {session.stage === "level1" ? "답 제출" : "계산하기"}
            </button>
          )}
          {session.phase === "answer" && session.stage !== "level1" && (
            <p className="mt-3 text-sm font-semibold text-neutral-500">
              밥과 국을 하나씩 고르고, 반찬이나 주찬 중 하나를 고르세요. 기회 {session.attempt || 1}/{MAX_ATTEMPTS}
            </p>
          )}
          {session.phase === "preview" && (
            <>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-full bg-[#2fbe78] px-10 py-3 text-base font-extrabold text-white"
              >
                확인
              </button>
              <p className="mt-3 text-sm font-semibold text-neutral-500">
                확인을 누르면 카드 영양정보를 15초 동안 보여 줍니다.
              </p>
            </>
          )}
          {session.phase === "study" && (
            <p className="text-sm font-semibold text-neutral-500">
              {seconds}초 후 영양정보가 사라집니다.
              {session.stage === "level1" ? " 이 공개는 처음 한 번입니다." : " 문제가 시작되면 수치는 다시 나오지 않습니다."}
            </p>
          )}
          {session.phase === "roundResult" && retry && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full bg-neutral-900 px-8 py-3 text-base font-extrabold text-white"
              >
                다시 도전 ({MAX_ATTEMPTS - (session.attempt || 1)}번 남음)
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-full bg-[#2fbe78] px-8 py-3 text-base font-extrabold text-white"
              >
                이 점수로 확인
              </button>
            </div>
          )}
          {result && !retry && (
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-[#2fbe78] px-10 py-3 text-base font-extrabold text-white"
            >
              확인
            </button>
          )}
        </footer>
      </section>
    </div>,
    document.body,
  );
}

function canRetry(session: BoardSession): boolean {
  if (session.phase !== "roundResult" || session.stage === "level1" || !session.feedback) return false;
  if ((session.attempt || 1) >= MAX_ATTEMPTS) return false;
  return !session.roundLog.some((note) => note.round === session.round);
}

const level1StudyKeys: NutrientKey[] = ["energy_kcal", "carbohydrate_g", "protein_g", "sodium_mg"];

function visibleFoods(session: BoardSession, foods: Food[]): Food[] {
  if (session.phase === "study") return foods;
  if (session.stage === "level1") return cardsForRound(foods, session.round);
  return foods;
}

function questionKeys(session: BoardSession): NutrientKey[] {
  if (session.phase === "study" && session.stage === "level1") return level1StudyKeys;
  if (session.phase === "study" && session.reviewMissions) return reviewStudyKeys(session);
  if (session.stage === "level1") return [missionForRound(session.round).nutrient];
  const missionId = session.stageMissionIds[session.round - 1] ?? "";
  if (session.stage === "level2") {
    const mission = level2MissionById(missionId);
    return [mission.kind === "kcal" ? "energy_kcal" : mission.nutrient];
  }
  return [...new Set(level3MissionById(missionId).conditions.map((condition) => condition.nutrient))];
}

function barScale(foods: Food[], keys: NutrientKey[]): Partial<Record<NutrientKey, number>> {
  const scale: Partial<Record<NutrientKey, number>> = {};
  for (const key of keys) {
    scale[key] = Math.max(...foods.map((food) => food[key]), 1);
  }
  return scale;
}

function CardGroups({
  session,
  foods,
  keys,
  selected,
  onToggle,
}: {
  session: BoardSession;
  foods: Food[];
  keys: NutrientKey[];
  selected: string[];
  onToggle: (foodCode: string) => void;
}) {
  const scale = barScale(foods, keys);
  const sideDishes = foods
    .filter((food) => {
      const role = mealRole(food);
      return role === "반찬" || role === "주찬";
    })
    .sort((left, right) => Number(mealRole(right) === "반찬") - Number(mealRole(left) === "반찬"));
  const groups =
    session.stage === "level1"
      ? [{ title: null as string | null, foods }]
      : [
          { title: "밥", foods: foods.filter((food) => mealRole(food) === "밥") },
          { title: "국", foods: foods.filter((food) => mealRole(food) === "국") },
          { title: "반찬 · 주찬", foods: sideDishes },
        ];

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        if (group.foods.length === 0) return null;
        return (
          <section key={group.title ?? "cards"}>
            {group.title ? (
              <h3 className="mb-3 text-sm font-black tracking-wide text-neutral-500">{group.title}</h3>
            ) : null}
            <FoodCardGrid>
              {group.foods.map((food) => (
                <FoodCard
                  key={food.food_code}
                  food={food}
                  showNutrition={session.phase === "study"}
                  highlightKeys={session.phase === "study" ? keys : []}
                  barScale={scale}
                  selected={session.phase === "answer" && selected.includes(food.food_code)}
                  disabled={session.phase !== "answer"}
                  onSelect={onToggle}
                />
              ))}
            </FoodCardGrid>
          </section>
        );
      })}
    </div>
  );
}

function reviewMissions(session: BoardSession) {
  return session.stageMissionIds.map((id) => level2MissionById(id));
}

/** 조건이 바뀐 뒤 다시 보여주는 영양소. 열량은 항상 포함한다. */
function reviewStudyKeys(session: BoardSession): NutrientKey[] {
  const keys: NutrientKey[] = ["energy_kcal"];
  for (const mission of reviewMissions(session)) {
    const key = mission.kind === "kcal" ? "energy_kcal" : mission.nutrient;
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}

function PreviewBody({ session }: { session: BoardSession }) {
  if (session.stage === "level1") {
    return (
      <div className="mx-auto max-w-xl py-4">
        <p className="text-base font-semibold leading-7 text-neutral-600">
          아래 문제를 읽은 뒤 확인을 누르세요. 확인 후 열량, 탄수화물, 단백질, 나트륨을 15초 동안 보여 줍니다.
        </p>
        <ol className="mt-5 space-y-3">
          {level1Rounds.map((round, index) => (
            <li key={round.id} className="rounded-2xl bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-black tracking-wide text-brand">
                {index + 1}. {round.label}
              </p>
              <p className="mt-1 text-lg font-black">{round.prompt}</p>
              <p className="mt-1 text-sm font-semibold text-neutral-500">맞히면 {level1RoundPoints(round.group)}점입니다.</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const missions = reviewMissions(session);
  return (
    <div className="mx-auto max-w-xl py-4">
      <p className="text-base font-semibold leading-7 text-neutral-600">
        조건이 바뀌었습니다. 아래 문제를 읽은 뒤 확인을 누르세요. 확인 후 이번 조건의 영양소와 열량을 15초 동안 보여 줍니다.
      </p>
      <ol className="mt-5 space-y-3">
        {missions.map((mission, index) => (
          <li key={mission.id} className="rounded-2xl bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-black tracking-wide text-brand">
              {index + 1}. {mission.label}
            </p>
            <p className="mt-1 text-lg font-black">{mission.prompt}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StudyBody({
  session,
  seconds,
  keys,
}: {
  session: BoardSession;
  seconds: number;
  keys: NutrientKey[];
}) {
  const names = keys.map((key) => NUTRIENT_META[key].label).join(", ");
  const spec = session.stage === "level1" ? level1Round(session.round) : null;
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-black text-brand">{session.stage === "level1" ? names : spec?.label ?? names}</p>
        <p className="mt-1 text-base font-semibold text-neutral-600">
          {session.stage === "level1"
            ? "열량, 탄수화물, 단백질, 나트륨을 카드 안에서 한 번 보여 줍니다. 문제가 시작되면 수치는 다시 나오지 않습니다."
            : "이번 조건의 영양소와 열량을 15초 동안 보여 줍니다. 문제가 시작되면 수치는 다시 나오지 않습니다."}
        </p>
      </div>
      <p className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white text-3xl font-black text-brand shadow">
        {seconds}
      </p>
    </div>
  );
}

function QuestionBody({ session }: { session: BoardSession }) {
  if (session.stage === "level1") {
    const mission = missionForRound(session.round);
    const spec = level1Round(session.round);
    return (
      <div className="mb-5">
        <p className="text-sm font-black text-brand">{spec.label}</p>
        <h3 className="mt-1 text-xl font-black sm:text-2xl">{mission.prompt}</h3>
        <p className="mt-2 text-sm text-neutral-600">맞히면 {mission.points}점입니다.</p>
      </div>
    );
  }

  const missionId = session.stageMissionIds[session.round - 1] ?? "";
  if (session.stage === "level2") {
    const mission = level2MissionById(missionId);
    const hint =
      mission.kind === "kcal"
        ? "범위 안이면 성공해서 2점, 그 외에는 0점입니다."
        : "조건을 만족하면 2점, 아니면 0점입니다.";
    return (
      <div className="mb-5">
        <h3 className="text-xl font-black sm:text-2xl">{mission.prompt}</h3>
        <p className="mt-2 text-sm text-neutral-600">
          밥과 국을 하나씩 고르고, 반찬이나 주찬 중 하나를 고르세요. {hint} 기회는 {MAX_ATTEMPTS}번이고, 가장 높은 점수를 씁니다.
        </p>
      </div>
    );
  }

  const mission = level3MissionById(missionId);
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
      <p className="mt-2 text-sm text-neutral-600">
        밥과 국을 하나씩 고르고, 반찬이나 주찬 중 하나를 고르세요. 조건마다 1점이고, 기회는 {MAX_ATTEMPTS}번입니다.
      </p>
    </div>
  );
}

function RoundResult({ session }: { session: BoardSession }) {
  const feedback = session.feedback;
  if (!feedback) return null;
  const correct = feedback.points > 0;
  const meal = session.stage !== "level1";
  const ending = turnEnds(session);
  const retry = canRetry(session);
  const keys = questionKeys(session);

  return (
    <div className="mx-auto max-w-xl py-6 text-center">
      <p className="text-4xl font-black">
        {session.stage === "level1"
          ? correct
            ? "정답!"
            : "오답입니다"
          : session.stage === "level3"
            ? "결과"
            : correct
              ? "성공!"
              : "아쉽습니다."}
      </p>
      {session.stage === "level1" && !correct && (
        <p className="mt-4 text-lg font-bold leading-8">{feedback.detail}</p>
      )}
      {meal && !retry && feedback.answerNames.length > 0 && (
        <div className="mt-5 text-left">
          <p className="text-sm font-black text-neutral-700">조건을 맞추는 한 끼 예시</p>
          <ol className="mt-2 space-y-2">
            {feedback.answerNames.map((name, index) => (
              <li key={`${index}-${name}`} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold shadow-sm">
                {index + 1}. {name}
              </li>
            ))}
          </ol>
        </div>
      )}
      {session.stage !== "level1" && (
        <p className="mt-3 text-sm leading-6 text-neutral-600">{feedback.detail}</p>
      )}
      {meal && feedback.conditions.length > 0 && (
        <ul className="mt-5 space-y-2 text-left">
          {feedback.conditions.map((condition) => (
            <li key={condition.id} className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-bold">
                  {condition.met ? <Check className="h-4 w-4 text-brand" /> : <X className="h-4 w-4 text-rose-500" />}
                  {condition.label} {condition.targetText}
                </span>
                <span className="font-black">
                  현재 {condition.actualText}
                  {session.stage === "level3" ? ` · ${condition.met ? "+1" : "+0"}` : ""}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {meal && feedback.totals && (
        <div className="mt-4 rounded-3xl bg-white p-4 text-left shadow-sm">
          <NutrientChart
            rows={keys.map((key) => ({
              id: key,
              label: NUTRIENT_META[key].label,
              value: feedback.totals?.[key] ?? 0,
              text: formatNutrient(key, feedback.totals?.[key] ?? 0),
              active: true,
            }))}
          />
        </div>
      )}
      <p className="mt-6 text-3xl font-black text-brand">+{feedback.points}점</p>
      {retry && (session.bestPoints || 0) > feedback.points && (
        <p className="mt-2 text-sm font-bold text-neutral-500">지금까지 최고 점수는 +{session.bestPoints}점입니다.</p>
      )}
      <p className="mt-2 text-sm text-neutral-500">
        {retry
          ? `다시 도전하거나, 최고 점수(+${Math.max(session.bestPoints || 0, feedback.points)})로 확정할 수 있습니다.`
          : nextStepText(session, ending)}
      </p>
    </div>
  );
}

function turnEnds(session: BoardSession): boolean {
  const position = session.players[session.currentPlayerIndex]?.position ?? 0;
  return position + session.pendingPoints >= TRACK_SPACES || session.round >= session.stageMissionIds.length;
}

function nextStepText(session: BoardSession, ending: boolean): string {
  const position = session.players[session.currentPlayerIndex]?.position ?? 0;
  const steps = Math.max(0, Math.min(session.pendingPoints, TRACK_SPACES - position));
  const goal = position + steps >= TRACK_SPACES;
  if (!ending) {
    return session.stage === "level1"
      ? "확인을 누르면 다음 문제가 이어집니다."
      : "확인을 누르면 다음 문제가 이어집니다. 선택한 음식은 초기화됩니다.";
  }
  if (session.stage === "level1" && !goal) return "확인을 누르면 LEVEL 1 총점을 확인합니다.";
  if (steps === 0) return "말은 이동하지 않습니다.";
  if (goal) return `확인을 누르면 말이 ${steps}칸 이동해 GOAL에 도착합니다.`;
  return `확인을 누르면 말이 ${steps}칸 이동합니다.`;
}

function SessionResult({ session }: { session: BoardSession }) {
  const position = session.players[session.currentPlayerIndex]?.position ?? 0;
  const steps = Math.max(0, Math.min(session.pendingPoints, TRACK_SPACES - position));
  const goal = position + steps >= TRACK_SPACES;
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
        {steps === 0
          ? "말은 이동하지 않습니다."
          : goal
            ? `말이 ${steps}칸 이동해 GOAL에 도착합니다.`
            : `말이 ${steps}칸 이동합니다.`}
      </p>
    </div>
  );
}
