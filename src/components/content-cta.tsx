import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_HREF } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { SendIcon } from "lucide-react";

interface ContentCtaProps {
  title: string;
  description: string;
  action: string;
  className?: string;
}

export function ContentCta({
  title,
  description,
  action,
  className,
}: ContentCtaProps) {
  return (
    <div className={cn("my-12", className)}>
      <Card className="bg-background items-center gap-4 p-6 text-center">
        <h2 className="m-0 bg-(image:--text-gradient) bg-clip-text text-xl font-bold text-transparent md:text-2xl">
          {title}
        </h2>

        <p className="text-muted-foreground m-0 max-w-md text-sm">
          {description}
        </p>

        <Button variant="gradient-outline" asChild>
          <Link href={CONTACT_HREF}>
            {action}
            <SendIcon className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
