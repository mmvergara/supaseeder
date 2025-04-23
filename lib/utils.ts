import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchDatabaseDefinitions = async ({
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
}: {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_ANON_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data = await response.json();
  const rawDefinitions = data.definitions as object;
  return JSON.stringify(rawDefinitions).replace(/\s+/g, "");
};
