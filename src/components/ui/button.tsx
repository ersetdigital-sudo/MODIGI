import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "gold" | "outline" | "dark" | "plain";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  gold: "bg-gold text-ink hover:bg-gold-soft",
  outline: "border border-line-dark text-white hover:border-gold hover:text-gold",
  dark: "bg-ink text-white hover:bg-ink-700",
  plain: "text-ink hover:text-gold-deep",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "size-9",
};

/** Kelas tombol — dipakai juga kalau butuh styling tombol pada elemen lain. */
export function buttonClass({
  variant = "gold",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClass({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
