import { NUTRIENT_META } from "../types";
import type {
  Food,
  Level1Mission,
  Level2Mission,
  Level3Condition,
  Level3Mission,
  MissionJudgement,
  NutritionTotals,
} from "../types";
import { formatNutrient } from "./format";

/**
 * 학생이 고른 메뉴의 합산 결과만 미션 조건과 비교한다.
 * 음식 목록 전체를 뒤져 조합을 찾거나, 다른 메뉴를 제안하지 않는다.
 */
export type MissionEvaluationInput =
  | {
      kind: "level1";
      selected: Food | null;
      dealt: Food[];
      mission: Level1Mission;
    }
  | {
      kind: "level2";
      totals: NutritionTotals;
      mission: Level2Mission;
    }
  | {
      kind: "level3";
      totals: NutritionTotals;
      mission: Level3Mission;
    };

export function evaluateMission(input: MissionEvaluationInput): MissionJudgement {
  if (input.kind === "level1") {
    return evaluateLevel1(input.selected, input.dealt, input.mission);
  }
  if (input.kind === "level2") {
    return evaluateLevel2(input.totals, input.mission);
  }
  return evaluateLevel3(input.totals, input.mission);
}

function evaluateLevel1(
  selected: Food | null,
  dealt: Food[],
  mission: Level1Mission,
): MissionJudgement {
  const answers = bestFoods(dealt, mission);
  const correct = selected
    ? answers.some((food) => food.food_code === selected.food_code)
    : false;
  const meta = NUTRIENT_META[mission.nutrient];
  const actual = selected
    ? formatNutrient(mission.nutrient, selected[mission.nutrient])
    : "선택 없음";

  const award = mission.points;
  return {
    points: correct ? award : 0,
    maxPoints: award,
    headline: correct ? "정답입니다!" : "오답입니다.",
    detail: correct
      ? `${selected?.food_name ?? ""}의 ${meta.label}은 ${actual}입니다.`
      : answers.length > 0
        ? `정답은 ${answers
            .map((food) => `${food.food_name}(${meta.label} ${formatNutrient(mission.nutrient, food[mission.nutrient])})`)
            .join(", ")}입니다.`
        : "선택한 음식이 정답이 아닙니다.",
    conditions: [
      {
        id: mission.id,
        label: mission.prompt,
        targetText: answers
          .map((food) => `${food.food_name} ${formatNutrient(mission.nutrient, food[mission.nutrient])}`)
          .join(", "),
        actualText: selected ? `${selected.food_name} ${actual}` : "시간 초과",
        met: correct,
      },
    ],
  };
}

export function meetsLevel2(totals: NutritionTotals, mission: Level2Mission): boolean {
  const result = evaluateLevel2(totals, mission);
  return result.maxPoints > 0 && result.points >= result.maxPoints;
}

export function meetsLevel3(totals: NutritionTotals, mission: Level3Mission): boolean {
  const result = evaluateLevel3(totals, mission);
  return result.maxPoints > 0 && result.points >= result.maxPoints;
}

export function bestFoods(dealt: Food[], mission: Level1Mission): Food[] {
  if (dealt.length === 0) return [];
  const values = dealt.map((food) => food[mission.nutrient]);
  const target =
    mission.direction === "highest" ? Math.max(...values) : Math.min(...values);
  return dealt.filter((food) => food[mission.nutrient] === target);
}

function evaluateLevel2(totals: NutritionTotals, mission: Level2Mission): MissionJudgement {
  if (mission.kind === "threshold") {
    const actual = totals[mission.nutrient];
    const met = mission.op === "gte" ? actual >= mission.value : actual <= mission.value;
    const targetText =
      mission.op === "gte"
        ? `${mission.value.toLocaleString("ko-KR")}${mission.unit} 이상`
        : `${mission.value.toLocaleString("ko-KR")}${mission.unit} 이하`;
    return {
      points: met ? 2 : 0,
      maxPoints: 2,
      headline: met ? "성공!" : "조건을 맞추지 못했습니다.",
      detail: `현재 ${mission.label}은 ${formatNutrient(mission.nutrient, actual)}입니다.`,
      conditions: [
        {
          id: mission.id,
          label: mission.label,
          targetText,
          actualText: formatNutrient(mission.nutrient, actual),
          met,
        },
      ],
    };
  }

  const low = mission.targetKcal - mission.successGap;
  const high = mission.targetKcal + mission.successGap;
  const range = `${low.toLocaleString("ko-KR")}~${high.toLocaleString("ko-KR")}kcal`;
  const success = totals.energy_kcal >= low && totals.energy_kcal <= high;

  return {
    points: success ? 2 : 0,
    maxPoints: 2,
    headline: success ? "성공!" : "범위를 벗어났습니다.",
    detail: `범위는 ${range}, 현재 식사는 ${totals.energy_kcal}kcal입니다.`,
    conditions: [
      {
        id: "kcal-range",
        label: "열량",
        targetText: range,
        actualText: `${totals.energy_kcal}kcal`,
        met: success,
      },
    ],
  };
}

function evaluateLevel3(totals: NutritionTotals, mission: Level3Mission): MissionJudgement {
  const conditions = mission.conditions.map((condition) =>
    judgeCondition(totals, condition),
  );
  const metCount = conditions.filter((condition) => condition.met).length;

  return {
    points: metCount,
    maxPoints: mission.conditions.length,
    headline: `${mission.conditions.length}개 조건 중 ${metCount}개 충족`,
    detail: "조건마다 1점입니다.",
    conditions,
  };
}

function judgeCondition(
  totals: NutritionTotals,
  condition: Level3Condition,
): MissionJudgement["conditions"][number] {
  const actual = totals[condition.nutrient];
  let met = false;
  let targetText = "";

  if (condition.op === "between") {
    const min = condition.min ?? 0;
    const max = condition.max ?? 0;
    met = actual >= min && actual <= max;
    targetText = `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}${condition.unit}`;
  } else if (condition.op === "gte") {
    const value = condition.value ?? 0;
    met = actual >= value;
    targetText = `${value.toLocaleString("ko-KR")}${condition.unit} 이상`;
  } else {
    const value = condition.value ?? 0;
    met = actual <= value;
    targetText = `${value.toLocaleString("ko-KR")}${condition.unit} 이하`;
  }

  return {
    id: condition.id,
    label: condition.label,
    targetText,
    actualText: formatNutrient(condition.nutrient, actual),
    met,
  };
}
