"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import PostHogPageView from "./PostHogPageView";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!postHogKey) {
      console.error("PostHog key or host is not defined, skipping posthog.");
      return;
    }

    posthog.init(postHogKey, {
      api_host: "/ingest",
      capture_pageview: false,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
