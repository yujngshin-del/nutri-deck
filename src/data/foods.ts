import catalog from "../../data/foods.json";
import { preparedFoodSetCodes } from "./preparedFoodSets";
import type { Food } from "../types";

/**
 * 게임 시작 전에 나눠 주는 완성 메뉴 후보 36개.
 * 한 플레이어가 받는 카드가 아니라, 4명이 9장씩 겹치지 않게 나누는 전체 목록이다.
 *
 * food_code는 menuzen_ingredient.csv의 fd_Code다.
 * 영양값은 국가표준식품성분 Database 10.4의 가식부 100g당 성분에
 * 메뉴젠 food_Wgh(g) / 100을 곱해 메뉴 단위로 합산한 값이다.
 * kcal·mg는 정수, g는 소수 첫째 자리로 반올림했다.
 * "-"와 Tr, 괄호 추정값이 있는 메뉴는 넣지 않았다.
 *
 * 분류 컬럼은 첨부 파일에서 비어 있어 category는 fd_Code 앞자리 묶음 이름이다.
 * traits는 그 카드가 세트 안에서 맡는 영양 특성 표시이며 점수나 우수 판정이 아니다.
 */
export const foods = catalog as Food[];

const preparedCodes = preparedFoodSetCodes.flat();

if (foods.length !== preparedCodes.length) {
  throw new Error(`후보 음식은 ${preparedCodes.length}개여야 합니다: ${foods.length}`);
}

const seenCodes = new Set<string>();
for (const food of foods) {
  if (seenCodes.has(food.food_code)) {
    throw new Error(`중복 food_code: ${food.food_code}`);
  }
  seenCodes.add(food.food_code);
  if (food.nutrition_source !== "국가표준식품성분DB" || food.menu_source !== "MenuGen") {
    throw new Error(`출처가 맞지 않습니다: ${food.food_code}`);
  }
}

for (const code of preparedCodes) {
  if (!seenCodes.has(code)) {
    throw new Error(`세트에만 있는 food_code: ${code}`);
  }
}

export function getFoodByCode(foodCode: string): Food | undefined {
  return foods.find((food) => food.food_code === foodCode);
}
