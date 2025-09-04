"use client";
import { useEffect, useState } from "react";
import { TagSelector } from "@/components/tag-selector";
import { fetchUserTagPrefs } from "@/lib/api";

export default function HomePage() {
  const [prefs, setPrefs] = useState<{ tag: string; weight: number }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUserTagPrefs(token)
      .then((data) => {
        setPrefs(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 w-full">
      <TagSelector initialSelectedTags={prefs} />
    </div>
  );
}
