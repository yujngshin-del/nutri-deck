import { getFoodByCode, foods } from "../data/foods";
import type { Food } from "../types";

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swap] as T;
    next[swap] = current as T;
  }
  return next;
}

/** 제시할 음식 카드를 무작위로 뽑는다. 정답 메뉴를 고르지 않는다. */
export function getRandomFoodCards(count: number): Food[] {
  return shuffle(foods).slice(0, count);
}

/** 발표용으로 카드 묶음을 고정할 때 사용한다. */
export function getPresetFoodCards(foodCodes: readonly string[]): Food[] {
  return foodCodes.map((foodCode) => {
    const food = getFoodByCode(foodCode);
    if (!food) {
      throw new Error(`알 수 없는 food_code: ${foodCode}`);
    }
    return food;
  });
}
