import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date consistently for SSR/client hydration
 * Uses explicit locale and options to ensure matching output
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Use explicit options to ensure consistency
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  };

  // Use 'en-GB' for DD/MM/YYYY format or 'en-US' for MM/DD/YYYY
  // Using explicit locale ensures server and client render the same
  return dateObj.toLocaleDateString("en-GB", defaultOptions);
}

/**
 * Format date and time consistently for SSR/client hydration
 * Uses explicit locale and options to ensure matching output
 */
export function formatDateTime(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Use explicit options to ensure consistency
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  };

  // Using explicit locale ensures server and client render the same
  return dateObj.toLocaleString("en-GB", defaultOptions);
}

/**
 * Format number consistently for SSR/client hydration
 * Uses explicit locale to ensure matching output
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  // Using explicit locale ensures server and client render the same
  return value.toLocaleString("en-US", options);
}
