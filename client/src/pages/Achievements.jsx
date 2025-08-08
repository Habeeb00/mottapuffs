import { useEffect, useState } from 'react';
import { fetchAchievements } from '../api/puffs';
import { getStoredUser } from '../lib/storage';

export default function Achievements() {
  const user = getStoredUser();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchAchievements(user.id);
      setRows(data);
    })();
  }, [user.id]);

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-3">Achievements</h2>
      <ul className="space-y-2">
        {rows.map((a) => (
          <li key={a.id} className="rounded border p-3">
            <div className="font-medium">{a.achievement_name}</div>
            <div className="text-xs text-gray-500">{new Date(a.unlocked_at).toLocaleString()}</div>
          </li>
        ))}
        {rows.length === 0 && <p className="text-sm text-gray-500">No badges yet.</p>}
      </ul>
    </div>
  );
} 