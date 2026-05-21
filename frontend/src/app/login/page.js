"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      loginAdmin(data.token, data.admin);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">पाण्डेय ट्रेडर्स</div>
          <div className="login-subtitle">Admin Authentication</div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username">Admin ID</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter ID"
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-eye`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Secure Login"}
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
