import { Circle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IssueItemProps {
  issueNumber: number;
  title: string;
  author: string;
  createdAt: string;
  authorAvatarUrl?: string;
  body?: string;
  repoName?: string;
}

export function IssueItem({
  issueNumber,
  title,
  author,
  createdAt,
  authorAvatarUrl,
  body,
  repoName,
}: IssueItemProps) {
  return (
    <div className="p-3 border-b border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <Circle className="w-4 h-4 text-green-600 fill-green-600 flex-shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-tight mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {repoName && (
              <>
                <a
                  href={`https://github.com/${repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {repoName}
                </a>
                <span>·</span>
              </>
            )}
            <a
              href={
                repoName
                  ? `https://github.com/${repoName}/issues/${issueNumber}`
                  : `https://github.com/issues/${issueNumber}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              #{issueNumber}
            </a>
            <span>·</span>
            <a
              href={`https://github.com/${author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {author}
            </a>
            <span>·</span>
            <span>{createdAt}</span>
          </div>

          {body && (
            <div className="text-xs text-muted-foreground leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          )}
        </div>

        <Avatar className="w-6 h-6 flex-shrink-0">
          <AvatarImage
            src={authorAvatarUrl || "/placeholder.svg"}
            alt={author}
          />
          <AvatarFallback className="text-xs">
            {author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
