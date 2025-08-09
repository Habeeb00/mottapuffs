import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGlobalStats, subscribeGlobalStats } from "../api/puffs";
import { getStoredUser, clearStoredUser } from "../lib/storage";

// Bottom Navigation Component
function BottomNavigation({ className = "" }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <div
      className={`w-full max-w-[397px] h-[83px] bg-white rounded-[45px] mx-auto ${className}`}
    >
      <div className="relative w-full h-[23px] top-3.5">
        <div className="flex justify-center items-center gap-[68px] relative top-1.5">
          {/* Home Icon */}
          <button
            onClick={() => navigate("/home")}
            className="relative w-[21.54px] h-[21.89px] flex items-center justify-center"
          >
            <img src="/Home.png" alt="Home" className="w-5 h-5" />
          </button>

          {/* Leaderboard Icon */}
          <button
            onClick={() => navigate("/leaderboard")}
            className="relative w-[21.54px] h-[20.98px] flex items-center justify-center"
          >
            <img src="/Bar chart.png" alt="Leaderboard" className="w-5 h-5" />
          </button>

          {/* Badge/Achievements Icon */}
          <button
            onClick={() => navigate("/achievements")}
            className="relative w-[21.54px] h-[20.98px] flex items-center justify-center"
          >
            <img src="/icon.png" alt="Achievements" className="w-5 h-5" />
          </button>

          {/* Sign Out Icon */}
          <button
            onClick={handleSignOut}
            className="relative w-[23px] h-[23px] flex items-center justify-center"
          >
            <img src="/logout.png" alt="Sign Out" className="w-5 h-5 hover:opacity-80 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    let cleanup = () => {};
    let pollInterval = null;

    (async () => {
      console.log("Loading initial stats...");
      const s = await fetchGlobalStats();
      console.log("Initial stats loaded:", s);
      setStats(s);

      console.log("Setting up real-time subscription...");
      cleanup = await subscribeGlobalStats(async (payload) => {
        console.log("🔥 Real-time update received in Home:", payload);

        // Use the new data directly from the payload for better performance
        if (payload.new) {
          console.log("Updating stats with new data:", payload.new);
          setStats(payload.new);
        } else {
          // Fallback: fetch fresh data if payload doesn't have new data
          console.log("Payload missing new data, fetching fresh stats...");
          const updated = await fetchGlobalStats();
          console.log("Updated stats fetched:", updated);
          setStats(updated);
        }
      });
      console.log("Real-time subscription active");

      // Fallback: Poll every 10 seconds as backup (reduced frequency)
      pollInterval = setInterval(async () => {
        try {
          const updated = await fetchGlobalStats();
          setStats((prevStats) => {
            // Only update if data actually changed
            if (JSON.stringify(prevStats) !== JSON.stringify(updated)) {
              console.log("Polling detected change:", updated);
              return updated;
            }
            return prevStats;
          });
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 10000);
    })();

    return () => {
      console.log("Cleaning up subscription...");
      cleanup();
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-yellow-400 px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          CEP's own puffs meter
        </h1>
        <p className="text-sm text-gray-700 font-medium">
          Hi {user?.full_name || "User"}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <input
            type="text"
            placeholder="ippo vanna mottapuffs kittum"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <div className="px-4 pb-2">
            <span className="text-xs text-gray-400">11:45</span>
          </div>
        </div>
      </div>

      {/* Puff Stacks */}
      <div className="flex justify-center items-end gap-8 mb-12 flex-1">
        <PuffStack count={stats.chicken} type="chicken" label="🐔" />
        <PuffStack count={stats.motta} type="egg" label="🥟" />
        <PuffStack count={stats.meat} type="beef" label="🥩" />
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto pb-4">
        <BottomNavigation />
      </div>
    </div>
  );
}

function PuffStack({ count, type, label }) {
  // Calculate number of stacks needed (15 puffs per stack)
  const stacksNeeded = Math.ceil(count / 15);
  const stacks = [];

  // Create individual stacks
  for (let stackIndex = 0; stackIndex < stacksNeeded; stackIndex++) {
    const remainingPuffs = count - stackIndex * 15;
    const puffsInThisStack = Math.min(remainingPuffs, 15);
    const puffs = Array.from({ length: puffsInThisStack }, (_, i) => i);

    stacks.push(
      <div
        key={stackIndex}
        className="flex flex-col items-center"
        style={{ minHeight: "auto" }}
      >
        {puffs.map((_, index) => (
          <img
            key={`${stackIndex}-${index}`}
            src="/puffs.png"
            alt="puff"
            style={{
              width: "56px",
              height: "47px",
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              flex: "none",
              order: 14,
              alignSelf: "stretch",
              flexGrow: 0,
              marginTop: index === 0 ? "0px" : "-20px",
              zIndex: puffsInThisStack - index,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Count Number */}
      <div className="text-4xl font-black text-gray-800 -mb-0">{count}</div>

      {/* Multiple Puff Stacks */}
      <div className="flex items-end gap-0.5 mb-2">{stacks}</div>

      {/* Type Icon */}
      <img 
        src={`/${type}.png`} 
        alt={type}
        className="w-8 h-8"
      />
    </div>
  );
}
