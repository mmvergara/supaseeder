"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

type StreamSeedQueryParams = {
  supabaseUrl: string;
  prompt: string;
  openaiKey: string;
  model: string;
  definitions: string;
  systemPrompt: string;
};

export async function streamSeedQuery({
  supabaseUrl,
  prompt,
  openaiKey,
  model = "gpt-4o-mini",
  definitions,
  systemPrompt,
}: StreamSeedQueryParams) {
  const stream = createStreamableValue();

  // Validate inputs
  if (!supabaseUrl || !prompt || !openaiKey) {
    throw new Error("Supabase URL, prompt, and OpenAI key are required");
  }

  (async () => {
    try {
      const userPrompt = `Generate a seed query for a Supabase database, here is the definitions ---${definitions}--- based on the following prompt: ${prompt}.`;
      const openai = createOpenAI({ apiKey: openaiKey });

      const { textStream } = streamText({
        model: openai(model),
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      for await (const chunk of textStream) {
        stream.update(chunk);
      }

      stream.done();
    } catch (error) {
      console.error("Error generating seed query:", error);
      stream.error(new Error("Failed to generate seed query"));
    }
  })();

  return stream.value;
}
