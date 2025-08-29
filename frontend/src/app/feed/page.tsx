import React from "react";
import type { SVGProps } from "react";
import Link from "next/link";

// -------------------------
// Types
// -------------------------

type Actor = {
  username: string;
  avatarUrl: string;
};

type Repo = {
  name: string; // owner/repo
  url: string;
};

type Commit = {
  sha: string;
  message: string;
  url: string;
};

// Supported event types (extend as needed)
export type ActivityType =
  | "push"
  | "pull_request_opened"
  | "issue_opened"
  | "starred_repo"
  | "forked_repo"
  | "followed_user"
  | "release_published";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  actor: Actor;
  repo?: Repo;
  targetUser?: Actor; // for follows
  title?: string; // e.g., PR/Issue title or Release name
  commits?: Commit[]; // for push events
  createdAt: string; // ISO date
};

// -------------------------
// Mock Data (v0)
// -------------------------

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "push",
    actor: {
      username: "alice",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
    repo: { name: "alice/hackathon-w", url: "/repo/alice/hackathon-w" },
    commits: [
      {
        sha: "a1b2c3d",
        message: "feat(feed): initial feed page and mock data",
        url: "/commit/a1b2c3d",
      },
      {
        sha: "e4f5g6h",
        message: "chore: add Tailwind styles",
        url: "/commit/e4f5g6h",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago
  },
  {
    id: "2",
    type: "pull_request_opened",
    actor: {
      username: "bob",
      avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
    },
    repo: { name: "w-team/app", url: "/repo/w-team/app" },
    title: "Add OAuth GitHub login",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h ago
  },
  {
    id: "3",
    type: "issue_opened",
    actor: {
      username: "carol",
      avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    },
    repo: { name: "w-team/backend", url: "/repo/w-team/backend" },
    title: "Rubocop: Style/StringLiterals error on routes.rb",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
  },
  {
    id: "4",
    type: "starred_repo",
    actor: {
      username: "dave",
      avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    },
    repo: { name: "vercel/next.js", url: "/repo/vercel/next.js" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
  },
  {
    id: "5",
    type: "followed_user",
    actor: {
      username: "eve",
      avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    },
    targetUser: {
      username: "sae-yoshizaki",
      avatarUrl: "https://avatars.githubusercontent.com/u/123456?v=4",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10h ago
  },
  {
    id: "6",
    type: "forked_repo",
    actor: {
      username: "frank",
      avatarUrl: "https://avatars.githubusercontent.com/u/5?v=4",
    },
    repo: { name: "w-team/app", url: "/repo/w-team/app" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22h ago
  },
  {
    id: "7",
    type: "release_published",
    actor: {
      username: "grace",
      avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    },
    repo: { name: "clipvocab/api", url: "/repo/clipvocab/api" },
    title: "v0.3.0 — OAuth + Feed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1d2h ago
  },
];

// -------------------------
// Helpers
// -------------------------

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

// Minimal icons (inline SVG)
type SvgIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const Icons: Record<
  "Push" | "PR" | "Issue" | "Star" | "Fork" | "Follow" | "Release",
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
      <path fill="currentColor" d="M7 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm10 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM10 7h5a3 3 0 0 1 3 3v4h-2v-4a1 1 0 0 0-1-1h-5V7Z" />
    </svg>
  ),
  Issue: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M11 7h2v8h-2V7Zm0 10h2v2h-2v-2Zm1-15a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
    </svg>
  ),
  Star: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M12 2 9.5 8H3l5 3.8L6.5 18 12 14.6 17.5 18 16 11.8 21 8h-6.5L12 2Z" />
    </svg>
  ),
  Fork: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M7 3a3 3 0 1 0 0 6c.6 0 1.1-.2 1.6-.4A5 5 0 0 0 11 12v1.1A3 3 0 0 0 9 16a3 3 0 1 0 3 3v-5a7 7 0 0 1 4.4-6.5c.5.3 1 .5 1.6.5a3 3 0 1 0-3-3c0 .4.1.8.3 1.2A9 9 0 0 0 13 7.5V7a4 4 0 0 0-4-4ZM17 19a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM7 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm10-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-8 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
    </svg>
  ),
  Follow: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-8 8a8 8 0 1 1 16 0H4Z" />
    </svg>
  ),
  Release: (props) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden {...props}>
      <path fill="currentColor" d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.5 3.6v7.4L12 18.8l-6.5-3.6V7.8L12 4.2Z" />
    </svg>
  ),
};

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
  };

  const item = map[type];
  return (
    <span
      className={
        classNames(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1",
          item.badgeClass
        )
      }
    >
      {item.icon}
      {item.label}
    </span>
  );
}

