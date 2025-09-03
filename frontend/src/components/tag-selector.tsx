"use client";

import { useState } from "react";
import { LanguageTag } from "@/components/language-tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AVAILABLE_TAGS = [
  "ai",
  "cloud",
  "elixir",
  "python",
  "react",
  "java",
  "gaming",
  "javascript",
  ".net",
  "mobile",
  "testing",
  "tools",
  "data-science",
  "architecture",
  "crypto",
  "security",
  "database",
  "machine-learning",
  "webdev",
  "rust",
  "ruby",
  "devops",
  "open-source",
  "golang",
  "tech-news",
  "nodejs",
  "npm",
  "typescript",
];

export function TagSelector() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else if (prev.length < 5) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleComplete = () => {
    if (selectedTags.length >= 3 && selectedTags.length <= 5) {
      // ここでuser_tag_prefsに保存する処理を実装
      console.log("Selected tags:", selectedTags);
      setIsComplete(true);
    }
  };

  const canComplete = selectedTags.length >= 3 && selectedTags.length <= 5;

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {"設定完了！"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {"選択したタグがフィードに反映されます"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-card text-card-foreground rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-black">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 text-balance">
            {"興味のある技術タグを選択してください"}
          </h1>
          <p className="text-gray-400 text-lg">
            {"3〜5個のタグを選んでフィードをカスタマイズしましょう"}
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-400">{`選択済み: ${selectedTags.length}/5`}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);

            return (
              <LanguageTag
                key={tag}
                name={tag}
                isSelected={isSelected}
                onClicked={() => toggleTag(tag)}
              />
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className={cn(
              "px-8 py-3 rounded-full text-lg font-semibold transition-all duration-200",
              canComplete
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-gray-800 text-gray-400 cursor-not-allowed"
            )}
          >
            {"完了"}
          </Button>
          {!canComplete && (
            <p className="text-sm text-gray-400 mt-2">
              {"3〜5個のタグを選択してください"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
