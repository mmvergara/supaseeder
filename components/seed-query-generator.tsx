"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { streamSeedQuery } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
import { fetchDatabaseDefinitions } from "@/lib/utils";
import {
  DEFAULT_SYSTEM_PROMPT,
  SystemPromptCustomizer,
} from "./system-prompt-dialog";
import { ModeToggle } from "./mode-toggle";

type LocalStorageData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  prompt: string;
  saveToLocalStorage: boolean;
  generationMode: string;
};

const MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

export function SeedQueryGenerator() {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveToLocalStorage, setSaveToLocalStorage] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [generationMode, setGenerationMode] = useState("prompt");
  const [fetchingDefinitions, setFetchingDefinitions] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("seedQueryGeneratorData");
    if (savedData) {
      try {
        const parsedData: LocalStorageData = JSON.parse(savedData);
        setSupabaseUrl(parsedData.supabaseUrl || "");
        setSupabaseAnonKey(parsedData.supabaseAnonKey || "");
        setPrompt(parsedData.prompt || "");
        setSaveToLocalStorage(parsedData.saveToLocalStorage || false);
        setGenerationMode(parsedData.generationMode || "prompt");
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (saveToLocalStorage) {
      const dataToSave: LocalStorageData = {
        supabaseUrl,
        supabaseAnonKey,
        prompt,
        saveToLocalStorage,
        generationMode,
      };
      localStorage.setItem(
        "seedQueryGeneratorData",
        JSON.stringify(dataToSave)
      );
    }
  }, [
    supabaseUrl,
    supabaseAnonKey,
    prompt,
    saveToLocalStorage,
    generationMode,
  ]);

  const generateSystemPrompt = () => {
    return localStorage.getItem("customSystemPrompt") || DEFAULT_SYSTEM_PROMPT;
  };

  const generateUserPrompt = (definitions: string) => {
    return `Generate a seed query for a Supabase database, here is the definitions ---${definitions}--- based on the following prompt: ${prompt}.
    If there are any tables with user_id references, make sure to create dummy users first using the create_user() function and then reference those users.`;
  };

  const handleGeneratePrompt = async () => {
    setIsLoading(true);
    setError("");
    setOutput("");
    setFetchingDefinitions(true);

    try {
      const definitions = await fetchDatabaseDefinitions({
        SUPABASE_ANON_KEY: supabaseAnonKey,
        SUPABASE_URL: supabaseUrl,
      });

      setFetchingDefinitions(false);

      const systemPrompt = generateSystemPrompt();
      const userPrompt = generateUserPrompt(definitions);

      const promptOutput = `System prompt:
\`\`\`
${systemPrompt}
\`\`\`

User prompt:
\`\`\`
${userPrompt}
\`\`\`
`;

      setOutput(promptOutput);
    } catch (err) {
      setError(
        "Failed to fetch database definitions. Please check your Supabase credentials."
      );
      toast.error("Failed to fetch database definitions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuery = async () => {
    setIsLoading(true);
    setError("");
    setOutput("");
    setFetchingDefinitions(true);

    try {
      let definitions = "";
      try {
        definitions = await fetchDatabaseDefinitions({
          SUPABASE_ANON_KEY: supabaseAnonKey,
          SUPABASE_URL: supabaseUrl,
        });
        setFetchingDefinitions(false);
      } catch (err) {
        console.error("Error fetching database definitions:", err);
        setFetchingDefinitions(false);
        setError(
          "Failed to fetch database definitions. Please check your Supabase URL and Anon Key."
        );
        toast.error("Failed to fetch database definitions.");
        setIsLoading(false);
        return;
      }

      const systemPrompt = generateSystemPrompt();

      const streamableValue = await streamSeedQuery({
        supabaseUrl,
        prompt,
        openaiKey,
        model: selectedModel,
        definitions,
        systemPrompt: systemPrompt,
      });

      setOutput("");

      for await (const chunk of readStreamableValue(streamableValue)) {
        setOutput((prev) => prev + chunk);
      }
    } catch (err) {
      console.error("Error in seed query generation:", err);
      setError("Failed to generate seed query. Please try again.");
      toast.error("Failed to generate seed query.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (generationMode === "prompt") {
      handleGeneratePrompt();
    } else {
      handleGenerateQuery();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("seedQueryGeneratorData");
    setSaveToLocalStorage(false);
    setSupabaseUrl("");
    setSupabaseAnonKey("");
    setPrompt("");
    toast.info("Local storage cleared.");
  };

  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen max-h-screen">
      <section className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <header className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-purple-500 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              SupaSeeder
            </h1>
            <ModeToggle />
          </header>
          <p className="text-gray-500 mb-8">
            Generate seed queries for your Supabase database using AI
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure your generator settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase URL</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-anon-key">Supabase Anon Key</Label>
                  <Input
                    id="supabase-anon-key"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what kind of seed data you need (e.g., '10 users with profiles and 5 posts each')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <Tabs
                  value={generationMode}
                  onValueChange={setGenerationMode}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="prompt">Get AI Prompt</TabsTrigger>
                    <TabsTrigger value="direct">
                      Generate with OpenAI
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="prompt" className="space-y-4">
                    <div className="rounded-md p-4 text-sm">
                      <p>
                        This option will provide you with AI prompts that you
                        can copy and paste into ChatGPT, Claude, Gemini, or
                        other AI assistants.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="direct" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openai-key">OpenAI API Key</Label>
                      <Input
                        id="openai-key"
                        type="password"
                        placeholder="sk-..."
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        required={generationMode === "direct"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model-select">AI Model</Label>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="save-local-storage"
                    checked={saveToLocalStorage}
                    onCheckedChange={setSaveToLocalStorage}
                  />
                  <Label htmlFor="save-local-storage">
                    Save settings to local storage{" "}
                    {generationMode === "direct" && "(API key is not saved)"}
                  </Label>
                </div>
                <SystemPromptCustomizer />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {fetchingDefinitions
                          ? "Fetching schema..."
                          : generationMode === "prompt"
                          ? "Generating Prompt..."
                          : "Generating Query..."}
                      </>
                    ) : generationMode === "prompt" ? (
                      "Get AI Prompt"
                    ) : (
                      "Generate Seed Query"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearLocalStorage}
                    title="Clear saved settings"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto bg-card/60">
        <div className="max-w-xl mx-auto">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {generationMode === "prompt" ? "AI Prompt" : "Generated Query"}
            </h2>
            {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
            {output && (
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </header>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Card className="p-4 rounded-md min-h-[300px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center g-opacity-80">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">
                    {fetchingDefinitions
                      ? "Fetching database schema..."
                      : generationMode === "prompt"
                      ? "Generating AI prompt..."
                      : "Generating seed query..."}
                  </p>
                </div>
              </div>
            )}

            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {output ||
                (!error && !isLoading && "Your output will appear here.")}
            </pre>
          </Card>
        </div>
      </section>
    </main>
  );
}
