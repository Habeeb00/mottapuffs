import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from scripts/)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 4000;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_TOKEN;

if (!supabaseUrl || !supabaseServiceKey) {
  const missing = [
    !supabaseUrl ? "SUPABASE_URL (or VITE_SUPABASE_URL)" : null,
    !supabaseServiceKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
  ]
    .filter(Boolean)
    .join(", ");
  console.error(
    `Missing required env var(s): ${missing}. Create a .env in project root.`
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(cors());
app.use(express.json());

function requireAdmin(req, res, next) {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!adminToken) {
    return res
      .status(500)
      .json({ error: "Server not configured: ADMIN_TOKEN missing" });
  }
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function parseCounts(body) {
  const allowed = ["chicken", "motta", "meat"];
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
    return { error: "Provide at least one of: chicken, motta, meat" };
  }
  return { updates };
}

app.post("/api/stats/set", requireAdmin, async (req, res) => {
  const { updates, error } = parseCounts(req.body || {});
  if (error) return res.status(400).json({ error });

  const { data, error: dbError } = await supabase
    .from("stats")
    .update(updates)
    .eq("id", 1)
    .select("*")
    .single();

  if (dbError) {
    return res.status(500).json({ error: dbError.message });
  }

  return res.json({ ok: true, stats: data });
});

app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Puffs Meter Admin Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form-group { margin: 15px 0; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #005a87; }
            .result { margin-top: 20px; padding: 10px; border-radius: 4px; }
            .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        </style>
    </head>
    <body>
        <h1>🥟 Puffs Meter Admin Dashboard</h1>
        
        <div class="info">
            <strong>Admin Server Status:</strong> Running on http://localhost:4001<br>
            <strong>Available Endpoints:</strong>
            <ul>
                <li>POST /api/stats/set - Set puff inventory levels (requires admin token)</li>
                <li>GET /health - Health check</li>
            </ul>
        </div>

        <h2>Set Store Inventory</h2>
        <p><em>Set the current puff inventory levels. These counts will decrease as customers purchase puffs.</em></p>
        <form id="adminForm">
            <div class="form-group">
                <label for="adminToken">Admin Token:</label>
                <input type="password" id="adminToken" value="admin123" required>
            </div>
            
            <div class="form-group">
                <label for="chicken">Chicken Puffs Inventory:</label>
                <input type="number" id="chicken" min="0" placeholder="Enter chicken puff inventory count">
            </div>
            
            <div class="form-group">
                <label for="motta">Motta Puffs Inventory:</label>
                <input type="number" id="motta" min="0" placeholder="Enter motta puff inventory count">
            </div>
            
            <div class="form-group">
                <label for="meat">Meat Puffs Inventory:</label>
                <input type="number" id="meat" min="0" placeholder="Enter meat puff inventory count">
            </div>
            
            <button type="submit">Update Inventory Levels</button>
        </form>

        <div id="result"></div>

        <script>
            document.getElementById('adminForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const token = document.getElementById('adminToken').value;
                const chicken = document.getElementById('chicken').value;
                const motta = document.getElementById('motta').value;
                const meat = document.getElementById('meat').value;
                
                const payload = {};
                if (chicken) payload.chicken = parseInt(chicken);
                if (motta) payload.motta = parseInt(motta);
                if (meat) payload.meat = parseInt(meat);
                
                if (Object.keys(payload).length === 0) {
                    showResult('Please enter at least one puff count', 'error');
                    return;
                }
                
                try {
                    const response = await fetch('/api/stats/set', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        showResult('Inventory levels updated successfully! ' + JSON.stringify(result.stats), 'success');
                    } else {
                        showResult('Error: ' + result.error, 'error');
                    }
                } catch (error) {
                    showResult('Network error: ' + error.message, 'error');
                }
            });
            
            function showResult(message, type) {
                const resultDiv = document.getElementById('result');
                resultDiv.className = 'result ' + type;
                resultDiv.textContent = message;
            }
        </script>
    </body>
    </html>
  `);
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Admin server listening on http://localhost:${port}`);
});
