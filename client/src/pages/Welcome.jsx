import { useState } from 'react';
import { registerUser, loginUser } from '../api/users';
import { setStoredUser, getStoredUser } from '../lib/storage';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const existing = getStoredUser();
  const [mode, setMode] = useState(existing ? 'continue' : 'register');
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const user = await registerUser({ full_name, email, password });
        setStoredUser(user);
        navigate('/home');
      } else if (mode === 'login') {
        const user = await loginUser({ email, password });
        setStoredUser(user);
        navigate('/home');
      } else if (mode === 'continue' && existing) {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Puffs Meter</h1>

      {existing && (
        <button
          className="w-full mb-4 rounded bg-blue-600 text-white py-2"
          onClick={() => setMode('continue')}
        >
          Continue as {existing.full_name}
        </button>
      )}

      <div className="flex gap-2 mb-4 text-sm">
        <button className={`px-3 py-1 rounded ${mode==='register' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`} onClick={() => setMode('register')}>Register</button>
        <button className={`px-3 py-1 rounded ${mode==='login' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`} onClick={() => setMode('login')}>Login</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <input className="w-full border rounded p-2 bg-transparent" placeholder="Full name" value={full_name} onChange={(e)=>setFullName(e.target.value)} required />
        )}
        <input className="w-full border rounded p-2 bg-transparent" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2 bg-transparent" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50">
          {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : mode === 'login' ? 'Sign in' : 'Continue'}
        </button>
      </form>
    </div>
  );
} 