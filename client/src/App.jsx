import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import AddPuffs from './pages/AddPuffs';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import { getStoredUser, clearStoredUser } from './lib/storage';

function RequireAuth({ children }) {
  const user = getStoredUser();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const isWelcomePage = location.pathname === '/';

  const handleSignOut = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
      <Link to={user ? "/home" : "/"} className="font-semibold">Puffs Meter</Link>
      {!isWelcomePage && user && (
        <nav className="flex gap-3 text-sm items-center">
          <Link to="/home">Home</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/achievements">Badges</Link>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </nav>
      )}
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/add" element={<RequireAuth><AddPuffs /></RequireAuth>} />
            <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
            <Route path="/achievements" element={<RequireAuth><Achievements /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
