import type { paths } from "@/types/api";

type GetPopular = paths["/api/v1/languages/popular"]["get"];
type PopularRes = GetPopular["responses"]["200"]["content"]["application/json"];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";

export async function getPopularLanguages(limit = 100): Promise<PopularRes> {
  const res = await fetch(
    `${API_BASE}/api/v1/languages/popular?limit=${limit}`,
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<PopularRes>;
}

export async function fetchUserTagPrefs(token: string) {
  const res = await fetch(`${API_BASE}/api/v1/user_tag_prefs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
