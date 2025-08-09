import { useState } from "react";
import { registerUser, loginUser } from "../api/users";
import { setStoredUser, getStoredUser } from "../lib/storage";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const existing = getStoredUser();
  const [mode, setMode] = useState(existing ? "continue" : "register");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation for mandatory fields
    if (mode === "register") {
      if (!full_name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      if (!password.trim()) {
        setError("Please enter a password");
        return;
      }
    } else if (mode === "login") {
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      if (!password.trim()) {
        setError("Please enter your password");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const user = await registerUser({ full_name, email, password });
        setStoredUser(user);
        navigate("/home");
      } else if (mode === "login") {
        const user = await loginUser({ email, password });
        setStoredUser(user);
        navigate("/home");
      } else if (mode === "continue" && existing) {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#FFDF33" }}
    >
      {/* Decorative Food Images */}
      <div className="absolute top-16 left-8">
        <img
          src="/puffs.png"
          alt="puff"
          className="w-20 h-16 transform rotate-12"
        />
      </div>
      <div className="absolute top-32 right-8">
        <img
          src="/puffs.png"
          alt="puff"
          className="w-24 h-20 transform -rotate-12 opacity-80"
        />
      </div>
      <div className="absolute bottom-32 left-12">
        <img
          src="/egg.png"
          alt="egg"
          className="w-16 h-20 transform rotate-6 opacity-90"
        />
      </div>
      <div className="absolute top-64 right-16">
        <img
          src="/egg.png"
          alt="egg"
          className="w-14 h-18 transform -rotate-15 opacity-75"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Handwritten Style Text */}
        <div className="text-center mb-12">
          <h1
            className="text-2xl text-gray-800 mb-4"
            style={{ fontFamily: "Clash Display SemiBold", fontWeight: "600" }}
          >
            enter your name
          </h1>
        </div>

        {/* Name Input Field */}
        {mode === "register" && (
          <div className="w-full max-w-xs mb-8">
            <input
              className="w-full bg-white bg-opacity-80 rounded-full px-6 py-4 text-gray-800 placeholder-gray-600 focus:outline-none focus:bg-opacity-100 transition-all"
              placeholder="Your name"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        )}

        {/* Login Fields */}
        {(mode === "login" || mode === "register") && (
          <div className="w-full max-w-xs space-y-4 mb-8">
            <input
              className="w-full bg-white bg-opacity-80 rounded-full px-6 py-4 text-gray-800 placeholder-gray-600 focus:outline-none focus:bg-opacity-100 transition-all"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full bg-white bg-opacity-80 rounded-full px-6 py-4 text-gray-800 placeholder-gray-600 focus:outline-none focus:bg-opacity-100 transition-all"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Chat-style Message */}
        <div className="w-full max-w-xs mb-8">
          <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm">
            <p className="text-sm text-gray-800 leading-relaxed">
              aliya,
              <br />
              mottapuffs vangi tharuo...
            </p>
            <div className="text-xs text-gray-400 mt-2 text-right">11:08</div>
          </div>
        </div>

        {/* Continue Button for Existing User */}
        {existing && mode === "continue" && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-xs bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-medium py-4 rounded-full transition-all disabled:opacity-50"
          >
            {loading ? "Please wait..." : `Continue as ${existing.full_name}`}
          </button>
        )}

        {/* Auth Buttons */}
        {(mode === "login" || mode === "register") && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-xs bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-medium py-4 rounded-full transition-all disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "register"
              ? "Create account"
              : "Sign in"}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-xs mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="pb-8">
        <div className="text-center mb-6">
          <h2
            className="text-2xl text-gray-800"
            style={{ fontFamily: "Clash Display SemiBold", fontWeight: "600" }}
          >
            motta puffs
          </h2>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex justify-center gap-4 px-6">
          {!existing && (
            <>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === "register"
                    ? "bg-gray-800 text-white"
                    : "bg-white bg-opacity-80 text-gray-800"
                }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-gray-800 text-white"
                    : "bg-white bg-opacity-80 text-gray-800"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
          {existing && (
            <button
              className="px-6 py-2 bg-white bg-opacity-80 text-gray-800 rounded-full text-sm font-medium"
              onClick={() =>
                setMode(mode === "continue" ? "login" : "continue")
              }
            >
              {mode === "continue"
                ? "Login as different user"
                : "Continue as " + existing.full_name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
