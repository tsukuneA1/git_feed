"use client";
import React, { useState } from "react";

export function QnaComposer({
  users,
  onPost,
}: {
  users: string[];
  onPost: (payload: { text: string; to?: string }) => void;
}) {
  const [text, setText] = useState("");
  const [to, setTo] = useState<string | undefined>(undefined);
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 text-sm font-medium">
        質問してみる
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例: @alice さんのPR設計のポイントを教えて！"
          className="min-h-[64px] w-full resize-y rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
        <div className="flex items-center gap-2">
          <select
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || undefined)}
            className="rounded-md border border-border bg-background p-1.5 text-xs"
          >
            <option value="">宛先なし（全体）</option>
            {users.map((u) => (
              <option key={u} value={u}>
                @{u} に質問
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!text.trim()) return;
              onPost({ text: text.trim(), to });
              setText("");
              setTo(undefined);
            }}
            className="ml-auto rounded-md border border-border bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/80"
          >
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
}

export default QnaComposer;

