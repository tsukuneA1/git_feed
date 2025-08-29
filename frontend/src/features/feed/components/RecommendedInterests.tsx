import React from "react";

export function RecommendedInterests({
  interests,
  title = "あなたへのおすすめ",
}: {
  interests: string[];
  title?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {interests.length === 0 ? (
          <span className="text-xs text-gray-500">まだありません</span>
        ) : (
          interests.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] leading-4 text-secondary-foreground ring-1 ring-border"
            >
              {t}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default RecommendedInterests;

