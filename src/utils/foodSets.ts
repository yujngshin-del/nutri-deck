import { preparedFoodSetCodes } from "../data/preparedFoodSets";
import { getFoodByCode } from "../data/foods";
import type { Food } from "../types";

export const SET_IDS = ["SET_A", "SET_B", "SET_C", "SET_D"] as const;
export const CARDS_PER_SET = 9;

export interface PlayerFoodSet {
  setId: (typeof SET_IDS)[number];
  playerId: number;
  foods: Food[];
}

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

function materialize(codes: readonly string[]): Food[] {
  return codes.map((code) => {
    const food = getFoodByCode(code);
    if (!food) {
      throw new Error(`알 수 없는 food_code: ${code}`);
    }
    return food;
  });
}

/**
 * 게임 시작 때 플레이어 수만큼 서로 다른 9장 세트를 확정한다.
 * stable이면 항상 같은 세트 순서를 쓰고, 아니면 검증된 세트 묶음을 플레이어에게 다시 배정한다.
 */
export function createPlayerFoodSets(playerCount: number, stable = false): PlayerFoodSet[] {
  if (playerCount < 1 || playerCount > preparedFoodSetCodes.length) {
    throw new Error(`지원 플레이어 수는 1-${preparedFoodSetCodes.length}명입니다: ${playerCount}`);
  }

  const catalog = preparedFoodSetCodes.map((codes) => materialize(codes));
  const chosen = (stable ? catalog : shuffle(catalog)).slice(0, playerCount);
  const seen = new Set<string>();

  return chosen.map((setFoods, index) => {
    if (setFoods.length !== CARDS_PER_SET) {
      throw new Error(`카드 세트는 ${CARDS_PER_SET}장이어야 합니다: ${setFoods.length}`);
    }
    for (const food of setFoods) {
      if (seen.has(food.food_code)) {
        throw new Error(`세트 사이 중복 food_code: ${food.food_code}`);
      }
      seen.add(food.food_code);
    }
    return {
      setId: SET_IDS[index] ?? "SET_A",
      playerId: index + 1,
      foods: setFoods,
    };
  });
}
