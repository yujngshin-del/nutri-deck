const cards = [
  {
    title: "LEVEL 1",
    name: "영양정보를 탐색하라!",
    text: "문제마다 15초 동안 해당 영양소만 본 뒤 비교합니다. 밥·반찬·국 3장은 맞히면 1점, 전체 9장은 맞히면 2점.",
    image: "/levels/level1.png",
  },
  {
    title: "LEVEL 2",
    name: "한 끼 미션을 수행하라!",
    text: "밥, 국, 반찬을 하나씩 골라 한 끼를 구성합니다. 성공하면 2점, 기회는 3번.",
    image: "/levels/level2.png",
  },
  {
    title: "LEVEL 3",
    name: "영양 밸런스 챌린지에 참여하라!",
    text: "밥, 국, 반찬으로 여러 조건을 맞춥니다. 조건마다 1점, 기회는 3번.",
    image: "/levels/level3.png",
  },
] as const;

export function LevelGuide() {
  return (
    <div className="mt-12 grid w-full gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="flex flex-col overflow-hidden rounded-[28px] border border-[#e4d2b4] bg-[#fffaf3] shadow-[0_10px_24px_rgba(120,78,32,0.08)]"
        >
          <img src={card.image} alt="" className="aspect-square w-full object-cover" />
          <div className="px-4 py-4">
            <p className="text-sm font-extrabold text-brand">{card.title}</p>
            <p className="mt-1 break-keep text-base font-black leading-6 text-[#2b2118]">{card.name}</p>
            <p className="mt-2 break-keep text-sm font-semibold leading-6 text-[#5c4632]">{card.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