// Avatar component
function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 w-8 rounded-full ring-1 ring-black/5"
    />
  );
}

// Feed row renderer
function FeedRow({ activity }: { activity: ActivityItem }) {
  return (
    <div className="flex gap-3 p-4 hover:bg-gray-50/80 transition-colors">
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
          {activity.type === "followed_user" && activity.targetUser && (
            <>
              <span>→</span>
              <Link
                href={`/${activity.targetUser.username}`}
                className="hover:underline"
              >
                @{activity.targetUser.username}
              </Link>
            </>
          )}
          <span className="text-gray-400">· {timeAgo(activity.createdAt)}</span>
        </div>

        {activity.title && (
          <div className="mt-2 text-[15px] leading-6">
            <Link href="#" className="font-medium hover:underline">
              {activity.title}
            </Link>
          </div>
        )}

        {activity.type === "push" && activity.commits && (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              {activity.commits.map((c) => (
                <div key={c.sha} className="flex items-center gap-3 px-3 py-2">
                  <span className="font-mono text-xs truncate w-20">
                    {c.sha}
                  </span>
                  <Link
                    href={c.url}
                    className="truncate hover:underline text-sm"
                  >
                    {c.message}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Right sidebar (Who to follow + Explore)
function RightSidebar() {
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

  const trendingRepos: Repo[] = [
    { name: "openai/openai-cookbook", url: "/repo/openai/openai-cookbook" },
    { name: "vercel/next.js", url: "/repo/vercel/next.js" },
    { name: "rails/rails", url: "/repo/rails/rails" },
  ];

  return (
    <aside className="sticky top-20 hidden w-[320px] shrink-0 lg:block">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 text-sm font-semibold">Who to follow</div>
        <div className="divide-y">
          {whoToFollow.map((u) => (
            <div key={u.username} className="flex items-center gap-3 px-4 py-3">
              <Avatar src={u.avatarUrl} alt={u.username} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{u.username}</div>
                <div className="text-xs text-gray-500">Popular developer</div>
              </div>
              <button className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-gray-50">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 text-sm font-semibold">
          Trending repositories
        </div>
        <ul className="divide-y">
          {trendingRepos.map((r) => (
            <li key={r.name} className="px-4 py-3">
              <Link href={r.url} className="font-mono hover:underline">
                {r.name}
              </Link>
              <div className="text-xs text-gray-500">TypeScript • ★ 42k</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// Top filter bar (v0 mock only)
function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <button className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50">
        All
      </button>
      <button className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50">
        Commits
      </button>
      <button className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50">
        PRs
      </button>
      <button className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50">
        Issues
      </button>
      <button className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50">
        Stars
      </button>
      <button className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50">
        Follows
      </button>
    </div>
  );
}

export default function FeedPage() {
  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Your feed</h1>
          <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
            Customize
          </button>
        </div>
        <FilterBar />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {MOCK_ACTIVITIES.map((a) => (
            <FeedRow activity={a} key={a.id} />
          ))}
        </div>

        <div className="flex items-center justify-center">
          <button className="mt-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-50">
            Load more
          </button>
        </div>
      </section>

      <RightSidebar />
    </main>
  );
}

// -------------------------
// TODOs for v1 (make it real)
// -------------------------
// 1) Replace MOCK_ACTIVITIES with data from your API (e.g., /api/v1/feed)
//    Suggested response per item:
//    {
//      id: string,
//      type: "push" | "pull_request_opened" | ...,
//      actor: { username, avatarUrl },
//      repo?: { name, url },
//      targetUser?: { username, avatarUrl },
//      title?: string,
//      commits?: [{ sha, message, url }],
//      createdAt: string
//    }
//
// 2) Add URL mappings to actual pages (repo, commit, PR, issue, user)
// 3) Implement filters with query params (?type=pr,issue,star,...)
// 4) Add infinite scroll or cursor-based pagination
// 5) Empty state + skeleton loader + error state
// 6) Accessibility: button roles, aria labels, keyboard nav
// 7) Tests (React Testing Library) + storybook stories for FeedRow
