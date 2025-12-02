// Login.view.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { loginService } from "../../services/auth.service";

import { LocalStorage } from "@/utils/local-storage";
import { LoginResponse } from "@/types/login.interface";

const Logins: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await loginService({
        username,
        password,
      });
      console.log("Login successful:", response);
      console.log("LoginResponse:", JSON.stringify(response, null, 2)); // Log LoginResponse
      // localStorage.setItem("accessToken", response.data.access_token);
      LocalStorage.setLocalStorage("accessToken", response?.access_token);
      navigate("/dashboard"); // Redirect to /dashboard
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Login request completed.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Logins;
