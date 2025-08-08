import { useEffect, useState } from "react";
import { fetchGlobalStats, subscribeGlobalStats } from "../api/puffs";
import { getStoredUser } from "../lib/storage";

export default function Home() {
  const [stats, setStats] = useState(null);
  const user = getStoredUser();

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const s = await fetchGlobalStats();
      setStats(s);
      cleanup = await subscribeGlobalStats(async () => {
        const updated = await fetchGlobalStats();
        setStats(updated);
      });
    })();
    return () => cleanup();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="max-w-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">🏪 Current Inventory</h2>
        <p className="text-sm text-gray-500">Welcome, {user?.full_name || 'User'}!</p>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Live puff counts - updates automatically when purchases are made
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Card label="🐔 Chicken" value={stats.chicken} />
        <Card label="🥟 Motta" value={stats.motta} />
        <Card label="🥩 Meat" value={stats.meat} />
      </div>
    </div>
  );
}

function Card({ label, value }) {
  const isLowStock = value < 10;
  const isOutOfStock = value === 0;

  return (
    <div
      className={`rounded border p-4 text-center ${
        isOutOfStock
          ? "border-red-300 bg-red-50"
          : isLowStock
          ? "border-yellow-300 bg-yellow-50"
          : "border-gray-200"
      }`}
    >
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className={`text-2xl font-semibold ${
          isOutOfStock
            ? "text-red-600"
            : isLowStock
            ? "text-yellow-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </div>
      {isOutOfStock && (
        <div className="text-xs text-red-600 mt-1">Out of Stock</div>
      )}
      {isLowStock && !isOutOfStock && (
        <div className="text-xs text-yellow-600 mt-1">Low Stock</div>
      )}
    </div>
  );
}
