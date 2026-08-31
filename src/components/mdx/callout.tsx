import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  OctagonAlertIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

const calloutVariants = cva(
  "my-6 flex gap-3 rounded-lg border-l-2 px-4 py-3 text-sm [&>p]:m-0",
  {
    variants: {
      type: {
        info: "border-l-secondary bg-secondary/5",
        warning: "border-l-yellow-500 bg-yellow-500/5",
        success: "border-l-emerald-500 bg-emerald-500/5",
        danger: "border-l-destructive bg-destructive/5",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

const CALLOUT_ICONS = {
  info: InfoIcon,
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
  danger: OctagonAlertIcon,
} as const;

interface CalloutProps extends VariantProps<typeof calloutVariants> {
  className?: string;
  children: ReactNode;
}

export function Callout({ type, className, children }: CalloutProps) {
  const Icon = CALLOUT_ICONS[type ?? "info"];

  return (
    <aside className={cn(calloutVariants({ type }), className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </aside>
  );
}
