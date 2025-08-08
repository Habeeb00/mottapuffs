import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPuffs } from "../api/puffs";
import { getStoredUser } from "../lib/storage";

export default function AddPuffs() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [puff_type, setType] = useState("chicken");
  const [quantity, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await addPuffs({ user_id: user.id, puff_type, quantity });
      setMsg("Added! Redirecting to leaderboard.....");

      // Redirect to home after successful purchase
      setTimeout(() => {
        navigate("/leaderboard");
      }, 1000); // Small delay to show success message
    } catch (e) {
      setMsg(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">🛒 Purchase Puffs</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Puff Type:</label>
          <select
            className="w-full border rounded p-2 bg-transparent"
            value={puff_type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="chicken">🐔 Chicken</option>
            <option value="motta">🥟 Motta</option>
            <option value="meat">🥩 Meat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity:</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded p-2 bg-transparent"
            value={quantity}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded bg-green-600 text-white py-2 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Purchase Puffs"}
        </button>
        {msg && (
          <p
            className={`text-sm p-2 rounded ${
              msg.includes("Error") || msg.includes("Not enough")
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
