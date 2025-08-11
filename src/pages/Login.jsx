import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import initSqlJs from "sql.js";

const Login = () => {
  const [db, setDb] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });

        const response = await fetch("/dictionary.db"); // Your DB file in /public
        const buffer = await response.arrayBuffer();
        const loadedDb = new SQL.Database(new Uint8Array(buffer));
        setDb(loadedDb);
      } catch (err) {
        console.error("Failed to load database:", err);
        setError("Database load failed.");
      }
    };

    loadDatabase();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!db) {
      alert("Database not ready.");
      return;
    }

    try {
      setLoading(true);

      const stmt = db.prepare("SELECT id, email, password FROM users WHERE email = ?");
      stmt.bind([email]);

      let user = null;
      while (stmt.step()) {
        user = stmt.getAsObject();
      }
      stmt.free();

      if (!user) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user_id", user.id);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <form onSubmit={handleLogin} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
