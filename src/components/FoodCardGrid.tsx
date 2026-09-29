import type { ReactNode } from "react";

export function FoodCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[840px] grid-cols-3 gap-4">{children}</div>
  );
}
