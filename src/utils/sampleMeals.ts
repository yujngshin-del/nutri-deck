import type { Food, NutritionTotals } from "../types";
import { mealSlot, type MealSlot } from "./mealRole";
import { calculateNutrition } from "./nutritionCalculator";

/** 밥·국·반찬을 하나씩 골랐을 때 통과하는 한 끼를 최대 limit개 찾는다. */
export function samplePassingMeals(
  foods: Food[],
  passes: (totals: NutritionTotals) => boolean,
  limit = 2,
): Food[][] {
  const slots: MealSlot[] = ["밥", "국", "반찬"];
  const buckets = slots
    .map((slot) => foods.filter((food) => mealSlot(food) === slot))
    .filter((bucket) => bucket.length > 0);
  if (buckets.length === 0 || buckets.some((bucket) => bucket.length === 0)) return [];

  const found: Food[][] = [];
  const walk = (index: number, chosen: Food[]) => {
    if (found.length >= limit) return;
    if (index === buckets.length) {
      if (passes(calculateNutrition(chosen))) found.push(chosen);
      return;
    }
    for (const food of buckets[index]) {
      walk(index + 1, chosen.concat(food));
      if (found.length >= limit) return;
    }
  };
  walk(0, []);
  return found;
}

export function mealLabel(foods: Food[]): string {
  return foods.map((food) => food.food_name).join(" · ");
}
