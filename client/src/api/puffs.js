import { supabase } from "../lib/supabaseClient";

export async function fetchGlobalStats() {
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function subscribeGlobalStats(onChange) {
  const channel = supabase
    .channel("stats_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "stats" },
      (payload) => {
        onChange(payload);
      }
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export async function addPuffs({ user_id, puff_type, quantity }) {
  // Check current inventory before allowing purchase
  const currentStats = await fetchGlobalStats();
  const currentCount = currentStats[puff_type] || 0;

  if (currentCount < quantity) {
    throw new Error(
      `Not enough ${puff_type} puffs in stock! Available: ${currentCount}, Requested: ${quantity}`
    );
  }

  const { data, error } = await supabase
    .from("puffs_log")
    .insert({ user_id, puff_type, quantity })
    .select("*")
    .single();
  if (error) throw error;

  // Decrease global inventory when user purchases puffs
  try {
    await supabase.rpc("decrement_stats", { puff_type, qty: quantity });
  } catch (_) {
    // ignore; you can enable the DB function later
  }

  return data;
}

export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select(
      "user_id, total_puffs, chicken, motta, meat, last_update, users(full_name)"
    )
    .order("total_puffs", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function fetchAchievements(user_id) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user_id)
    .order("unlocked_at", { ascending: false });
  if (error) throw error;
  return data;
}
