export function NutrientChart({
  rows,
}: {
  rows: { id: string; label: string; value: number; text: string; active?: boolean }[];
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => {
        const width = Math.max(6, Math.round((row.value / max) * 100));
        return (
          <li key={row.id}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-xs font-bold">
              <span className="truncate">{row.label}</span>
              <span className="shrink-0 tabular-nums">{row.text}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
              <div
                className={row.active ? "h-full rounded-full bg-[#2fbe78]" : "h-full rounded-full bg-[#8fd9b3]"}
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
