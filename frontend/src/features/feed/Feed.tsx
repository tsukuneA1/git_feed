"use client";
import type React from "react";
import { useMemo, useState } from "react";
import { AudienceTabs } from "@/features/feed/components/AudienceTabs";
import { FeedRow } from "@/features/feed/components/FeedRow";
import { QnaComposer } from "@/features/feed/components/QnaComposer";
import RightSidebar from "@/features/feed/components/RightSidebar";
import type {
  ActivityItem,
  ActivityType,
  FeedProps,
} from "@/features/feed/types";

function _timeAgo(iso: string) {
  const now = Date.now();
  const past = new Date(iso).getTime();
  const diff = Math.max(0, Math.floor((now - past) / 1000));
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function _classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" {...props}>
      <path
        fill="currentColor"
        d="M15.5 14h-.8l-.3-.3a6 6 0 1 0-1.4 1.4l.3.3v.8l5 5 1.5-1.5-5-5Zm-5.5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
      />
    </svg>
  );
}

// QnaComposer moved to components/QnaComposer

const FOLLOWED = new Set(["alice", "rails", "vercel"]);

function _isWorkByFollowed(it: ActivityItem) {
  return (
    (it.type === "push" ||
      it.type === "pull_request_opened" ||
      it.type === "issue_opened") &&
    FOLLOWED.has(it.actor.username)
  );
}

function _workLabel(it: ActivityItem) {
  if (it.type === "push") {
    const n = it.commits?.length ?? 1;
    return `${it.actor.username} pushed ${n} commit${n > 1 ? "s" : ""}${
      it.repo ? ` to ${it.repo.name}` : ""
    }`;
  }
  if (it.type === "pull_request_opened") {
    return `${it.actor.username} opened PR: ${it.title ?? "(no title)"}${
      it.repo ? ` in ${it.repo.name}` : ""
    }`;
  }
  if (it.type === "issue_opened") {
    return `${it.actor.username} opened issue: ${it.title ?? "(no title)"}${
      it.repo ? ` in ${it.repo.name}` : ""
    }`;
  }
  return `${it.actor.username}`;
}

// RightSidebar moved to components/RightSidebar

const CENTER_EXCLUDED = new Set<ActivityType>([
  "push",
  "pull_request_opened",
  "issue_opened",
]);

const isArtifact = (it: ActivityItem) =>
  it.type === "release_published" ||
  it.type === "article_published" ||
  it.type === "package_published" ||
  it.type === "site_deployed" ||
  it.type === "repo_tagged" ||
  it.type === "milestone_reached" ||
  it.type === "directory_shared" ||
  it.type === "community_posted";

const isWorkButCenterOK = (it: ActivityItem) =>
  !CENTER_EXCLUDED.has(it.type) &&
  (it.type === "qa_posted" ||
    it.type === "starred_repo" ||
    it.type === "forked_repo" ||
    it.type === "followed_user");

export function Feed({
  items: initial,
  defaultAudience = "recommended",
  defaultQuery = "",
  onPostQ,
}: FeedProps) {
  const [items, setItems] = useState<ActivityItem[]>(() => [...initial]);
  const [audience, setAudience] = useState<"recommended" | "following">(
    defaultAudience,
  );
  const [q, setQ] = useState(defaultQuery);

  const allUsers = useMemo(
    () => Array.from(new Set(items.map((i) => i.actor.username))),
    [items],
  );

  const filtered = useMemo(() => {
    const base = items.filter((it) => isArtifact(it) || isWorkButCenterOK(it));
    const audienceFiltered =
      audience === "following"
        ? base.filter((it) => FOLLOWED.has(it.actor.username))
        : base;

    let out = audienceFiltered.filter((it) => !CENTER_EXCLUDED.has(it.type));

    const query = q.trim().toLowerCase();
    if (query) {
      out = out.filter((it) => {
        const hay = [
          it.title ?? "",
          it.summary ?? "",
          it.url ?? "",
          (it.tags ?? []).join(" "),
          it.actor.username,
          it.repo?.name ?? "",
          it.community?.name ?? "",
          it.community?.slug ?? "",
        ]
          .join(" \n ")
          .toLowerCase();
        return hay.includes(query);
      });
    }

    return out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [items, audience, q]);

  const handlePostQ = (payload: { text: string; to?: string }) => {
    const newItem: ActivityItem = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Math.random()),
      type: "qa_posted",
      actor: {
        username: "you",
        avatarUrl: "https://avatars.githubusercontent.com/u/10001?v=4",
      },
      targetUser: payload.to
        ? {
            username: payload.to,
            avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
          }
        : undefined,
      title: payload.text,
      aiHighlights: ["質問"],
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    onPostQ?.(payload);
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <h1 className="text-2xl font-bold text-foreground leading-tight text-balance mb-0">
        フィード
      </h1>
      <div className="h-1.5 w-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg"></div>
      <section className="space-y-3">
        <AudienceTabs value={audience} onChange={setAudience} />

        <div className="px-1">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative"
            aria-label="Feed search"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="検索（タイトル・本文・タグ・URL）"
              className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-11 text-base focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2.5 text-xl leading-none text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </form>
        </div>
        <QnaComposer users={allUsers} onPost={handlePostQ} />
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {filtered.map((a) => (
            <FeedRow activity={a} key={a.id} />
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              条件に一致する投稿がありません
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            className="mt-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Load more
          </button>
        </div>
      </section>

      <RightSidebar items={items} />
    </div>
  );
}

export default Feed;
