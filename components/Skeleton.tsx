import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva("animate-pulse rounded-md bg-surface", {
  variants: {
    size: {
      sm: "h-4 w-20",
      md: "h-6 w-32",
      lg: "h-8 w-48",
      full: "h-6 w-full",
      card: "h-16 w-full rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>;

export default function Skeleton({ size, className, ...props }: SkeletonProps) {
  return <div className={skeletonVariants({ size, className })} {...props} />;
}
