import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLeaderboard } from "../api/puffs";
import { getStoredUser, clearStoredUser } from "../lib/storage";

// Bottom Navigation Component
function BottomNavigation({ className = "" }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <div className="flex justify-center gap-2 px-4">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-1 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full text-sm font-medium transition-all"
        style={{ fontFamily: "Clash Display SemiBold", fontWeight: "500" }}
      >
        <span className="text-sm">🏠</span>
        Home
      </button>
      <button
        onClick={() => navigate("/leaderboard")}
        className="flex items-center gap-1 px-3 py-2 bg-gray-800 text-white rounded-full text-sm font-medium transition-all"
        style={{ fontFamily: "Clash Display SemiBold", fontWeight: "500" }}
      >
        <span className="text-sm">🏆</span>
        Board
      </button>
      <button
        onClick={() => navigate("/achievements")}
        className="flex items-center gap-1 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full text-sm font-medium transition-all"
        style={{ fontFamily: "Clash Display SemiBold", fontWeight: "500" }}
      >
        <span className="text-sm">🏅</span>
        Awards
      </button>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-1 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full text-sm font-medium transition-all"
        style={{ fontFamily: "Clash Display SemiBold", fontWeight: "500" }}
      >
        <span className="text-sm">🚪</span>
        Exit
      </button>
    </div>
  );
}

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const user = getStoredUser();

  useEffect(() => {
    (async () => {
      const data = await fetchLeaderboard();
      setRows(data);
    })();
  }, []);

  return (
    <div
      className="min-h-screen px-4 flex flex-col relative"
      style={{ backgroundColor: "#FFDF33" }}
    >
      {/* Background Puffs Image */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/puffs.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "350px 270px",
          backgroundPosition: "290% 20%",
        }}
      ></div>

      {/* Content Wrapper with relative positioning */}
      <div className="relative z-10 flex flex-col flex-1 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl text-gray-800 mb-0"
            style={{ fontFamily: "Clash Display SemiBold", fontWeight: "600" }}
          >
            Top Puffers
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-2">
            Hi {user?.full_name || "User"}
          </p>
          <div className="mt-4 bg-white rounded-lg shadow-sm p-3 mx-4">
            <p className="text-sm text-gray-800 font-medium">
              Best puffer gets puffs for free in a month! 🏆
            </p>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="flex-1 flex justify-center mb-8">
          <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
            <ul className="divide-y divide-gray-200">
              {rows.map((r, idx) => (
                <li
                  key={r.user_id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {r.users?.full_name ?? r.user_id.slice(0, 6)}
                    </span>
                  </div>
                  <div
                    className="text-2xl text-gray-800"
                    style={{
                      fontFamily: "Clash Display SemiBold",
                      fontWeight: "600",
                    }}
                  >
                    {r.total_puffs}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed at bottom */}
      <div className="pb-4">
        <BottomNavigation />
      </div>
    </div>
  );
}
