"use client";
import React from "react";
import { Feed } from "@/features/feed/Feed";
import { MOCK_ACTIVITIES } from "@/features/feed/mock";

// v0: ページは薄いラッパー。UI/ロジックは再利用可能な Feed コンポーネントへ集約。
export default function FeedPage() {
  return (
    <main className="px-4 py-8">
      <Feed items={MOCK_ACTIVITIES} />
    </main>
  );
}

