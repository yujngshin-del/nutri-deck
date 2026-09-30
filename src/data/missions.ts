import type { Level1Mission, Level2Mission, Level3Mission, NutrientKey } from "../types";

/** LEVEL 1 한 판에서 비교하는 카드 묶음. */
export type CardGroup = "밥" | "반찬" | "국" | "전체";

export interface Level1Round {
  id: string;
  group: CardGroup;
  key: NutrientKey;
  label: string;
  direction: "highest" | "lowest";
  prompt: string;
}

export const STUDY_SECONDS = 15;
/** LEVEL 2와 LEVEL 3에서 같은 문제를 다시 풀 수 있는 횟수. */
export const MAX_ATTEMPTS = 3;
/** Numbered spaces between START (position 0) and GOAL. */
export const TRACK_SPACES = 18;
/** Landing index of GOAL. Movement still stops here and never passes it. */
export const GOAL_POSITION = TRACK_SPACES + 1;
/** 밥·반찬·국 3장 비교 정답. */
export const LEVEL1_GROUP_POINTS = 1;
/** 9장 전체 비교 정답. */
export const LEVEL1_ALL_POINTS = 2;
export const LEVEL2_CLEAR_POINTS = 2;

export function level1RoundPoints(group: CardGroup): number {
  return group === "전체" ? LEVEL1_ALL_POINTS : LEVEL1_GROUP_POINTS;
}

/**
 * LEVEL 1은 여섯 판이다.
 * 밥 3장·탄수화물, 반찬 3장·단백질, 국 3장·나트륨, 이어서 9장 전체로 같은 세 영양소를 비교한다.
 */
export const level1Rounds: Level1Round[] = [
  {
    id: "rice-carb",
    group: "밥",
    key: "carbohydrate_g",
    label: "밥 · 탄수화물",
    direction: "highest",
    prompt: "밥 카드 중 탄수화물 함량이 가장 높은 음식은 무엇일까요?",
  },
  {
    id: "side-protein",
    group: "반찬",
    key: "protein_g",
    label: "반찬 · 단백질",
    direction: "highest",
    prompt: "반찬 카드 중 단백질 함량이 가장 높은 음식은 무엇일까요?",
  },
  {
    id: "soup-sodium",
    group: "국",
    key: "sodium_mg",
    label: "국 · 나트륨",
    direction: "lowest",
    prompt: "국 카드 중 나트륨 함량이 가장 낮은 음식은 무엇일까요?",
  },
  {
    id: "all-carb",
    group: "전체",
    key: "carbohydrate_g",
    label: "전체 · 탄수화물",
    direction: "highest",
    prompt: "전체 카드 중 탄수화물 함량이 가장 높은 음식은 무엇일까요?",
  },
  {
    id: "all-protein",
    group: "전체",
    key: "protein_g",
    label: "전체 · 단백질",
    direction: "highest",
    prompt: "전체 카드 중 단백질 함량이 가장 높은 음식은 무엇일까요?",
  },
  {
    id: "all-sodium",
    group: "전체",
    key: "sodium_mg",
    label: "전체 · 나트륨",
    direction: "lowest",
    prompt: "전체 카드 중 나트륨 함량이 가장 낮은 음식은 무엇일까요?",
  },
];

/**
 * 한 끼 조건의 허용 범위를 넓힌 값이다. 건강등급이 아니다.
 * 열량 540~800kcal(670±130). 탄수화물 50g 이상. 단백질 18g 이상.
 * 나트륨 1,500mg 이하. 지방 22g 이하. 당류 25g 이하.
 * 앞에 있는 4개가 첫 LEVEL 2다.
 */
export const level2Missions: Level2Mission[] = [
  {
    id: "kcal-670",
    level: 2,
    kind: "kcal",
    label: "열량",
    prompt: "540~800kcal인 한 끼를 구성하세요.",
    targetKcal: 670,
    successGap: 130,
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
    prompt: "탄수화물 50g 이상인 한 끼를 구성하세요.",
    nutrient: "carbohydrate_g",
    op: "gte",
    value: 50,
    unit: "g",
  },
  {
    id: "sodium-667",
    level: 2,
    kind: "threshold",
    label: "나트륨",
    prompt: "나트륨 1,500mg 이하인 한 끼를 구성하세요.",
    nutrient: "sodium_mg",
    op: "lte",
    value: 1500,
    unit: "mg",
  },
  {
    id: "fat-18",
    level: 2,
    kind: "threshold",
    label: "지방",
    prompt: "지방 22g 이하인 한 끼를 구성하세요.",
    nutrient: "fat_g",
    op: "lte",
    value: 22,
    unit: "g",
  },
  {
    id: "sugar-33",
    level: 2,
    kind: "threshold",
    label: "당류",
    prompt: "당류 25g 이하인 한 끼를 구성하세요.",
    nutrient: "sugar_g",
    op: "lte",
    value: 25,
    unit: "g",
  },
];

/** 앞에 있는 3개가 첫 LEVEL 3다. 조건은 LEVEL 2와 같고, 조건마다 1점이다. */
export const level3Missions: Level3Mission[] = [
  {
    id: "protein18-carb83",
    level: 3,
    prompt: "단백질 18g 이상, 탄수화물 50g 이상인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 50, unit: "g" },
    ],
  },
  {
    id: "protein18-sodium667",
    level: 3,
    prompt: "단백질 18g 이상, 나트륨 1,500mg 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "sodium", label: "나트륨", nutrient: "sodium_mg", op: "lte", value: 1500, unit: "mg" },
    ],
  },
  {
    id: "protein18-carb83-sodium667",
    level: 3,
    prompt: "단백질 18g 이상, 탄수화물 50g 이상, 나트륨 1,500mg 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 50, unit: "g" },
      { id: "sodium", label: "나트륨", nutrient: "sodium_mg", op: "lte", value: 1500, unit: "mg" },
    ],
  },
  {
    id: "carb83-sodium667",
    level: 3,
    prompt: "탄수화물 50g 이상, 나트륨 1,500mg 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 50, unit: "g" },
      { id: "sodium", label: "나트륨", nutrient: "sodium_mg", op: "lte", value: 1500, unit: "mg" },
    ],
  },
  {
    id: "protein18-fat18",
    level: 3,
    prompt: "단백질 18g 이상, 지방 22g 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "protein", label: "단백질", nutrient: "protein_g", op: "gte", value: 18, unit: "g" },
      { id: "fat", label: "지방", nutrient: "fat_g", op: "lte", value: 22, unit: "g" },
    ],
  },
  {
    id: "carb83-sugar33",
    level: 3,
    prompt: "탄수화물 50g 이상, 당류 25g 이하인 한 끼를 구성하세요.",
    conditions: [
      { id: "carb", label: "탄수화물", nutrient: "carbohydrate_g", op: "gte", value: 50, unit: "g" },
      { id: "sugar", label: "당류", nutrient: "sugar_g", op: "lte", value: 25, unit: "g" },
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

export function level1Round(round: number): Level1Round {
  return level1Rounds[round - 1] ?? level1Rounds[0];
}

export function missionForRound(round: number): Level1Mission {
  const roundSpec = level1Round(round);
  return {
    id: roundSpec.id,
    level: 1,
    prompt: roundSpec.prompt,
    nutrient: roundSpec.key,
    direction: roundSpec.direction,
    points: level1RoundPoints(roundSpec.group),
  };
}

