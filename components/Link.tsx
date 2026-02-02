import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import { type AnchorHTMLAttributes } from "react";

const linkVariants = cva("inline-flex items-center gap-1 transition-colors", {
  variants: {
    variant: {
      default: "text-accent hover:text-accent-hover",
      muted: "text-muted hover:text-foreground",
      nav: "text-sm text-muted hover:text-foreground",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  VariantProps<typeof linkVariants> & {
    href: string;
  };

export default function Link({ variant, size, className, href, ...props }: LinkProps) {
  return <NextLink href={href} className={linkVariants({ variant, size, className })} {...props} />;
}
