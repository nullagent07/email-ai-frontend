import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to combine Tailwind classes.
 * 
 * @param inputs - Variable number of class values to be merged.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
