"use client";
import React from "react";
import { Feed } from "@/features/feed/Feed";
import { MOCK_ACTIVITIES } from "@/features/feed/mock";

// 非ルートのPlayground。ページを作らずにUI確認や型/propsの共有に使う。
export default function FeedPlayground() {
  return (
    <div className="p-4">
      <Feed items={MOCK_ACTIVITIES} />
    </div>
  );
}

