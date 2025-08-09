import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAchievements } from "../api/puffs";
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
        className="flex items-center gap-1 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full text-sm font-medium transition-all"
        style={{ fontFamily: "Clash Display SemiBold", fontWeight: "500" }}
      >
        <span className="text-sm">🏆</span>
        Board
      </button>
      <button
        onClick={() => navigate("/achievements")}
        className="flex items-center gap-1 px-3 py-2 bg-gray-800 text-white rounded-full text-sm font-medium transition-all"
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
            Achievements
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-2">
            Hi {user?.full_name || "User"}
          </p>
        </div>

        {/* Achievements Content */}
        <div className="flex-1 flex justify-center mb-8">
          <div className="w-full max-w-md">
            {rows.length > 0 ? (
              <div className="space-y-4">
                {rows.map((a) => (
                  <div key={a.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-lg text-gray-800 font-semibold"
                          style={{
                            fontFamily: "Clash Display SemiBold",
                            fontWeight: "600",
                          }}
                        >
                          {a.achievement_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(a.unlocked_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-gray-400">🏆</span>
                </div>
                <p
                  className="text-lg text-gray-600"
                  style={{
                    fontFamily: "Clash Display SemiBold",
                    fontWeight: "600",
                  }}
                >
                  No badges yet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Keep puffing to earn your first achievement!
                </p>
              </div>
            )}
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
