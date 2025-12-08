import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg hover:shadow-xl hover:shadow-purple-500/30",
        destructive:
          "bg-linear-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40",
        outline:
          "border-2 bg-transparent shadow-sm hover:bg-linear-to-r hover:from-purple-50 hover:via-pink-50 hover:to-orange-50 dark:hover:from-purple-950/30 dark:hover:via-pink-950/30 dark:hover:to-orange-950/30 border-border hover:border-purple-400/50 dark:hover:border-purple-500/50",
        secondary:
          "bg-linear-to-r from-orange-100 via-rose-100 to-pink-100 dark:from-orange-900/40 dark:via-rose-900/40 dark:to-pink-900/40 text-foreground hover:opacity-90 shadow-sm",
        ghost:
          "hover:bg-linear-to-r hover:from-purple-50 hover:via-pink-50 hover:to-orange-50 dark:hover:from-purple-950/30 dark:hover:via-pink-950/30 dark:hover:to-orange-950/30 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline font-semibold",
        glow: "bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 text-white animate-pulse-slow shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-xl px-7 has-[>svg]:px-5 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
