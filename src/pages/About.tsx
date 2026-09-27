import { Link } from "react-router-dom";
import { SimplePage } from "../components/SimplePage";

const steps = [
  { label: "국가표준식품성분 DB", state: "확장 예정" },
  { label: "메뉴젠 음식·조리 정보", state: "확장 예정" },
  { label: "게임용 음식 카드", state: "목업 동작" },
  { label: "LEVEL 1에서 영양정보 학습", state: "동작" },
  { label: "같은 카드로 메뉴 선택", state: "동작" },
  { label: "food_code로 영양정보 조회", state: "동작" },
  { label: "선택한 메뉴의 영양성분 합산", state: "동작" },
  { label: "미션 점수만큼 말 이동", state: "동작" },
];

export function About() {
  return (
    <SimplePage title="게임 소개">
      <h1 className="text-3xl font-black">게임 소개</h1>
      <p className="mt-3 text-base leading-7 text-neutral-600">
        Nutri-Deck은 완성된 음식 메뉴의 영양정보를 잠깐 학습한 뒤, 그 기억을 이용해 문제를
        풀고 보드 위의 말을 이동시키는 영양 학습 게임입니다.
      </p>
      <ol className="mt-8 space-y-3">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-bold">
              {index + 1}. {step.label}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-brand">
              {step.state}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm leading-6 text-neutral-500">
        카드에 적힌 영양 수치는 공공데이터를 연결하기 전의 예시입니다. 음식 카드는 비빔밥, 김치찌개,
        불고기처럼 이미 완성된 메뉴입니다.
      </p>
      <Link to="/" className="mt-6 inline-block text-sm font-bold text-brand">
        홈으로 돌아가 게임 시작
      </Link>
    </SimplePage>
  );
}
