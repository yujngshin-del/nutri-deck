import { useState } from "react";
import { Check } from "lucide-react";
import type { Food, NutrientKey } from "../types";
import { NUTRIENT_META } from "../types";
import { cx, formatNutrient, splitFoodName } from "../utils/format";
import { mealRole } from "../utils/mealRole";

interface FoodCardProps {
  food: Food;
  selected?: boolean;
  mark?: "none" | "correct" | "wrong";
  showNutrition?: boolean;
  highlightKeys?: NutrientKey[];
  barScale?: Partial<Record<NutrientKey, number>>;
  disabled?: boolean;
  onSelect?: (foodCode: string) => void;
}

const allKeys: NutrientKey[] = [
  "energy_kcal",
  "carbohydrate_g",
  "protein_g",
  "fat_g",
  "fiber_g",
  "sugar_g",
  "sodium_mg",
];

export function FoodCard({
  food,
  selected = false,
  mark = "none",
  showNutrition = false,
  highlightKeys = [],
  barScale = {},
  disabled = false,
  onSelect,
}: FoodCardProps) {
  const [broken, setBroken] = useState(false);
  const { title, detail } = splitFoodName(food.food_name);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onSelect?.(food.food_code)}
      className={cx(
        "relative w-full min-w-0 rounded-[24px] bg-white p-3 text-left shadow-[0_10px_30px_rgba(16,24,20,0.08)] transition",
        !disabled && "hover:-translate-y-0.5",
        selected || mark === "correct"
          ? "ring-4 ring-[#3ee08f]"
          : mark === "wrong"
            ? "ring-4 ring-rose-400"
            : "ring-1 ring-black/5",
        disabled && "cursor-default",
      )}
    >
      {(selected || mark === "correct") && (
        <>
          <span className="absolute -top-3 right-5 z-10 rounded-full bg-[#2fbe78] px-2.5 py-1 text-[11px] font-bold text-white shadow">
            {mark === "correct" && !selected ? "정답" : "선택됨"}
          </span>
          <span className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-[#2fbe78] text-white shadow">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        </>
      )}
      {mark === "wrong" && (
        <span className="absolute -top-3 right-5 z-10 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          내 선택
        </span>
      )}

      <div className="overflow-hidden rounded-2xl bg-neutral-100">
        {broken ? (
          <div className="grid h-32 place-items-center text-sm font-bold text-neutral-500">
            {food.food_name}
          </div>
        ) : (
          <img
            src={food.image}
            alt={food.food_name}
            onError={() => setBroken(true)}
            className="h-32 w-full object-cover"
          />
        )}
      </div>

      <div className="px-1 pb-1 pt-3">
        <p className="text-lg font-extrabold leading-tight">{title}</p>
        {detail ? <p className="mt-1 text-sm font-bold leading-snug text-brand">{detail}</p> : null}
        <p className="mt-1 inline-flex rounded-full bg-[#eef8f2] px-2 py-0.5 text-[11px] font-black text-[#157a3e]">
          {mealRole(food)}
        </p>
        <p className="mt-0.5 text-xs font-medium text-neutral-400">{food.food_code}</p>

        {showNutrition ? (
          <ul className="mt-2 space-y-2">
            {(highlightKeys.length > 0 ? highlightKeys : allKeys).map((key) => {
              const scale = barScale[key] || food[key] || 1;
              const width = Math.max(6, Math.round((food[key] / scale) * 100));
              return (
                <li key={key}>
                  <p className="text-[13px] font-extrabold text-brand">
                    {NUTRIENT_META[key].label} {formatNutrient(key, food[key])}
                  </p>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-[#2fbe78]" style={{ width: `${width}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl bg-neutral-50 px-3 py-2 text-center text-xs font-bold text-neutral-400">
            영양정보 숨김
          </p>
        )}
      </div>
    </button>
  );
}
