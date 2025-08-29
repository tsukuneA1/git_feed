import type { ActivityItem } from "./types";

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "100",
    type: "article_published",
    actor: {
      username: "alice",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
    title: "Next.js 15 と Tailwind v4 で作る高速UI",
    url: "https://zenn.dev/sosukesuzuki/articles/5146c84504445f",
    tags: ["Next.js", "Tailwind", "設計"],
    aiHighlights: ["執筆", "設計"],
    summary:
      "App Router と新しいバンドル最適化、Tailwind v4 の新ディレクティブ活用までを実例で解説。",
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
  {
    id: "101",
    type: "package_published",
    actor: {
      username: "w-team",
      avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
    },
    repo: { name: "w-team/ui-kit", url: "/repo/w-team/ui-kit" },
    title: "@wteam/ui-kit",
    version: "0.8.0",
    url: "https://www.npmjs.com/package/@wteam/ui-kit",
    aiHighlights: ["Design System"],
    summary:
      "Button/Sheet/Tabs を追加。Radix 依存を削減してツリーシェイク率を向上。",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "102",
    type: "site_deployed",
    actor: {
      username: "grace",
      avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    },
    repo: { name: "clipvocab/web", url: "/repo/clipvocab/web" },
    title: "Production deploy — clipvocab.app",
    url: "https://clipvocab.app",
    aiHighlights: ["Vercel", "Deploy"],
    summary: "画像最適化とEdge Cache調整でTTFBが22%改善。ダークモードも適用。",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "103",
    type: "release_published",
    actor: {
      username: "grace",
      avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    },
    repo: { name: "clipvocab/api", url: "/repo/clipvocab/api" },
    title: "v0.3.0 — OAuth + Feed",
    url: "/repo/clipvocab/api/releases/v0.3.0",
    aiHighlights: ["OAuth", "API"],
    summary:
      "OAuthフロー刷新。Feed APIのカーソルページング、Webhooks再試行を追加。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "104",
    type: "directory_shared",
    actor: {
      username: "you",
      avatarUrl: "https://avatars.githubusercontent.com/u/10001?v=4",
    },
    title: "完成ディレクトリ『feed-v0』を共有しました",
    url: "/share/feed-v0",
    aiHighlights: ["成果物", "UI"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  // Community
  {
    id: "c-201",
    type: "community_posted",
    actor: {
      username: "alice",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
    community: { slug: "nextjs", name: "Next.js" },
    postKind: "question",
    title: "App Router のキャッシュ戦略、ISRと組み合わせる最適解は？",
    summary:
      "動的セグメントとEdge環境のときの再検証設計について議論したいです。",
    tags: ["Next.js", "Cache", "Edge"],
    commentsCount: 12,
    upvotes: 36,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "c-202",
    type: "community_posted",
    actor: {
      username: "grace",
      avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    },
    community: { slug: "ai", name: "AI" },
    postKind: "showcase",
    title: "完成ディレクトリ『feed-v0』を公開しました（設計メモ付き）",
    summary: "Artifacts/Workの二列構成とPushロールアップ、Q&A統合のサンプル。",
    tags: ["Design", "UI", "Next.js"],
    commentsCount: 5,
    upvotes: 58,
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
  {
    id: "c-203",
    type: "community_posted",
    actor: {
      username: "you",
      avatarUrl: "https://avatars.githubusercontent.com/u/10001?v=4",
    },
    community: { slug: "ai", name: "AI" },
    postKind: "link",
    title: "LLM Prompt Engineering Best Practices",
    url: "https://example.com/llm-prompts",
    preview: {
      title: "LLM Prompt Engineering Best Practices",
      imageUrl:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
      siteName: "Example Blog",
      siteUrl: "https://example.com",
    },
    tags: ["AI", "Prompt"],
    commentsCount: 3,
    upvotes: 21,
    createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
  },
  // Followed users' work
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
    aiHighlights: ["TypeScript", "丁寧さ", "継続力"],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "2",
    type: "pull_request_opened",
    actor: {
      username: "rails",
      avatarUrl: "https://avatars.githubusercontent.com/u/4223?v=4",
    },
    repo: { name: "w-team/app", url: "/repo/w-team/app" },
    title: "Add OAuth GitHub login",
    aiHighlights: ["OAuth", "NextAuth", "Security"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "3",
    type: "issue_opened",
    actor: {
      username: "vercel",
      avatarUrl: "https://avatars.githubusercontent.com/u/14985020?v=4",
    },
    repo: { name: "w-team/backend", url: "/repo/w-team/backend" },
    title: "Rubocop: Style/StringLiterals error on routes.rb",
    aiHighlights: ["Ruby on Rails", "静的解析"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "8",
    type: "qa_posted",
    actor: {
      username: "you",
      avatarUrl: "https://avatars.githubusercontent.com/u/10001?v=4",
    },
    targetUser: {
      username: "alice",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
    title: "Next.js の /feed 設計で、PR/Issue/Star の混在をどう整えますか？",
    aiHighlights: ["質問", "設計"],
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
];
