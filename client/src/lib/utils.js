import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl() {
  let url =
    import.meta.env.VITE_SITE_URL ?? // Set this to your site URL in production env.
    import.meta.env.VITE_VERCEL_URL ?? // Automatically set by Vercel.
    window.location.origin; // Fallback for local development.

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  return url.replace(/\/$/, '');
}
