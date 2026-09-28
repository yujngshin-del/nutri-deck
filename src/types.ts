export interface Food {
  food_code: string;
  food_name: string;
  category: string;
  energy_kcal: number;
  carbohydrate_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  image: string;
  /** 메뉴젠 재료 중량 합(g). 영양값은 이 중량 기준이다. */
  menu_weight_g: number;
  /** 교육용 특성 표시. 영양 점수가 아니다. */
  traits: string[];
  data_source: "MOCK" | "MenuGen" | "MenuGen+국가표준식품성분DB";
  nutrition_source: "MOCK" | "국가표준식품성분DB";
  menu_source: "MOCK" | "MenuGen";
  is_demo_data: boolean;
  calcium_mg?: number | null;
  iron_mg?: number | null;
  potassium_mg?: number | null;
  vitamin_c_mg?: number | null;
}

export interface NutritionTotals {
  energy_kcal: number;
  carbohydrate_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
}

export type NutrientKey = keyof NutritionTotals;

export interface Level1Mission {
  id: string;
  level: 1;
  prompt: string;
  nutrient: NutrientKey;
  direction: "highest" | "lowest";
}

export type Level2Mission =
  | {
      id: string;
      level: 2;
      kind: "kcal";
      label: string;
      prompt: string;
      targetKcal: number;
      successGap: number;
    }
  | {
      id: string;
      level: 2;
      kind: "threshold";
      label: string;
      prompt: string;
      nutrient: NutrientKey;
      op: "gte" | "lte";
      value: number;
      unit: string;
    };

export type ConditionOp = "between" | "gte" | "lte";

export interface Level3Condition {
  id: string;
  label: string;
  nutrient: NutrientKey;
  op: ConditionOp;
  min?: number;
  max?: number;
  value?: number;
  unit: string;
}

export interface Level3Mission {
  id: string;
  level: 3;
  prompt: string;
  conditions: Level3Condition[];
}

export interface ConditionJudgement {
  id: string;
  label: string;
  targetText: string;
  actualText: string;
  met: boolean;
}

export interface MissionJudgement {
  points: number;
  maxPoints: number;
  headline: string;
  detail: string;
  conditions: ConditionJudgement[];
}

export interface MatchPlayer {
  id: number;
  name: string;
  position: number;
  totalScore: number;
  reachedGoal: boolean;
}

export interface MatchRecord {
  id: string;
  playedAt: string;
  winnerName: string;
  reachedGoal: boolean;
  players: MatchPlayer[];
}

export const NUTRIENT_META: Record<
  NutrientKey,
  { label: string; unit: "kcal" | "g" | "mg" }
> = {
  energy_kcal: { label: "열량", unit: "kcal" },
  carbohydrate_g: { label: "탄수화물", unit: "g" },
  protein_g: { label: "단백질", unit: "g" },
  fat_g: { label: "지방", unit: "g" },
  fiber_g: { label: "식이섬유", unit: "g" },
  sugar_g: { label: "당류", unit: "g" },
  sodium_mg: { label: "나트륨", unit: "mg" },
};
