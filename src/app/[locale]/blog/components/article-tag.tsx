import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

interface ArticleTagProps {
  children: React.ReactNode;
  className?: string;
}

export function ArticleTag({ children, className }: ArticleTagProps) {
  return (
    <span
      className={cn("inline-flex shrink-0 rounded-full p-px", className)}
      style={{ background: "var(--border-gradient)" }}
    >
      <Badge variant="outline" className="bg-card border-0">
        {children}
      </Badge>
    </span>
  );
}
