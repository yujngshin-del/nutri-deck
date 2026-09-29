import type { Food } from "../types";
import { level1Round } from "../data/missions";

/** 한 끼를 구성하는 자리. 영양 점수가 아니다. */
export type MealRole = "밥" | "국" | "반찬" | "주찬";

export const MEAL_ROLES: MealRole[] = ["밥", "국", "반찬", "주찬"];

/** 국가표준식품성분 분류를 밥·국·반찬·주찬으로 붙인다. */
export function mealRole(food: Food): MealRole {
  if (food.category === "밥류") return "밥";
  if (food.category === "국류") return "국";
  if (food.category === "나물류" || food.category === "전류") return "반찬";
  if (food.category === "볶음류" && !food.food_name.includes("불고기")) return "반찬";
  return "주찬";
}

export function mealRolesIn(foods: Food[]): MealRole[] {
  return MEAL_ROLES.filter((role) => foods.some((food) => mealRole(food) === role));
}

export function selectionCoversMeal(foods: Food[], selected: string[]): boolean {
  const chosen = new Set(selected);
  return mealRolesIn(foods).every((role) =>
    foods.some((food) => mealRole(food) === role && chosen.has(food.food_code)),
  );
}

/**
 * LEVEL 1 카드. 밥·찬·국은 그 자리의 카드만 최대 3장, 전체는 9장.
 * 찬은 반찬과 주찬이다. 해당 카드가 없으면 비교가 되도록 세트 전체를 쓴다.
 */
export function cardsForRound(foods: Food[], round: number): Food[] {
  const spec = level1Round(round);
  if (spec.group === "전체") return foods;
  const matched = foods.filter((food) => {
    const role = mealRole(food);
    if (spec.group === "밥") return role === "밥";
    if (spec.group === "국") return role === "국";
    return role === "반찬" || role === "주찬";
  });
  const picked = matched.slice(0, 3);
  return picked.length > 0 ? picked : foods;
}
