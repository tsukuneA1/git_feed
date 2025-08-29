import React, { useMemo, useState } from "react";
import type { ActivityItem, Actor } from "@/features/feed/types";
import { Icons } from "@/features/feed/components/Icons";
import { RecommendedUsers } from "@/features/feed/components/RecommendedUsers";

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

const FOLLOWED = new Set(["alice", "rails", "vercel"]);
const isWorkByFollowed = (it: ActivityItem) =>
  (it.type === "push" || it.type === "pull_request_opened" || it.type === "issue_opened") &&
  FOLLOWED.has(it.actor.username);

function workLabel(it: ActivityItem) {
  if (it.type === "push") {
    const n = it.commits?.length ?? 1;
    return `${it.actor.username} pushed ${n} commit${n > 1 ? "s" : ""}${it.repo ? ` to ${it.repo.name}` : ""}`;
  }
  if (it.type === "pull_request_opened") {
    return `${it.actor.username} opened PR: ${it.title ?? "(no title)"}${it.repo ? ` in ${it.repo.name}` : ""}`;
  }
  if (it.type === "issue_opened") {
    return `${it.actor.username} opened issue: ${it.title ?? "(no title)"}${it.repo ? ` in ${it.repo.name}` : ""}`;
  }
  return `${it.actor.username}`;
}

export function RightSidebar({
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

      <RecommendedUsers users={whoToFollow} />

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

        {recentWork.length === 0 ? (
          <div className="px-4 pb-4 text-xs text-gray-500">該当する作業はありません</div>
        ) : (
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
        )}
      </div>
    </aside>
  );
}

export default RightSidebar;

