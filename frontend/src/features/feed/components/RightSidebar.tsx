import { useMemo } from "react";
import { FollowedRecentWork } from "@/features/feed/components/FollowedRecentWork";
import { RecommendedInterests } from "@/features/feed/components/RecommendedInterests";
import { RecommendedUsers } from "@/features/feed/components/RecommendedUsers";
import type { ActivityItem, Actor } from "@/features/feed/types";

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
    topics.forEach((t) => {
      bump(t, 3);
    });
    items.forEach((it) => {
      (it.aiHighlights ?? []).forEach((t) => {
        bump(t, 1);
      });
      (it.tags ?? []).forEach((t) => {
        bump(t, 2);
      });
      if (it.repo?.name?.toLowerCase().includes("game")) bump("Game", 1);
    });
    return Array.from(interestCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
  }, [items, topics]);

  return (
    <aside className="lg:sticky lg:top-24">
      <RecommendedInterests interests={interests} />
      <RecommendedUsers users={whoToFollow} />
      <FollowedRecentWork items={items} />
    </aside>
  );
}

export default RightSidebar;
