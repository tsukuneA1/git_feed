import type { paths } from "@/types/api";

type GetPopular = paths["/api/v1/languages/popular"]["get"];
type PopularRes = GetPopular["responses"]["200"]["content"]["application/json"];

export async function getPopularLanguages(limit = 100): Promise<PopularRes> {
  const res = await fetch(`/api/v1/languages/popular?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<PopularRes>;
}
