"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SVGProps, JSX } from "react";
import type {
  ActivityItem,
  ActivityType,
  FeedProps,
  LinkPreview,
  Actor,
} from "./types";

/* =========================
   Helpers
   ========================= */

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

function hostFromUrl(url?: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

/* =========================
   Icons
   ========================= */

type SvgIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const Icons: Record<
  | "Push"
  | "PR"
  | "Issue"
  | "Star"
  | "Fork"
  | "Follow"
  | "Release"
  | "QA"
  | "Article"
  | "Package"
  | "Deploy"
  | "Tag"
  | "Milestone"
  | "Share"
  | "Community",
  SvgIcon
> = {
  Push: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2a3 3 0 0 1 3 3v7h2l-3 4-3-4h2V5a1 1 0 1 0-2 0v3H9V5a3 3 0 0 1 3-3Zm-6 18h12v2H6v-2Z"
      />
    </svg>
  ),
  PR: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M7 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm10 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM10 7h5a3 3 0 0 1 3 3v4h-2v-4a1 1 0 0 0-1-1h-5V7Z"
      />
    </svg>
  ),
  Issue: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M11 7h2v8h-2V7Zm0 10h2v2h-2v-2Zm1-15a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
      />
    </svg>
  ),
  Star: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2 9.5 8H3l5 3.8L6.5 18 12 14.6 17.5 18 16 11.8 21 8h-6.5L12 2Z"
      />
    </svg>
  ),
  Fork: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M7 3a3 3 0 1 0 0 6c.6 0 1.1-.2 1.6-.4A5 5 0 0 0 11 12v1.1A3 3 0 0 0 9 16a3 3 0 1 0 3 3v-5a7 7 0 0 1 4.4-6.5c.5.3 1 .5 1.6.5a3 3 0 1 0-3-3c0 .4.1.8.3 1.2A9 9 0 0 0 13 7.5V7a4 4 0 0 0-4-4ZM17 19a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM7 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm10-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-8 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
      />
    </svg>
  ),
  Follow: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-8 8a8 8 0 1 1 16 0H4Z"
      />
    </svg>
  ),
  Release: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.5 3.6v7.4L12 18.8l-6.5-3.6V7.8L12 4.2Z"
      />
    </svg>
  ),
  QA: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M4 3h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 5v-5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4h12v2H6V7Zm0 4h8v2H6v-2Z"
      />
    </svg>
  ),
  Article: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM7 12h10v2H7v-2Zm0 4h10v2H7v-2Zm0-8h5v2H7V8Z"
      />
    </svg>
  ),
  Package: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2 3 7v10l9 5 9-5V7L12 2Zm0 2.2 6.5 3.6V12L12 15.8 5.5 12V7.8L12 4.2ZM8 9h8v2H8V9Z"
      />
    </svg>
  ),
  Deploy: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M3 20h18v2H3v-2Zm9-18 6 6h-4v6h-4V8H6l6-6Z"
      />
    </svg>
  ),
  Tag: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M10 3h8l3 3-9 9-6-6 4-4Zm-7 9 9 9-2 0H3v-7l0 0Z"
      />
    </svg>
  ),
  Milestone: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M4 3h16v2H4V3Zm2 4h12l-3 6H9L6 7Zm-2 8h16v2H4v-2Zm0 4h16v2H4v-2Z"
      />
    </svg>
  ),
  Share: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M14 9V5l7 7-7 7v-4H6V9h8Z" />
    </svg>
  ),
  Community: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 0 8h-1v1a5 5 0 0 1-10 0v-1H6a4 4 0 1 1 0-8h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3Zm7 8H5a2 2 0 1 0 0 4h14a2 2 0 0 0 0-4Zm-4 6H9a3 3 0 0 0 6 0Z"
      />
    </svg>
  ),
};

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" {...props}>
      <path fill="currentColor" d="M15.5 14h-.8l-.3-.3a6 6 0 1 0-1.4 1.4l.3.3v.8l5 5 1.5-1.5-5-5Zm-5.5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
    </svg>
  );
}

/* =========================
   UI bits
   ========================= */

