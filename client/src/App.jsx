import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import AddPuffs from './pages/AddPuffs';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import { getStoredUser } from './lib/storage';

function RequireAuth({ children }) {
  const user = getStoredUser();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <Link to="/home" className="font-semibold">Puffs Meter</Link>
          <nav className="flex gap-3 text-sm">
            <Link to="/home">Home</Link>
            {/* Add page intentionally hidden from nav */}
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/achievements">Badges</Link>
          </nav>
        </header>
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
