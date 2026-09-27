import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodCollage } from "../components/FoodCollage";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { cx } from "../utils/format";

const steps = [
  { title: "LEVEL 1", text: "영양정보를 10초간 보고, 숨긴 뒤 영양소를 비교합니다. 맞히면 1점." },
  { title: "LEVEL 2", text: "같은 음식 카드로 700kcal에 가까운 한 끼를 구성합니다. 성공하면 2점." },
  { title: "LEVEL 3", text: "학습한 영양소 3가지 조건을 각각 확인합니다. 조건마다 1점." },
];

export function Home() {
  const navigate = useNavigate();
  const [count, setCount] = useState(2);
  const [demoCards, setDemoCards] = useState(false);

  useEffect(() => {
    document.title = "Nutri-Deck";
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f8f7]">
      <FoodCollage variant="frame" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-12 pt-14 md:pt-20">
          <h1 className="text-center text-5xl font-black tracking-tight md:text-7xl">Nutri-Deck</h1>
          <p className="mt-4 max-w-xl text-center text-lg font-semibold leading-8 text-neutral-800 md:text-2xl">
            음식 카드를 기억하고
            <br />
            영양 지식을 활용해
            <br />
            가장 먼저 GOAL에 도착하세요
          </p>
          <p className="mt-3 text-center text-sm text-neutral-500">
            한 화면에서 순서대로 플레이하는 보드게임입니다. 1점은 말 1칸입니다.
          </p>

          <p className="mt-10 text-sm font-extrabold text-neutral-700">플레이어 수를 선택하세요.</p>
          <div className="mt-3 grid w-full max-w-md grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={count === item}
                onClick={() => setCount(item)}
                className={cx(
                  "rounded-2xl bg-white py-4 text-lg font-black shadow-sm",
                  count === item ? "ring-4 ring-[#3ee08f]" : "ring-1 ring-black/5",
                )}
              >
                {item}명
              </button>
            ))}
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <input
              type="checkbox"
              checked={demoCards}
              onChange={(event) => setDemoCards(event.target.checked)}
              className="h-4 w-4 accent-[#1f9d55]"
            />
            시연 카드 세트
          </label>

          <button
            type="button"
            onClick={() =>
              navigate("/play", { state: { playerCount: count, demoCards, fresh: true } })
            }
            className="mt-6 rounded-full bg-gradient-to-b from-[#43d58f] to-[#2fbe78] px-14 py-4 text-lg font-extrabold text-white shadow-[0_12px_28px_rgba(47,190,120,0.35)]"
          >
            게임 시작
          </button>

          <div className="mt-12 grid w-full gap-3 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.title} className="rounded-3xl bg-white/90 p-4 text-left shadow-sm">
                <p className="text-sm font-extrabold text-brand">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{step.text}</p>
              </article>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
