# 🪴 SupaSeeder

Generate realistic **seed queries** for your **Supabase** database using **AI**. This tool analyzes your DB schema and generates seed data with SQL or prompts for GPT-based tools like ChatGPT.

## ⚙️ How It Works

1. **Provide Supabase URL & Anon Key**  
   Connects to your database and reads the schema.

2. **Write a prompt**  
   Describe the data you want (e.g. _"10 users with 5 posts each"_).

3. **Pick mode**

   - **Prompt** – generates a ChatGPT-style prompt using your schema
   - **Direct** – uses OpenAI API to generate SQL seed queries instantly

4. **Get SQL output**  
   Copy & paste to your SQL editor or Supabase SQL Runner.

## 🛠️ Setup Locally

### Method 2: Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/username/supaseeder.git
   cd supaseeder
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by @mmvergara
