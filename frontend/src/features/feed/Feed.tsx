"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { ActivityItem, ActivityType, FeedProps, Actor } from "@/features/feed/types";
import { FeedRow } from "@/features/feed/components/FeedRow";
import { Icons } from "@/features/feed/components/Icons";

function timeAgo(iso: string) {
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

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" {...props}>
      <path fill="currentColor" d="M15.5 14h-.8l-.3-.3a6 6 0 1 0-1.4 1.4l.3.3v.8l5 5 1.5-1.5-5-5Zm-5.5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
    </svg>
  );
}

function QnaComposer({
  users,
  onPost,
}: {
  users: string[];
  onPost: (payload: { text: string; to?: string }) => void;
}) {
  const [text, setText] = useState("");
  const [to, setTo] = useState<string | undefined>(undefined);
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 text-sm font-medium">
        質問してみる
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例: @alice さんのPR設計のポイントを教えて！"
          className="min-h-[64px] w-full resize-y rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
        <div className="flex items-center gap-2">
          <select
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || undefined)}
            className="rounded-md border border-border bg-background p-1.5 text-xs"
          >
            <option value="">宛先なし（全体）</option>
            {users.map((u) => (
              <option key={u} value={u}>
                @{u} に質問
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!text.trim()) return;
              onPost({ text: text.trim(), to });
              setText("");
              setTo(undefined);
            }}
            className="ml-auto rounded-md border border-border bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/80"
          >
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
}

const FOLLOWED = new Set(["alice", "rails", "vercel"]);

function isWorkByFollowed(it: ActivityItem) {
  return (
    (it.type === "push" ||
      it.type === "pull_request_opened" ||
      it.type === "issue_opened") &&
    FOLLOWED.has(it.actor.username)
  );
}

