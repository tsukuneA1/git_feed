import React from "react";
import Link from "next/link";

export function FeedHeader({
  username,
  onLogout,
}: {
  username: string;
  onLogout?: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/feed" className="text-base font-semibold">
          Engineer Connect
        </Link>
        <div className="ml-auto hidden items-center gap-2.5 sm:flex">
          <span className="inline-block h-9 w-9 rounded-full bg-gray-200 ring-1 ring-black/5" />
          <span className="text-base font-medium text-gray-800">{username}</span>
        </div>
        <button
          className="rounded-md border px-4 py-2 text-base font-medium hover:bg-gray-50"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default FeedHeader;

