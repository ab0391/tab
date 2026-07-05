// Vercel Serverless Function
// Reads and writes the shared list of expense entries to an Upstash Redis
// database (provisioned via the Vercel Marketplace). Vercel automatically
// injects KV_REST_API_URL and KV_REST_API_TOKEN once the integration is added.

const REDIS_KEY = 'the-tab:entries';

async function redisGet() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const r = await fetch(`${url}/get/${REDIS_KEY}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await r.json();
  if (!data.result) return [];
  try {
    return JSON.parse(data.result);
  } catch (e) {
    return [];
  }
}

async function redisSet(entries) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const r = await fetch(`${url}/set/${REDIS_KEY}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(entries)
  });
  return r.json();
}

export default async function handler(req, res) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({
      error: 'Storage is not connected yet. Add the Upstash integration to this project in the Vercel dashboard, then redeploy.'
    });
  }

  try {
    if (req.method === 'GET') {
      const entries = await redisGet();
      return res.status(200).json(entries);
    }

    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      if (!Array.isArray(body)) {
        return res.status(400).json({ error: 'Expected an array of entries.' });
      }
      await redisSet(body);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong talking to storage.', detail: String(err) });
  }
}
