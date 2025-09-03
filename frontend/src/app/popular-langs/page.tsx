"use client";

import { useEffect, useState } from "react";
import { getPopularLanguages } from "@/lib/api";

type PopularRes = Awaited<ReturnType<typeof getPopularLanguages>>;

export default function PopularLangsPage() {
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [data, setData] = useState<PopularRes | null>(null);
  const [limit, setLimit] = useState(200); // “全件”寄りに

  useEffect(() => {
    setState("loading");
    getPopularLanguages(limit)
      .then((res) => {
        setData(res);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [limit]);

  if (state === "loading") return <p className="p-4">Loading…</p>;
  if (state === "error")
    return <p className="p-4 text-red-500">Failed to load</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-xl font-semibold">Popular Languages</h1>
        <label className="text-sm">
          limit:
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value || 0))}
            className="ml-2 w-20 border rounded px-2 py-1"
            min={1}
            max={200}
          />
        </label>
        <span className="text-sm text-gray-500">total: {data?.total ?? 0}</span>
      </div>

      <ul className="space-y-2">
        {data?.items.map((lang) => (
          <li key={lang.slug} className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: lang.color ?? "#ccc" }}
            />
            <span className="font-medium">{lang.label}</span>
            {typeof lang.reposCount === "number" && (
              <span className="text-sm text-gray-500">({lang.reposCount})</span>
            )}
            <span className="ml-auto text-xs text-gray-400">{lang.slug}</span>
          </li>
        ))}
      </ul>

      {data?.lastUpdated && (
        <p className="mt-6 text-xs text-gray-400">
          lastUpdated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  );
}
