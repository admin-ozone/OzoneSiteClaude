import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes without conflicts.
 * Used in every component — this file being missing silently breaks the entire site.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}