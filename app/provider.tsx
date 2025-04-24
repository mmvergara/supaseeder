"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!postHogKey) {
      console.error("PostHog key or host is not defined, skipping posthog.");
      return;
    }

    posthog.init(postHogKey, {
      api_host: "https://supaseeder.vercel.app/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
