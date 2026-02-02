import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type InputHTMLAttributes } from "react";

const inputVariants = cva(
  "w-full rounded-lg border bg-surface text-foreground placeholder:text-muted transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-accent disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      state: {
        default: "border-border hover:border-border-hover",
        error: "border-error",
      },
    },
    defaultVariants: {
      inputSize: "md",
      state: "default",
    },
  }
);

type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ inputSize, state, className, ...props }, ref) {
  return <input ref={ref} className={inputVariants({ inputSize, state, className })} {...props} />;
});

export default Input;
