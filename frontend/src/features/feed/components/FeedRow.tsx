"use client";
import React, { useState } from "react";
import Link from "next/link";
import type { ActivityItem } from "@/features/feed/types";
import { ActivityBadge } from "@/features/feed/components/ActivityBadge";
import { Avatar } from "@/features/feed/components/Avatar";
import { Highlights } from "@/features/feed/components/Highlights";

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

export function FeedRow({ activity }: { activity: ActivityItem }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex gap-3 p-4 hover:bg-muted/50 transition-colors">
      <Avatar src={activity.actor.avatarUrl} alt={activity.actor.username} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <Link
            href={`/${activity.actor.username}`}
            className="font-medium hover:underline"
          >
            {activity.actor.username}
          </Link>
          <ActivityBadge type={activity.type} />
          {activity.repo && (
            <>
              <span>in</span>
              <Link
                href={activity.repo.url}
                className="font-mono hover:underline"
              >
                {activity.repo.name}
              </Link>
            </>
          )}
          {activity.community && (
            <>
              <span>in</span>
              <Link
                href={`/c/${activity.community.slug}`}
                className="rounded-full border border-border px-1.5 py-0.5 text-[11px] hover:underline"
              >
                c/{activity.community.slug}
              </Link>
            </>
          )}
          <span className="text-gray-400">· {timeAgo(activity.createdAt)}</span>
        </div>

        {activity.title &&
          activity.type !== "qa_posted" &&
          !(
            activity.url &&
            (activity.type === "article_published" ||
              activity.postKind === "link")
          ) && (
            <div className="mt-2 text-[15px] leading-6">
              {activity.url ? (
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {activity.title}
                </a>
              ) : (
                <span className="font-medium">{activity.title}</span>
              )}
              {activity.version && (
                <span className="ml-2 rounded-md border border-border bg-secondary/30 px-1.5 py-0.5 text-xs">
                  v{activity.version}
                </span>
              )}
              {activity.postKind && (
                <span className="ml-2 rounded-md border border-border bg-secondary/30 px-1.5 py-0.5 text-[11px]">
                  {activity.postKind}
                </span>
              )}
            </div>
          )}

        {activity.summary && (
          <p className="mt-1 text-sm text-gray-600">{activity.summary}</p>
        )}

        {(activity.type === "article_published" || activity.postKind === "link") && (
          <div className="mt-2 text-[15px] leading-6">
            {activity.url ? (
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {activity.title ?? activity.url}
              </a>
            ) : (
              <span className="font-medium">{activity.title}</span>
            )}
          </div>
        )}

        <Highlights items={activity.aiHighlights} />

        {activity.type === "qa_posted" && (
          <div className="mt-3 rounded-lg border border-border bg-background p-3 text-sm">
            <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
              <span>Q&amp;A</span>
              {activity.targetUser && (
                <>
                  <span>·</span>
                  <span>@{activity.targetUser.username} への質問</span>
                </>
              )}
            </div>
            <div className="whitespace-pre-wrap leading-6">
              {activity.title ?? activity.question}
            </div>
          </div>
        )}

        {activity.type === "community_posted" && (
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
            <span>👍 {activity.upvotes ?? 0}</span>
            <span>💬 {activity.commentsCount ?? 0}</span>
            <Link
              href={`/c/${activity.community?.slug}/post/${activity.id}`}
              className="underline"
            >
              Open discussion
            </Link>
          </div>
        )}

        <div className="mt-3 flex items-center">
          <button
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            className={classNames(
              "ml-auto inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs",
              saved
                ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
                : "bg-card hover:bg-gray-50"
            )}
            title={saved ? "Saved" : "Bookmark"}
          >
            {saved ? "★ Saved" : "☆ Bookmark"}
          </button>
        </div>
      </div>
    </div>
  );
}
