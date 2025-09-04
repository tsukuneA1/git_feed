"use client";
import { useEffect, useState } from "react";

type Repo = {
  id: number;
  full_name: string;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
};

export default function Page() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);
        const url =
          "https://api.github.com/search/repositories?q=nextjs&sort=updated&order=desc&per_page=20";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();
        setRepos(data.items ?? []);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setErr(e.message);
        } else {
          setErr("unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <p>loading…</p>;
  if (err) return <p style={{ color: "red" }}>Error: {err}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h2>GitHub Repos</h2>
      <ul>
        {repos.map((r) => (
          <li key={r.id}>
            <a href={r.html_url} target="_blank" rel="noreferrer">
              {r.full_name}
            </a>{" "}
            ⭐ {r.stargazers_count} （更新:{" "}
            {new Date(r.updated_at).toLocaleString()}）
          </li>
        ))}
      </ul>
    </main>
  );
}