function ActivityBadge({ type }: { type: ActivityType }) {
  const map: Record<
    ActivityType,
    { label: string; badgeClass: string; icon: JSX.Element }
  > = {
    push: {
      label: "pushed commits",
      badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
      icon: <Icons.Push />,
    },
    pull_request_opened: {
      label: "opened a pull request",
      badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: <Icons.PR />,
    },
    issue_opened: {
      label: "opened an issue",
      badgeClass: "bg-amber-50 text-amber-800 ring-amber-200",
      icon: <Icons.Issue />,
    },
    starred_repo: {
      label: "starred",
      badgeClass: "bg-yellow-50 text-yellow-800 ring-yellow-200",
      icon: <Icons.Star />,
    },
    forked_repo: {
      label: "forked",
      badgeClass: "bg-purple-50 text-purple-700 ring-purple-200",
      icon: <Icons.Fork />,
    },
    followed_user: {
      label: "followed",
      badgeClass: "bg-pink-50 text-pink-700 ring-pink-200",
      icon: <Icons.Follow />,
    },
    release_published: {
      label: "published a release",
      badgeClass: "bg-slate-50 text-slate-700 ring-slate-200",
      icon: <Icons.Release />,
    },
    qa_posted: {
      label: "asked a question",
      badgeClass: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      icon: <Icons.QA />,
    },
    article_published: {
      label: "published an article",
      badgeClass: "bg-cyan-50 text-cyan-700 ring-cyan-200",
      icon: <Icons.Article />,
    },
    package_published: {
      label: "published a package",
      badgeClass: "bg-rose-50 text-rose-700 ring-rose-200",
      icon: <Icons.Package />,
    },
    site_deployed: {
      label: "deployed",
      badgeClass: "bg-lime-50 text-lime-700 ring-lime-200",
      icon: <Icons.Deploy />,
    },
    repo_tagged: {
      label: "tagged a repo",
      badgeClass: "bg-gray-50 text-gray-700 ring-gray-200",
      icon: <Icons.Tag />,
    },
    milestone_reached: {
      label: "reached milestone",
      badgeClass: "bg-gray-50 text-gray-700 ring-gray-200",
      icon: <Icons.Milestone />,
    },
    directory_shared: {
      label: "shared a directory",
      badgeClass: "bg-gray-50 text-gray-700 ring-gray-200",
      icon: <Icons.Share />,
    },
    community_posted: {
      label: "posted in community",
      badgeClass: "bg-sky-50 text-sky-700 ring-sky-200",
      icon: <Icons.Community />,
    },
    community_commented: {
      label: "commented in community",
      badgeClass: "bg-sky-50 text-sky-700 ring-sky-200",
      icon: <Icons.Community />,
    },
  };
  const item = map[type];
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1",
        item.badgeClass
      )}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={32}
      height={32}
      className="h-8 w-8 rounded-full ring-1 ring-black/5"
    />
  );
}

function Highlights({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] leading-4 text-secondary-foreground ring-1 ring-border"
        >
          {t}
        </span>
      ))}
    </div>
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

const FALLBACK_OGP: Record<string, string> = {
  "zenn.dev": "https://zenn.dev/images/og-default.png",
  "qiita.com":
    "https://cdn.qiita.com/assets/public/ogp-default-7a9a5f1cc0a6a3d9dcd9f2cb1d6a0f77.png",
  "note.com":
    "https://assets.st-note.com/production/uploads/images/og_image.png",
};

function LinkPreviewCard({
  url,
  preview,
}: {
  url: string;
  preview?: LinkPreview;
}) {
  const site = preview?.siteName || hostFromUrl(url);
  const host = hostFromUrl(preview?.siteUrl || url);

  const favicon = host
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        host
      )}&sz=256`
    : undefined;
  const src = preview?.imageUrl || FALLBACK_OGP[host] || favicon;

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    if (el.dataset.triedFavicon !== "1" && favicon) {
      el.dataset.triedFavicon = "1";
      el.src = favicon;
    } else {
      el.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNzIwJyBoZWlnaHQ9JzQwNScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZWVlZWVlJy8+PC9zdmc+";
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block overflow-hidden rounded-xl border border-border hover:border-gray-300"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          onError={handleImgError}
          alt={preview?.title || site}
          className="w-full object-cover aspect-[16/9] bg-muted"
        />
      ) : (
        <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      )}
      <div className="px-3 py-2">
        <div className="line-clamp-2 text-sm font-medium">
          {preview?.title || url}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          From {site || hostFromUrl(url)}
        </div>
      </div>
    </a>
  );
}

function FeedRow({ activity }: { activity: ActivityItem }) {
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

        {activity.url &&
          (activity.type === "article_published" ||
            activity.postKind === "link") && (
            <LinkPreviewCard url={activity.url} preview={activity.preview} />
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
              <Avatar src={u.avatarUrl} alt={u.username} />
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

