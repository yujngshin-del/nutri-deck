import type { Food } from "../types";
import { level1Round } from "../data/missions";

/** 한 끼를 구성하는 자리. 영양 점수가 아니다. */
export type MealRole = "밥" | "국" | "반찬";

/** 고르는 자리. 밥, 국, 반찬 중 하나다. */
export type MealSlot = MealRole;

/** 국가표준식품성분 분류를 밥·국·반찬으로 붙인다. */
export function mealRole(food: Food): MealRole {
  if (food.category === "밥류") return "밥";
  if (food.category === "국류") return "국";
  return "반찬";
}

export function mealSlot(food: Food): MealSlot {
  return mealRole(food);
}

/** 밥·국·반찬을 하나씩 고르면 한 끼다. */
export function selectionCoversMeal(foods: Food[], selected: string[]): boolean {
  const chosen = new Set(selected);
  const slots: MealSlot[] = ["밥", "국", "반찬"];
  return slots.every((slot) => {
    const available = foods.some((food) => mealSlot(food) === slot);
    if (!available) return true;
    const picked = foods.filter((food) => mealSlot(food) === slot && chosen.has(food.food_code));
    return picked.length === 1;
  });
}

/**
 * LEVEL 1 카드. 밥·반찬·국은 그 자리의 카드만 최대 3장, 전체는 9장.
 * 해당 카드가 없으면 비교가 되도록 세트 전체를 쓴다.
 */
export function cardsForRound(foods: Food[], round: number): Food[] {
  const spec = level1Round(round);
  if (spec.group === "전체") return foods;
  const matched = foods.filter((food) => mealRole(food) === spec.group);
  const picked = matched.slice(0, 3);
  return picked.length > 0 ? picked : foods;
}
