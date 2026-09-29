import type { NutrientKey } from "../types";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatNutrient(key: NutrientKey, value: number): string {
  if (key === "energy_kcal") {
    return `${Math.round(value).toLocaleString("ko-KR")}kcal`;
  }
  if (key === "sodium_mg") {
    return `${Math.round(value).toLocaleString("ko-KR")}mg`;
  }
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}g`;
}

/** 괄호 안이 같은 계열 메뉴의 차이다. 예: 불고기 / 돼지고기, 고추장 */
export function splitFoodName(name: string): { title: string; detail: string | null } {
  const matched = name.match(/^(.*)\(([^)]+)\)$/);
  if (!matched) return { title: name, detail: null };
  return { title: matched[1].trim(), detail: matched[2].trim() };
}

export function formatPlayedAt(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
