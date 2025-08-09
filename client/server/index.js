import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_TOKEN;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-app-name.vercel.app"] // Replace with your actual domain
        : ["http://localhost:5173", "http://localhost:3000"],
  })
);
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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Export the Express app for Vercel
export default app;

// For local development and other platforms
if (process.env.NODE_ENV !== "production" || process.env.RAILWAY_ENVIRONMENT) {
  const port = process.env.PORT || 4000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Admin server listening on http://0.0.0.0:${port}`);
  });
}
