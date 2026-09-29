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
        LEVEL 1에서 15초 동안 본 영양정보를 기억해, 이후 음식 선택에 사용합니다.
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
        LEVEL 1은 단백질, 탄수화물, 나트륨을 각각 비교하고 문제마다 1점입니다. LEVEL 2는 음식을
        최소 2개 골라 한 끼를 구성하고, 성공하면 2점입니다. LEVEL 3은 음식을 최소 2개 골라 여러
        조건을 동시에 확인하고, 조건마다 1점입니다.
      </p>
    </SimplePage>
  );
}
