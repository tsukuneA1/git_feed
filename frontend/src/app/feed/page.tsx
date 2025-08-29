"use client";
import React from "react";
import { FeedHeader } from "@/features/feed/components/FeedHeader";
import { Feed } from "@/features/feed/Feed";
import { MOCK_ACTIVITIES } from "@/features/feed/mock";

export default function FeedPage() {
  return (
    <>
      <FeedHeader username="tsukune149" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Feed items={MOCK_ACTIVITIES} />
      </main>
    </>
  );
}

