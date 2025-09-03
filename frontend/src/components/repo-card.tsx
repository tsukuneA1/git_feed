import { GitBranch, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RepoCardProps {
  name: string; // レポジトリ名
  description: string; // レポジトリの説明
  language: string; // 使用言語
  stars: number; // スター数
  forks: number; // フォーク数
}

export const RepoCard = ({
  name,
  description,
  language,
  stars,
  forks,
}: RepoCardProps) => {
  return (
    <Card className="w-full hover:shadow-md transition rounded-2xl mb-4 border bg-gray-900 text-white">
      <CardContent className="p-4 space-y-3">
        {/* レポジトリ名 */}
        <h2 className="text-lg font-semibold text-blue-400">{name}</h2>

        {/* 説明 */}
        <p className="text-sm text-gray-400">{description}</p>

        {/* 言語 + Star + Fork */}
        <div className="flex items-center gap-6 text-sm text-gray-300 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span>{language}</span>
          </div>

          <div className="flex items-center gap-1">
            <Star size={16} />
            <span>{stars.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <GitBranch size={16} />
            <span>{forks.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
