import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api/puffs';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchLeaderboard();
      setRows(data);
    })();
  }, []);

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-3">Top Puffers</h2>
      <ul className="divide-y">
        {rows.map((r, idx) => (
          <li key={r.user_id} className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">{idx + 1}.</span>
              <span>{r.users?.full_name ?? r.user_id.slice(0, 6)}</span>
            </div>
            <div className="font-semibold">{r.total_puffs}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 