export type Actor = {
  username: string;
  avatarUrl: string;
};

export type Repo = {
  name: string; // owner/repo
  url: string;
};

export type Community = {
  slug: string;
  name: string;
};

export type Commit = {
  sha: string;
  message: string;
  url: string;
};

export type LinkPreview = {
  title: string;
  imageUrl?: string;
  siteName?: string;
  siteUrl?: string;
};

export type ActivityType =
  | "push"
  | "pull_request_opened"
  | "issue_opened"
  | "starred_repo"
  | "forked_repo"
  | "followed_user"
  | "release_published"
  | "qa_posted"
  | "article_published"
  | "package_published"
  | "site_deployed"
  | "repo_tagged"
  | "milestone_reached"
  | "directory_shared"
  | "community_posted"
  | "community_commented";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  actor: Actor;
  repo?: Repo;
  targetUser?: Actor;
  title?: string;
  url?: string;
  version?: string;
  commits?: Commit[];
  aiHighlights?: string[];
  question?: string;
  tags?: string[];
  summary?: string;
  community?: Community;
  postKind?: "question" | "showcase" | "help" | "link";
  commentsCount?: number;
  upvotes?: number;
  preview?: LinkPreview;
  createdAt: string;
};

export type FeedProps = {
  items: ActivityItem[];
  defaultAudience?: "recommended" | "following";
  defaultQuery?: string;
  onPostQ?: (payload: { text: string; to?: string }) => void;
};

