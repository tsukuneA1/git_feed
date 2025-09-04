// GitHub APIから返されるイベントの型定義

export interface GitHubActor {
  id: number;
  login: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  url: string;
}

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  html_url: string;
  user: GitHubActor;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string;
  html_url: string;
  user: GitHubActor;
  merged: boolean;
}

// Payload構造（配列形式とオブジェクト形式の両方をサポート）
export interface IssuePayload {
  action: "opened" | "closed";
  issue: GitHubIssue;
}

export interface PullRequestPayload {
  action: "opened" | "closed";
  pull_request: GitHubPullRequest;
}

export type EventPayload = IssuePayload | PullRequestPayload;

// メインのイベント型
export interface GitHubEvent {
  id: string;
  type: "IssuesEvent" | "PullRequestEvent";
  repo: GitHubRepo;
  actor: GitHubActor;
  created_at: string;
  payload: unknown[]; // 配列形式のpayload
}

// 変換後のイベント型
export interface ParsedGitHubEvent {
  id: string;
  type: "IssuesEvent" | "PullRequestEvent";
  repo: GitHubRepo;
  actor: GitHubActor;
  created_at: string;
  payload: EventPayload;
}

// API レスポンスの型
export interface FeedResponse {
  feed_items: GitHubEvent[];
}
