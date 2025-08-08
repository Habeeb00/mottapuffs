import { useEffect, useState } from 'react';
import { fetchGlobalStats, subscribeGlobalStats } from '../api/puffs';

export default function Home() {
  const [stats, setStats] = useState(null);

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
    <div className="grid grid-cols-3 gap-3 max-w-md">
      <Card label="Chicken" value={stats.chicken} />
      <Card label="Motta" value={stats.motta} />
      <Card label="Meat" value={stats.meat} />
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded border p-4 text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
} 