function workLabel(it: ActivityItem) {
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

function RightSidebar({
  items,
  topics = [],
}: {
  items: ActivityItem[];
  topics?: string[];
}) {
  const whoToFollow: Actor[] = [
    {
      username: "vercel",
      avatarUrl: "https://avatars.githubusercontent.com/u/14985020?v=4",
    },
    {
      username: "rails",
      avatarUrl: "https://avatars.githubusercontent.com/u/4223?v=4",
    },
    {
      username: "biomejs",
      avatarUrl: "https://avatars.githubusercontent.com/u/112236211?v=4",
    },
  ];

  const interests = useMemo(() => {
    const interestCounts = new Map<string, number>();
    const bump = (k: string, n = 1) =>
      interestCounts.set(k, (interestCounts.get(k) ?? 0) + n);
    topics.forEach((t) => bump(t, 3));
    items.forEach((it) => {
      (it.aiHighlights ?? []).forEach((t) => bump(t, 1));
      (it.tags ?? []).forEach((t) => bump(t, 2));
      if (it.repo?.name?.toLowerCase().includes("game")) bump("Game", 1);
    });
    return Array.from(interestCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
  }, [items, topics]);

  const base = items.filter(isWorkByFollowed);
  const pushOnly = base.filter((i) => i.type === "push");
  const prOnly = base.filter((i) => i.type === "pull_request_opened");
  const issueOnly = base.filter((i) => i.type === "issue_opened");

  const [workFilter, setWorkFilter] = useState<"all" | "push" | "pr" | "issue">(
    "all"
  );
  const recentWork =
    workFilter === "push"
      ? pushOnly
      : workFilter === "pr"
      ? prOnly
      : workFilter === "issue"
      ? issueOnly
      : base;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="text-sm font-semibold">あなたへのおすすめ</div>
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

      <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="text-sm font-semibold">おすすめユーザー</div>
        <ul className="mt-2 space-y-2">
          {whoToFollow.map((u) => (
            <li key={u.username} className="flex items-center gap-3">
              <span className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-1 ring-black/5" />
              <div className="text-sm font-medium">@{u.username}</div>
              <button className="ml-auto rounded-md border px-2 py-1 text-xs hover:bg-gray-50">
                Follow
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="px-4 pt-3 text-sm font-semibold">
          From people you follow (recent work)
        </div>
        <div className="px-3 pb-2">
          <div
            className="mt-2 inline-flex overflow-hidden rounded-full border text-[11px]"
            role="tablist"
            aria-label="Work type filter"
          >
            <button
              onClick={() => setWorkFilter("all")}
              className={classNames(
                "px-3 py-1",
                workFilter === "all" ? "bg-muted" : "hover:bg-gray-50"
              )}
              role="tab"
              aria-selected={workFilter === "all"}
              aria-label="All"
            >
              All <span className="ml-1 text-gray-500">({base.length})</span>
            </button>
            <button
              onClick={() => setWorkFilter("push")}
              className={classNames(
                "px-3 py-1 border-l",
                workFilter === "push" ? "bg-muted" : "hover:bg-gray-50"
              )}
              role="tab"
              aria-selected={workFilter === "push"}
              aria-label="Push"
            >
              Push <span className="ml-1 text-gray-500">({pushOnly.length})</span>
            </button>
            <button
              onClick={() => setWorkFilter("pr")}
              className={classNames(
                "px-3 py-1 border-l",
                workFilter === "pr" ? "bg-muted" : "hover:bg-gray-50"
              )}
              role="tab"
              aria-selected={workFilter === "pr"}
              aria-label="PR"
            >
              PR <span className="ml-1 text-gray-500">({prOnly.length})</span>
            </button>
            <button
              onClick={() => setWorkFilter("issue")}
              className={classNames(
                "px-3 py-1 border-l",
                workFilter === "issue" ? "bg-muted" : "hover:bg-gray-50"
              )}
              role="tab"
              aria-selected={workFilter === "issue"}
              aria-label="Issue"
            >
              Issue <span className="ml-1 text-gray-500">({issueOnly.length})</span>
            </button>
          </div>
        </div>

        <ul className="divide-y">
          {recentWork.slice(0, 12).map((w) => (
            <li key={w.id} className="px-4 py-2.5">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-gray-500">
                  {w.type === "push" && <Icons.Push />}
                  {w.type === "pull_request_opened" && <Icons.PR />}
                  {w.type === "issue_opened" && <Icons.Issue />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs">{workLabel(w)}</div>
                  <div className="mt-0.5 text-[11px] text-gray-500">
                    {timeAgo(w.createdAt)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

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
    defaultAudience
  );
  const [q, setQ] = useState(defaultQuery);

  const allUsers = useMemo(
    () => Array.from(new Set(items.map((i) => i.actor.username))),
    [items]
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
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()),
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
      <section className="space-y-3">
        <div
          className="-mx-1 flex items-center justify-center gap-6 border-b bg-background px-1 py-2"
          role="tablist"
          aria-label="Feed audience"
        >
          <button
            onClick={() => setAudience("recommended")}
            className={classNames(
              "rounded-full px-3 py-1 text-sm",
              audience === "recommended"
                ? "font-semibold underline decoration-2 underline-offset-4"
                : "text-gray-500 hover:text-foreground"
            )}
            role="tab"
            aria-selected={audience === "recommended"}
          >
            おすすめ
          </button>
          <button
            onClick={() => setAudience("following")}
            className={classNames(
              "rounded-full px-3 py-1 text-sm",
              audience === "following"
                ? "font-semibold underline decoration-2 underline-offset-4"
                : "text-gray-500 hover:text-foreground"
            )}
            role="tab"
            aria-selected={audience === "following"}
          >
            フォロー中
          </button>
        </div>

        <div className="px-1">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative"
            role="search"
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
          <button className="mt-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-50">
            Load more
          </button>
        </div>
      </section>

      <RightSidebar items={items} />
    </div>
  );
}

export default Feed;

