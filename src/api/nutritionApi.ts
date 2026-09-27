import { getFoodByCode, foods } from "../data/foods";
import type { Food, NutritionTotals } from "../types";
import { evaluateMission, type MissionEvaluationInput } from "../utils/missionEvaluator";
import type { MissionJudgement } from "../types";
import { calculateNutrition, emptyNutrition } from "../utils/nutritionCalculator";

/**
 * 화면이 호출하는 목업 API.
 * 나중에 같은 입력/출력으로 아래 주소에 연결하면 된다.
 *
 * GET  /api/foods
 * GET  /api/foods/{food_code}
 * POST /api/nutrition/calculate   { food_codes: string[] }
 * POST /api/mission/evaluate
 */

export interface CalculationResult {
  foods: Food[];
  totals: NutritionTotals;
}

export async function fetchFoods(): Promise<Food[]> {
  return foods;
}

export async function fetchFoodByCode(foodCode: string): Promise<Food> {
  const food = getFoodByCode(foodCode);
  if (!food) {
    throw new Error(`food_code를 찾을 수 없습니다: ${foodCode}`);
  }
  return food;
}

export async function calculateNutritionByCodes(
  foodCodes: string[],
): Promise<CalculationResult> {
  if (foodCodes.length === 0) {
    return { foods: [], totals: emptyNutrition() };
  }

  const selected: Food[] = [];
  for (const foodCode of foodCodes) {
    selected.push(await fetchFoodByCode(foodCode));
  }

  return {
    foods: selected,
    totals: calculateNutrition(selected),
  };
}

export async function postEvaluateMission(
  input: MissionEvaluationInput,
): Promise<MissionJudgement> {
  return evaluateMission(input);
}
