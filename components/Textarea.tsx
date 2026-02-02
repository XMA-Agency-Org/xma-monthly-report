import { cva, type VariantProps } from "class-variance-authority";
import { type TextareaHTMLAttributes } from "react";

const textareaVariants = cva(
  "w-full rounded-lg border bg-surface text-foreground placeholder:text-muted transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-accent disabled:opacity-50 resize-y",
  {
    variants: {
      state: {
        default: "border-border hover:border-border-hover",
        error: "border-error",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaVariants>;

export default function Textarea({ state, className, ...props }: TextareaProps) {
  return <textarea className={textareaVariants({ state, className })} {...props} />;
}
