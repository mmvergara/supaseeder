<h1 align="center">🪴 - SupaSeeder - 🪴</h1>

<p align="center">
Using AI to Generate Seed Data for Supabase
</p>

Every developer knows the importance of having good seed data for fast testing and development. Manually crafting SQL queries to populate your database with realistic data can be tedious and error-prone, especially when dealing with complex relationships between tables.

SupaSeeder connects to your Supabase instance, extracts the database schema, then you can either generate SQL insert statements or optimized prompts to use with any AI model to generate the seed data you need.

### Try it out online at [supaseeder.vercel.app](https://supaseeder.vercel.app) 🔥

## ⚙️ How It Works

1. **Provide Supabase URL & Anon Key**  
   Connects to your database and reads the schema.

2. **Write a prompt**  
   Describe the data you want (e.g. _"10 users with 5 posts each"_).

3. **Pick mode**

- **Prompt Mode**: Get optimized prompts to use with any AI (ChatGPT, Claude, etc.)
- **Direct Mode**: Get complete SQL queries generated using OpenAI

4. **Get SQL output**  
   Copy & paste to your SQL editor or Supabase SQL Runner.

## 🛠️ Setup Locally

### Method 2: Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/mmvergara/supaseeder.git
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
