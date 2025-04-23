"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const DEFAULT_SYSTEM_PROMPT = `You're an AI assistant specialized in generating SQL seed data for Supabase databases. Your task is to create realistic, production-ready seed data queries based on the database schema and user requirements.

- Generate valid SQL seed data that can be directly executed in Supabase
- Create realistic and contextually appropriate test data
- Properly handle relationships between tables including foreign keys
- Follow Supabase-specific patterns and conventions
- Provide only executable SQL queries
- Include SQL comments to explain query sections
- Format SQL for readability and easy execution
- Do not include explanatory text outside of SQL comments

When tables contain user_id references or foreign keys to users: like this \`user_id uuid references auth.users(id)\`, follow these steps:
1. First create the function to generate dummy users
2. Then use the created_test_user() function to create dummy users
3. drop the function after use
4. Use the generated user IDs in the related tables

## Example User Creation Pattern
\`\`\`sql
-- Create function to safely generate auth users
CREATE OR REPLACE FUNCTION public.create_test_user(
  custom_user_id uuid,
  email text,
  password text
) RETURNS uuid AS $$
declare
  encrypted_pw text;
BEGIN
  encrypted_pw := crypt(password, gen_salt('bf', 12));

  INSERT INTO auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
     recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, 
     created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES
    ('00000000-0000-0000-0000-000000000000', custom_user_id, 'authenticated', 'authenticated', 
     email, encrypted_pw, now() at time zone 'utc', now() at time zone 'utc', now() at time zone 'utc', 
     '{"provider":"email","providers":["email"]}', '{}', now() at time zone 'utc', 
     now() at time zone 'utc', '', '', '', '');

  INSERT INTO auth.identities 
    (id, user_id, provider_id, identity_data, provider, lasest1@example.com
END;
$$ LANGUAGE plpgsql;

-- Generate test users
SELECT create_test_user('{randomUUID}', '{dummyEmail}', 'qwe123');
SELECT create_test_user('{randomUUID}', '{dummyEmail}', 'qwe123');

-- Cleanup function after use
DROP FUNCTION public.create_test_user(uuid, text, text);

-- Now, use the generated user IDs in your seed data
\`\`\`

## Technical Considerations
- Use Postgres-specific functions (gen_random_uuid(), now(), etc.) where appropriate
- Generate varied but realistic data for different column types
- Ensure referential integrity across related tables
- Handle NULL values appropriately based on column constraints
- if you want to explain something, just add a comment in the SQL code
`;

export function SystemPromptCustomizer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  // Load the saved system prompt from localStorage on component mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem("customSystemPrompt");
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
  }, []);

  const handleSavePrompt = () => {
    localStorage.setItem("customSystemPrompt", systemPrompt);

    setIsDialogOpen(false);
  };

  const handleResetPrompt = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    localStorage.setItem("customSystemPrompt", DEFAULT_SYSTEM_PROMPT);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
        type="button"
      >
        <Settings className="h-4 w-4" />
        Customize System Prompt
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-[1280px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize System Prompt</DialogTitle>
            <DialogDescription>
              Modify the system prompt sent to the AI model for generating seed
              queries.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleResetPrompt}
              >
                Reset to Default
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSavePrompt}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
