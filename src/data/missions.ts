import type { Level1Mission, Level2Mission, Level3Mission, NutrientKey } from "../types";

/** LEVEL 1에서 15초 동안 보여주고 비교하는 영양소. */
export interface StudyNutrient {
  id: string;
  key: NutrientKey;
  label: string;
  direction: "highest" | "lowest";
  prompt: string;
}

export const STUDY_SECONDS = 15;
/** Numbered spaces between START (position 0) and GOAL. */
export const TRACK_SPACES = 18;
/** Landing index of GOAL. Movement still stops here and never passes it. */
export const GOAL_POSITION = TRACK_SPACES + 1;
export const LEVEL1_ROUND_POINTS = 1;
export const LEVEL2_CLEAR_POINTS = 2;
/** LEVEL 2와 LEVEL 3는 음식을 최소 2장 고른다. */
export const MEAL_MIN_SIZE = 2;

export const studyNutrients: StudyNutrient[] = [
  {
    id: "protein",
    key: "protein_g",
    label: "단백질",
    direction: "highest",
    prompt: "단백질 함량이 가장 높은 음식은 무엇일까요?",
  },
  {
    id: "carbohydrate",
    key: "carbohydrate_g",
    label: "탄수화물",
    direction: "highest",
    prompt: "탄수화물 함량이 가장 높은 음식은 무엇일까요?",
  },
  {
    id: "sodium",
    key: "sodium_mg",
    label: "나트륨",
    direction: "lowest",
    prompt: "나트륨 함량이 가장 낮은 음식은 무엇일까요?",
  },
];

/**
 * 2,000kcal 한 끼(1/3)에 맞춘 조건.
 * 열량 670kcal ±50. 탄수화물 하한 83g(670kcal의 약 50%). 83~108g 구간은
 * 일부 세트에서 단백질·나트륨과 동시에 맞출 수 없어 상한은 두지 않는다.
 * 단백질 하한 18g. 나트륨 2,000mg의 1/3인 667mg 이하.
 * 앞에 있는 4개가 첫 LEVEL 2다.
 */
export const level2Missions: Level2Mission[] = [
  {
    id: "kcal-670",
    level: 2,
    kind: "kcal",
    label: "열량",
    prompt: "670kcal에 가장 가까운 한 끼를 구성하세요.",
    targetKcal: 670,
    successGap: 50,
  },
  {
    id: "protein-18",
    level: 2,
    kind: "threshold",
    label: "단백질",
    prompt: "단백질 18g 이상인 한 끼를 구성하세요.",
    nutrient: "protein_g",
    op: "gte",
    value: 18,
    unit: "g",
  },
  {
    id: "carb-83",
    level: 2,
    kind: "threshold",
    label: "탄수화물",
    prompt: "탄수화물 83g 이상인 한 끼를 구성하세요.",
    nutrient: "carbohydrate_g",
    op: "gte",
    value: 83,
    unit: "g",
  },
  {
    id: "sodium-667",
    level: 2,
    kind: "threshold",
    label: "나트륨",
    prompt: "나트륨 667mg 이하인 한 끼를 구성하세요.",
    nutrient: "sodium_mg",
    op: "lte",
    value: 667,
    unit: "mg",
  },
  {
    id: "fat-18",
    level: 2,
    kind: "threshold",
    label: "지방",
    prompt: "지방 18g 이하인 한 끼를 구성하세요.",
    nutrient: "fat_g",
    op: "lte",
    value: 18,
    unit: "g",
  },
  {
    id: "sugar-33",
    level: 2,
    kind: "threshold",
    label: "당류",
    prompt: "당류 33g 이하인 한 끼를 구성하세요.",
    nutrient: "sugar_g",
    op: "lte",
    value: 33,
    unit: "g",
  },
];

/** 앞에 있는 3개가 첫 LEVEL 3다. 조건은 LEVEL 2와 같고, 조건마다 1점이다. */
export const level3Missions: Level3Mission[] = [
  {
    id: "protein18-carb83",
    level: 3,
    prompt: "단백질 18g 이상, 탄수화물 83g 이상인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 83, unit: "g" },
    ],
  },
  {
    id: "protein18-sodium667",
    level: 3,
    prompt: "단백질 18g 이상, 나트륨 667mg 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "sodium", label: "나트륨", nutrient: "sodium_mg", op: "lte", value: 667, unit: "mg" },
    ],
  },
  {
    id: "protein18-carb83-sodium667",
    level: 3,
    prompt: "단백질 18g 이상, 탄수화물 83g 이상, 나트륨 667mg 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 83, unit: "g" },
      { id: "sodium", label: "나트륨", nutrient: "sodium_mg", op: "lte", value: 667, unit: "mg" },
    ],
  },
  {
    id: "carb83-sodium667",
    level: 3,
    prompt: "탄수화물 83g 이상, 나트륨 667mg 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 83, unit: "g" },
      { id: "sodium", label: "나트륨", nutrient: "sodium_mg", op: "lte", value: 667, unit: "mg" },
    ],
  },
  {
    id: "protein18-fat18",
    level: 3,
    prompt: "단백질 18g 이상, 지방 18g 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "fat", label: "지방", nutrient: "fat_g", op: "lte", value: 18, unit: "g" },
    ],
  },
  {
    id: "carb83-sugar33",
    level: 3,
    prompt: "탄수화물 83g 이상, 당류 33g 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 83, unit: "g" },
      { id: "sugar", label: "당류", nutrient: "sugar_g", op: "lte", value: 33, unit: "g" },
    ],
  },
];

export function level2MissionById(id: string): Level2Mission {
  return level2Missions.find((mission) => mission.id === id) ?? level2Missions[0];
}

export function level3MissionById(id: string): Level3Mission {
  return level3Missions.find((mission) => mission.id === id) ?? level3Missions[0];
}

/** 이미 쓴 미션을 뒤로 미룬다. 풀이 비면 처음부터 다시 고른다. */
export function takeMissionIds(
  pool: ReadonlyArray<{ id: string }>,
  used: readonly string[],
  count: number,
): { ids: string[]; used: string[] } {
  const poolIds = pool.map((mission) => mission.id);
  const otherUsed = used.filter((id) => !poolIds.includes(id));
  let poolUsed = used.filter((id) => poolIds.includes(id));
  let remaining = poolIds.filter((id) => !poolUsed.includes(id));
  if (remaining.length === 0) {
    poolUsed = [];
    remaining = [...poolIds];
  }
  const ids = remaining.slice(0, count);
  for (const id of poolIds) {
    if (ids.length >= count) break;
    if (!ids.includes(id)) ids.push(id);
  }
  return { ids, used: [...otherUsed, ...poolUsed, ...ids] };
}

export function missionForRound(round: number): Level1Mission {
  const nutrient = studyNutrients[round - 1] ?? studyNutrients[0];
  return {
    id: nutrient.id,
    level: 1,
    prompt: nutrient.prompt,
    nutrient: nutrient.key,
    direction: nutrient.direction,
  };
}

