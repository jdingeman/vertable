import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../css/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (form.password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    // Stub — replace with real API call when backend is ready
    setTimeout(() => {
      navigate("/dashboard");
    }, 600);
  }

  const isComplete =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.companyUrl &&
    form.password &&
    form.confirmPassword;

  return (
    <div className="register">
      <div className="register-card">
        <h1 className="register-title">Vertable</h1>
        <p className="register-subtitle">Create your account</p>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="register-name-row">
            <div className="register-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jane"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="register-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Smith"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="companyUrl">Company URL</label>
            <input
              id="companyUrl"
              name="companyUrl"
              type="url"
              autoComplete="url"
              placeholder="https://yourcompany.com"
              value={form.companyUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button
            type="submit"
            className="register-submit"
            disabled={loading || !isComplete}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="register-login">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
