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
    <div className="flex justify-center gap-2 px-4">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-1 px-3 py-2 bg-gray-800 text-white rounded-full text-sm font-medium transition-all"
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

export default function Home() {
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRightAligned, setIsRightAligned] = useState(Math.random() > 0.5);
  const user = getStoredUser();

  // Function to generate dynamic messages based on puff counts
  const getPuffMessage = (stats) => {
    if (!stats) return "ippo vanna mottapuffs kittum";

    const totalPuffs = stats.chicken + stats.motta + stats.meat;

    // Individual puff type messages when only 1 left
    if (stats.motta === 1 && stats.chicken > 1 && stats.meat > 1) {
      return "ippo vanna motta puffs kittum";
    }
    if (stats.meat === 1 && stats.chicken > 1 && stats.motta > 1) {
      return "ippo vanna meat puffs kittum";
    }
    if (stats.chicken === 1 && stats.motta > 1 && stats.meat > 1) {
      return "ippo vanna chicken puffs kittum";
    }

    // Messages based on total count
    if (totalPuffs === 0) {
      return "puffs ellam poyi, poyi nale va, loser!";
    }
    if (totalPuffs === 2) {
      return "randu puffs mathram baki, ippo allaengil njan thinnum!";
    }
    if (totalPuffs >= 3 && totalPuffs <= 5) {
      return "ningalarinjille, kalyan silksil aadi sale thodangi, oru mottapuffs vangiye onnum free illa!";
    }
    if (totalPuffs > 5 && totalPuffs <= 8) {
      return "puffs ready aanu, ippo vangiya iratti vangam!";
    }
    if (totalPuffs > 8 && totalPuffs <= 10) {
      return "hungry?, edukku oru mottapuffs";
    }
    if (totalPuffs > 10) {
      return "oru mottapuffs eduthalo,";
    }

    // Default message
    return "ippo vanna mottapuffs kittum";
  };

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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFDF33" }}
      >
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
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
      <div className="relative z-10 flex flex-col flex-1 px-4 py-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className="text-3xl text-gray-800 mb-0"
            style={{ fontFamily: "Clash Display SemiBold", fontWeight: "600" }}
          >
            CEP's own puffs meter
          </h1>
          <p
            className="text-lg text-gray-800 mb-4"
            style={{
              fontFamily: "Sue Ellen Francisco Reglar",
              fontWeight: "500",
            }}
          >
            ft. Sauparnam
          </p>
          <p className="text-sm text-gray-700 font-medium">
            Hi {user?.full_name || "User"}
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`mb-8 flex ${
            isRightAligned ? "justify-end" : "justify-start"
          }`}
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-sm w-auto">
            <textarea
              placeholder={getPuffMessage(stats)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Randomly change alignment on every few keystrokes
                if (e.target.value.length % 3 === 0) {
                  setIsRightAligned(Math.random() > 0.5);
                }
              }}
              className="px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none min-w-64 resize-none"
              rows="2"
              style={{ minHeight: "auto" }}
            />
            <div className="px-4 pb-2">
              <span className="text-xs text-gray-400">11:45</span>
            </div>
          </div>
        </div>

        {/* Spacer to push puff stacks down */}
        <div className="flex-1"></div>

        {/* Puff Stacks - Aligned from bottom with increased max height */}
        <div
          className="flex justify-center items-end gap-8 mb-7 overflow-y-auto"
          style={{ maxHeight: "600px" }}
        >
          <PuffStack count={stats.chicken} type="chicken" label="🐔" />
          <PuffStack count={stats.motta} type="egg" label="🥟" />
          <PuffStack count={stats.meat} type="beef" label="🥩" />
        </div>
      </div>

      {/* Bottom Navigation - Fixed at bottom */}
      <div className="pb-4">
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
      <div
        className="text-4xl text-gray-800 -mb-0"
        style={{ fontFamily: "Clash Display Semibold", fontWeight: "1000" }}
      >
        {count}
      </div>

      {/* Multiple Puff Stacks */}
      <div className="flex items-end gap-0.5 mb-2">{stacks}</div>

      {/* Type Icon */}
      <img src={`/${type}.png`} alt={type} className="w-8 h-8" />
    </div>
  );
}
