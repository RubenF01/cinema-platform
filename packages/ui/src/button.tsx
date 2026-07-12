import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-teal-700 text-white hover:bg-teal-800",
        variant === "secondary" &&
          "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
