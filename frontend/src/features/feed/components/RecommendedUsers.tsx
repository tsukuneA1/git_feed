import { Avatar } from "@/features/feed/components/Avatar";
import type { Actor } from "@/features/feed/types";

export function RecommendedUsers({
  users,
  onFollow,
}: {
  users: Actor[];
  onFollow?: (u: Actor) => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold">おすすめユーザー</div>
      <ul className="mt-2 space-y-2">
        {users.map((u) => (
          <li key={u.username} className="flex items-center gap-3">
            <Avatar src={u.avatarUrl} alt={u.username} />
            <div className="text-sm font-medium">@{u.username}</div>
            <button
              type="button"
              className="ml-auto rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              onClick={() => onFollow?.(u)}
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
