import { X } from "lucide-react";
import type { Food } from "../types";
import { formatNutrient, splitFoodName } from "../utils/format";
import { mealRole } from "../utils/mealRole";

export function MealTray({
  foods,
  onRemove,
  showEnergy = false,
  emptyText = "음식 카드를 누르면 선택한 메뉴가 여기에 모입니다.",
}: {
  foods: Food[];
  onRemove: (foodCode: string) => void;
  showEnergy?: boolean;
  emptyText?: string;
}) {
  return (
    <section className="rounded-3xl bg-neutral-950/75 p-4 text-white ring-1 ring-white/10">
      <h2 className="text-sm font-extrabold">나의 한 끼</h2>
      {foods.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-white/65">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {foods.map((food) => {
            const name = splitFoodName(food.food_name);
            return (
            <li
              key={food.food_code}
              className="flex items-center gap-2 rounded-2xl bg-white p-2 text-neutral-900"
            >
              <img
                src={food.image}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">
                  <span className="mr-1 text-[11px] font-black text-[#157a3e]">{mealRole(food)}</span>
                  {name.title}
                </p>
                {name.detail ? (
                  <p className="truncate text-[11px] font-bold text-[#157a3e]">{name.detail}</p>
                ) : null}
                <p className="text-[11px] text-neutral-400">
                  {food.food_code}
                  {showEnergy ? ` · ${formatNutrient("energy_kcal", food.energy_kcal)}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(food.food_code)}
                aria-label={`${food.food_name} 선택 해제`}
                className="grid h-7 w-7 place-items-center rounded-full bg-neutral-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
