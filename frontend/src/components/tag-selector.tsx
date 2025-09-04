"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LanguageTag } from "@/components/language-tag";
import { Button } from "@/components/ui/button";

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

const tagPreferencesSchema = z.object({
  tags: z
    .array(z.string())
    .min(3, "最低3つのタグを選択してください")
    .max(5, "最大5つのタグまで選択できます"),
});

type TagPreferencesFormData = z.infer<typeof tagPreferencesSchema>;

export function TagSelector() {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<TagPreferencesFormData>({
    resolver: zodResolver(tagPreferencesSchema),
    mode: "onChange",
    defaultValues: {
      tags: [],
    },
  });

  const selectedTags = watch("tags");

  const toggleTag = (tag: string) => {
    const currentTags = selectedTags || [];
    let newTags: string[];

    if (currentTags.includes(tag)) {
      newTags = currentTags.filter((t: string) => t !== tag);
    } else if (currentTags.length < 5) {
      newTags = [...currentTags, tag];
    } else {
      return;
    }

    setValue("tags", newTags, { shouldValidate: true });
  };

  const onSubmit = async (_data: TagPreferencesFormData) => {
    try {
      const response = await fetch("/api/v1/user_tag_prefs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: selectedTags }),
      });
      if (!response.ok) {
        throw new Error("Failed to save tag preferences");
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "タグの保存に失敗しました",
      });

      console.error("Error saving tag preferences:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-black">
      <div className="w-full max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 text-balance">
              {"興味のある技術タグを選択してください"}
            </h1>
            <p className="text-gray-400 text-lg">
              {"3~5個のタグを選んでフィードをカスタマイズしましょう"}
            </p>
            <div className="mt-4">
              <span className="text-sm text-gray-400">{`選択済み: ${selectedTags?.length || 0}/5`}</span>
            </div>
            {errors.tags && (
              <p className="text-red-400 text-sm mt-2">{errors.tags.message}</p>
            )}
            {errors.root && (
              <p className="text-red-400 text-sm mt-2">{errors.root.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags?.includes(tag) || false;

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
              type="submit"
              disabled={!isValid}
              className={`p-2 rounded ${
                isValid ? "bg-gray-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {"完了"}
            </Button>
            {!isValid && selectedTags?.length !== undefined && (
              <p className="text-sm text-gray-400 mt-2">
                {"3〜5個のタグを選択してください"}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
