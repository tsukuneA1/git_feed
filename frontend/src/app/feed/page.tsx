"use client";
import { GitPullRequest } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { IssueItem } from "@/components/issue-item";
import { FeedHeader } from "@/features/feed/components/FeedHeader";
import { getTokens } from "@/services/auth";
import type {
  EventPayload,
  FeedResponse,
  GitHubEvent,
  IssuePayload,
  ParsedGitHubEvent,
  PullRequestPayload,
} from "@/types/github-events";

function convertArrayToObject(arr: unknown): EventPayload {
  if (!Array.isArray(arr)) return arr as EventPayload;

  const obj: Record<string, unknown> = {};
  for (const item of arr) {
    if (Array.isArray(item) && item.length >= 2) {
      const [key, value] = item;
      if (Array.isArray(value) && Array.isArray(value[0])) {
        obj[key as string] = convertArrayToObject(value);
      } else {
        obj[key as string] = value;
      }
    }
  }
  return obj as unknown as EventPayload;
}

function PullRequestItem({ event }: { event: ParsedGitHubEvent }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP");
  };

  const payload = event.payload as PullRequestPayload;

  return (
    <div className="p-3 border-b border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <GitPullRequest className="w-4 h-4 text-purple-600 fill-purple-600 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-tight mb-1">
            {payload?.pull_request?.title || "Pull Request merged"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <a
              href={`https://github.com/${event.repo?.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {event.repo?.name}
            </a>
            <span>·</span>
            <a
              href={`https://github.com/${event.repo?.name}/pull/${payload?.pull_request?.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              #{payload?.pull_request?.number}
            </a>
            <span>·</span>
            <a
              href={`https://github.com/${event.actor?.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {event.actor?.login}
            </a>
            <span>·</span>
            <span>{formatDate(event.created_at)}</span>
          </div>

          {payload.pull_request?.body && (
            <div className="text-xs text-muted-foreground leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown>{payload.pull_request.body}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [feedData, setFeedData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const tokens = getTokens();

        if (!tokens) {
          setError("認証が必要です");
          return;
        }

        const response = await fetch("http://localhost:3000/api/v1/feed", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as FeedResponse;
        setFeedData(data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP");
  };

  if (loading) {
    return (
      <>
        <FeedHeader username="tsukune149" />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading feed...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <FeedHeader username="tsukune149" />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <FeedHeader username="tsukune149" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Feed</h2>
          </div>

          {feedData?.feed_items && feedData.feed_items.length > 0 ? (
            <>
              <div className="p-3 border-b border-border bg-blue-50">
                <div className="text-sm text-blue-700">
                  取得したイベント: {feedData?.feed_items?.length || 0}件
                </div>
              </div>
              {feedData?.feed_items.map((event: GitHubEvent) => {
                const payload = convertArrayToObject(event.payload);
                const parsedEvent: ParsedGitHubEvent = { ...event, payload };

                if (
                  event.type === "IssuesEvent" &&
                  "action" in payload &&
                  payload.action === "opened"
                ) {
                  const issuePayload = payload as IssuePayload;
                  return (
                    <IssueItem
                      key={event.id}
                      issueNumber={issuePayload.issue?.number || 0}
                      title={issuePayload.issue?.title || "No title"}
                      author={event.actor.login}
                      createdAt={formatDate(event.created_at)}
                      authorAvatarUrl={event.actor.avatar_url}
                      body={issuePayload.issue?.body}
                      repoName={event.repo?.name}
                    />
                  );
                }

                if (
                  event.type === "PullRequestEvent" &&
                  "action" in payload &&
                  payload.action === "closed" &&
                  "pull_request" in payload &&
                  (payload as PullRequestPayload).pull_request?.merged
                ) {
                  return <PullRequestItem key={event.id} event={parsedEvent} />;
                }

                return (
                  <div
                    key={event.id}
                    className="p-3 border-b border-border bg-yellow-50"
                  >
                    <div className="text-sm text-gray-600">
                      <strong>Debug - Unhandled event:</strong>
                    </div>
                    <div className="text-xs text-gray-500">
                      Type: {event.type} | Action:{" "}
                      {"action" in payload ? payload.action || "N/A" : "N/A"}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              フィードにイベントがありません
            </div>
          )}
        </div>
      </main>
    </>
  );
}
