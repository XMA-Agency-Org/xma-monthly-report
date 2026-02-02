import { cva, type VariantProps } from "class-variance-authority";
import { type LabelHTMLAttributes } from "react";

const labelVariants = cva("block text-sm font-medium", {
  variants: {
    color: {
      default: "text-muted",
      foreground: "text-foreground",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>;

export default function Label({ color, className, ...props }: LabelProps) {
  return <label className={labelVariants({ color, className })} {...props} />;
}
