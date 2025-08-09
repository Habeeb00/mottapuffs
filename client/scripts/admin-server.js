import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from scripts/)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 4000;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_TOKEN;

if (!supabaseUrl || !supabaseServiceKey) {
  const missing = [
    !supabaseUrl ? 'SUPABASE_URL (or VITE_SUPABASE_URL)' : null,
    !supabaseServiceKey ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
  ].filter(Boolean).join(', ');
  console.error(`Missing required env var(s): ${missing}. Create a .env in project root.`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(cors());
app.use(express.json());

function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!adminToken) {
    return res.status(500).json({ error: 'Server not configured: ADMIN_TOKEN missing' });
  }
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function parseCounts(body) {
  const allowed = ['chicken', 'motta', 'meat'];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      const value = Number(body[key]);
      if (!Number.isInteger(value) || value < 0) {
        return { error: `${key} must be a non-negative integer` };
      }
      updates[key] = value;
    }
  }
  if (Object.keys(updates).length === 0) {
    return { error: 'Provide at least one of: chicken, motta, meat' };
  }
  return { updates };
}

app.post('/api/stats/set', requireAdmin, async (req, res) => {
  const { updates, error } = parseCounts(req.body || {});
  if (error) return res.status(400).json({ error });

  const { data, error: dbError } = await supabase
    .from('stats')
    .update(updates)
    .eq('id', 1)
    .select('*')
    .single();

  if (dbError) {
    return res.status(500).json({ error: dbError.message });
  }

  return res.json({ ok: true, stats: data });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Admin server listening on http://localhost:${port}`);
}); 