import { foods } from "../data/foods";

const frame = [
  { src: "/foods/bibimbap.png", className: "left-[-1.5rem] top-16 hidden w-36 md:block lg:w-48" },
  { src: "/foods/bulgogi.png", className: "right-[-1rem] top-12 hidden w-32 md:block lg:w-44" },
  { src: "/foods/kimchi-jjigae.png", className: "left-[-2rem] top-[46%] hidden w-36 lg:block lg:w-48" },
  { src: "/foods/japchae.png", className: "right-[-1.5rem] top-[40%] hidden w-36 lg:block lg:w-44" },
  { src: "/foods/grilled-fish.png", className: "bottom-6 left-[4%] hidden w-40 lg:block" },
  { src: "/foods/seaweed-soup.png", className: "bottom-4 right-[22%] hidden w-32 lg:block" },
  { src: "/foods/gimbap.png", className: "bottom-8 right-[-0.5rem] hidden w-36 md:block lg:w-44" },
];

export function FoodCollage({ variant }: { variant: "frame" | "fill" }) {
  if (variant === "frame") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {frame.map((item) => (
          <img
            key={item.src}
            src={item.src}
            alt=""
            className={`absolute aspect-square rounded-full object-cover shadow-xl ring-4 ring-white ${item.className}`}
          />
        ))}
        <span className="absolute left-[8%] top-[30%] hidden rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-500 shadow lg:block">
          890 kcal
        </span>
        <span className="absolute right-[12%] top-[28%] hidden rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-500 shadow lg:block">
          294 kcal
        </span>
      </div>
    );
  }

  const tiles = [...foods, ...foods, ...foods];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-neutral-950" aria-hidden="true">
      <div className="grid grid-cols-3 gap-2 opacity-70 sm:grid-cols-4 lg:grid-cols-6">
        {tiles.map((food, index) => (
          <img
            key={`${food.food_code}-${index}`}
            src={food.image}
            alt=""
            className="h-36 w-full object-cover sm:h-44"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-neutral-950/78" />
    </div>
  );
}
