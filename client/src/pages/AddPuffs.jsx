import { useState } from "react";
import { addPuffs } from "../api/puffs";
import { getStoredUser } from "../lib/storage";
import { useNavigate } from "react-router-dom";

export default function AddPuffs() {
  const user = getStoredUser();
  const navigate = useNavigate();
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
      setMsg("Puffs added successfully! 🎉");
      setTimeout(() => {
        setMsg("");
        navigate("/home"); // Redirect to home page after successful addition
      }, 1500);
    } catch (e) {
      setMsg(e.message || "Error adding puffs");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#FFDF33" }}
    >
      {/* Background Puff Images */}
      <div className="absolute top-20 left-8 opacity-60">
        <img
          src="/puffs.png"
          alt="puff"
          className="w-16 h-12 transform rotate-12"
        />
      </div>
      <div className="absolute top-32 right-12 opacity-50">
        <img
          src="/puffs.png"
          alt="puff"
          className="w-20 h-16 transform -rotate-15"
        />
      </div>
      <div className="absolute bottom-40 left-16 opacity-40">
        <img
          src="/egg.png"
          alt="egg"
          className="w-12 h-15 transform rotate-6"
        />
      </div>
      <div className="absolute top-80 right-8 opacity-45">
        <img
          src="/egg.png"
          alt="egg"
          className="w-14 h-17 transform -rotate-12"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-3xl text-gray-800 mb-2"
              style={{
                fontFamily: "Clash Display SemiBold",
                fontWeight: "600",
              }}
            >
              Add Puffs
            </h1>
            <p
              className="text-lg text-gray-700"
              style={{ fontFamily: "Sue Ellen Francisco Regular" }}
            >
              What did you eat today?
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Puff Type Selection */}
            <div>
              <label
                className="block text-gray-800 text-sm font-medium mb-3"
                style={{
                  fontFamily: "Clash Display SemiBold",
                  fontWeight: "500",
                }}
              >
                Puff Type
              </label>
              <select
                className="w-full bg-white bg-opacity-90 rounded-2xl px-6 py-4 text-gray-800 focus:outline-none focus:bg-opacity-100 transition-all shadow-sm"
                value={puff_type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  fontFamily: "Clash Display SemiBold",
                  fontWeight: "400",
                }}
              >
                <option value="chicken">🐔 Chicken Puff</option>
                <option value="motta">🥚 Motta Puff</option>
                <option value="meat">🥩 Meat Puff</option>
              </select>
            </div>

            {/* Quantity Input */}
            <div>
              <label
                className="block text-gray-800 text-sm font-medium mb-3"
                style={{
                  fontFamily: "Clash Display SemiBold",
                  fontWeight: "500",
                }}
              >
                Quantity
              </label>
              <input
                type="number"
                min={1}
                max={20}
                className="w-full bg-white bg-opacity-90 rounded-2xl px-6 py-4 text-gray-800 focus:outline-none focus:bg-opacity-100 transition-all shadow-sm"
                value={quantity}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{
                  fontFamily: "Clash Display SemiBold",
                  fontWeight: "400",
                }}
                placeholder="How many?"
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              style={{
                fontFamily: "Clash Display SemiBold",
                fontWeight: "500",
              }}
            >
              {loading
                ? "Adding Puffs..."
                : `Add ${quantity} ${puff_type} puff${quantity > 1 ? "s" : ""}`}
            </button>

            {/* Success/Error Message */}
            {msg && (
              <div
                className={`text-center p-4 rounded-2xl ${
                  msg.includes("successfully")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                <p
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "Clash Display SemiBold",
                    fontWeight: "500",
                  }}
                >
                  {msg}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
