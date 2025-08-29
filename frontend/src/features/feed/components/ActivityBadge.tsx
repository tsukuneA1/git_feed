import type { JSX } from "react";
import type { ActivityType } from "@/features/feed/types";
import { Icons } from "@/features/feed/components/Icons";

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function ActivityBadge({ type }: { type: ActivityType }) {
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

