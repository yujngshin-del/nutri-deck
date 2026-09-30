import { SimplePage } from "../components/SimplePage";

const lessons = [
  { name: "열량", text: "음식이 내는 에너지입니다. 단위는 kcal입니다." },
  { name: "탄수화물", text: "밥, 면, 떡처럼 주로 에너지가 되는 성분입니다." },
  { name: "단백질", text: "고기, 생선, 두부, 달걀 메뉴에서 많이 볼 수 있습니다." },
  { name: "지방", text: "같은 양이어도 메뉴마다 차이가 큽니다." },
  { name: "식이섬유", text: "채소와 잡곡이 들어간 메뉴에서 살펴봅니다." },
  { name: "당류", text: "단맛과 관련된 당의 양입니다. 과일 메뉴는 당류가 높게 나올 수 있습니다." },
  { name: "나트륨", text: "국, 찌개, 양념이 많은 메뉴는 나트륨이 높게 나올 수 있습니다." },
];

export function Learn() {
  return (
    <SimplePage title="학습 자료">
      <h1 className="text-3xl font-black">학습 자료</h1>
      <p className="mt-3 leading-7 text-neutral-600">
        LEVEL 1은 문제마다 15초 동안 그 문제의 영양소만 보여 줍니다. 그 값을 기억해 음식을 고릅니다.
      </p>
      <div className="mt-6 grid gap-3">
        {lessons.map((lesson) => (
          <article key={lesson.name} className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="font-extrabold">{lesson.name}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{lesson.text}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm leading-6 text-neutral-500">
        LEVEL 1은 밥·반찬·국 3장 비교는 맞히면 1점, 전체 9장 비교는 맞히면 2점입니다.
        LEVEL 2와 LEVEL 3은 밥, 국, 반찬을 하나씩 골라 한 끼를 만듭니다. 기회는 3번입니다.
        LEVEL 2는 성공하면 2점, LEVEL 3은 조건마다 1점입니다.
      </p>
    </SimplePage>
  );
}
