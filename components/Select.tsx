import { cva, type VariantProps } from "class-variance-authority";
import { type SelectHTMLAttributes } from "react";

const selectVariants = cva(
  "w-full rounded-lg border bg-surface text-foreground transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-accent disabled:opacity-50 appearance-none cursor-pointer",
  {
    variants: {
      selectSize: {
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
      selectSize: "md",
      state: "default",
    },
  }
);

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & VariantProps<typeof selectVariants>;

export default function Select({ selectSize, state, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select className={selectVariants({ selectSize, state, className })} {...props}>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
