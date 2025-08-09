import { useState } from 'react';
import { addPuffs } from '../api/puffs';
import { getStoredUser } from '../lib/storage';

export default function AddPuffs() {
  const user = getStoredUser();
  const [puff_type, setType] = useState('chicken');
  const [quantity, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await addPuffs({ user_id: user.id, puff_type, quantity });
      setMsg('Added!');
    } catch (e) {
      setMsg(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3">
      <select className="w-full border rounded p-2 bg-transparent" value={puff_type} onChange={(e)=>setType(e.target.value)}>
        <option value="chicken">Chicken</option>
        <option value="motta">Motta</option>
        <option value="meat">Meat</option>
      </select>
      <input type="number" min={1} className="w-full border rounded p-2 bg-transparent" value={quantity} onChange={(e)=>setQty(Number(e.target.value))} />
      <button disabled={loading} className="w-full rounded bg-green-600 text-white py-2 disabled:opacity-50">{loading ? 'Saving...' : 'Add Puffs'}</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
