import { Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

interface IssueItemProps {
  id: string;
  number: number;
  title: string;
  author: string;
  createdAt: string;
  avatarUrl?: string;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export function IssueItem({
  id,
  number,
  title,
  author,
  createdAt,
  avatarUrl,
  isSelected = false,
  onSelectionChange,
}: IssueItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-border hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) =>
          onSelectionChange?.(id, checked as boolean)
        }
        className="mt-1"
      />

      <Circle className="w-4 h-4 text-green-600 fill-green-600 flex-shrink-0 mt-1" />

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground text-sm leading-tight mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>#{number}</span>
          <span>·</span>
          <span>{author}</span>
          <span>{createdAt}</span>
        </div>
      </div>

      <Avatar className="w-6 h-6 flex-shrink-0">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={author} />
        <AvatarFallback className="text-xs">
          {author.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
