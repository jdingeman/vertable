import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../css/Login.css";

// Stub credentials — replace with real auth when backend is ready
const STUB_USER = { email: "demo@vertable.io", password: "password" };

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Stub auth — simulates a short network delay
    setTimeout(() => {
      if (email === STUB_USER.email && password === STUB_USER.password) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="login">
      <div className="login-card">
        <h1 className="login-title">Vertable</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <div className="login-field-row">
              <label htmlFor="password">Password</label>
              <button type="button" className="login-forgot" tabIndex={-1}>
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="login-register">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
