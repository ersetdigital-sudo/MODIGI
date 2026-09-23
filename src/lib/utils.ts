import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan class Tailwind dengan aman (class yang konflik akan di-resolve). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
