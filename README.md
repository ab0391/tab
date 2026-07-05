# The Tab — shared setup on Vercel

This version syncs across every device automatically, using a small free
Redis database (via Upstash, through Vercel's Marketplace).

## 1. Push this folder to GitHub
Create a new repo and upload these three items:
- `index.html`
- `api/entries.js`
- `package.json`

## 2. Import into Vercel
- Go to vercel.com → **Add New → Project**
- Import the repo you just created
- Framework preset: leave as **Other** — no build command needed
- Click **Deploy**

## 3. Connect the shared database (one-time)
- Open your new project in the Vercel dashboard
- Go to the **Storage** tab → **Marketplace Database** → choose **Upstash**
  (Redis) → follow the prompts to create a free database and connect it to
  this project
- Vercel automatically adds two environment variables to your project:
  `KV_REST_API_URL` and `KV_REST_API_TOKEN` — you don't need to copy these
  yourself
- Redeploy the project once (Vercel → Deployments → ⋯ → Redeploy) so the new
  environment variables take effect

## 4. Use it
Open your `yourproject.vercel.app` URL on your phone and Amy's — add an
item on one, and it'll show up on the other within a few seconds
(it checks for updates automatically every 6 seconds, and instantly whenever
you reopen the app).

## Notes
- Everyone who has the link can see and edit the tab — there's no login.
  Keep the URL between the three of you.
- If you ever see "Could not sync" at the top, it means the app can't reach
  the database — usually because step 3 hasn't been done yet, or the project
  needs a redeploy after connecting storage.
