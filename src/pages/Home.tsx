import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodCollage } from "../components/FoodCollage";
import { HomeBackdrop } from "../components/HomeBackdrop";
import { LevelGuide } from "../components/LevelGuide";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { cx } from "../utils/format";

export function Home() {
  const navigate = useNavigate();
  const [count, setCount] = useState(2);
  const [demoCards, setDemoCards] = useState(false);

  useEffect(() => {
    document.title = "밥상탐험대";
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f4f7ef] bg-[radial-gradient(circle_at_12%_16%,rgba(125,222,168,0.45),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(255,196,120,0.5),transparent_24%),radial-gradient(circle_at_78%_82%,rgba(147,186,255,0.4),transparent_28%),radial-gradient(circle_at_16%_86%,rgba(255,176,168,0.35),transparent_24%),linear-gradient(180deg,#fffaf4_0%,#f3f8ef_48%,#fff6ea_100%)]">
      <HomeBackdrop />
      <FoodCollage variant="frame" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 pb-12 pt-14 md:pt-20">
          <h1>
            <img src="/wordmark.png" alt="밥상탐험대" className="mx-auto h-auto w-[min(88vw,560px)]" />
          </h1>
          <p className="mt-4 max-w-xl text-center text-lg font-semibold leading-8 text-neutral-800 md:text-2xl">
            음식 카드를 기억하고
            <br />
            영양 지식을 활용해
            <br />
            가장 먼저 GOAL에 도착하세요
          </p>
          <p className="mt-3 text-center text-sm text-neutral-500">
            한 화면에서 순서대로 플레이하는 보드게임입니다. LEVEL 1은 3장 비교 1점, 9장 비교 2점입니다. LEVEL 2는 성공하면 2점입니다. 1점은 말 1칸입니다.
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

          <label className="hidden">
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

          <LevelGuide />
        </main>
        <Footer />
      </div>
    </div>
  );
}

