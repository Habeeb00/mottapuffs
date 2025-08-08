const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export async function setPuffCounts({ chicken, motta, meat }, adminToken) {
  const payload = {};
  if (chicken !== undefined) payload.chicken = chicken;
  if (motta !== undefined) payload.motta = motta;
  if (meat !== undefined) payload.meat = meat;

  const res = await fetch(`${SERVER_URL}/api/stats/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }
  return res.json();
} 