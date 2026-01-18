import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-muted text-foreground hover:bg-muted/80",
        "gradient-primary":
          "bg-linear-to-r from-secondary-foreground to-secondary-foreground/0 rounded-full text-foreground",
        "gradient-outline": [
          // Base settings
          "relative isolate overflow-hidden bg-transparent text-foreground border border-transparent",

          // Layer 1: Background Base
          "before:absolute before:inset-0 before:-z-20 before:[background:var(--outline-gradient)]",

          // Layer 2: Background Hover
          "after:absolute after:inset-0 after:-z-10",
          "after:[background:var(--outline-gradient-hover)]",
          "after:opacity-0 after:transition-opacity after:duration-300",
          "hover:after:opacity-100",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 gap-1.5 px-4",
        lg: "h-12 px-6",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  if (variant === "gradient-outline") {
    return (
      <span
        className={cn("relative inline-flex rounded-lg", className)}
        style={{ background: "var(--border-gradient)" }}
      >
        <Comp
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={cn(buttonVariants({ variant, size }))}
          {...props}
        />
      </span>
    );
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
