import { useEffect, useMemo, useState } from "react";
import { login, signup } from "../api/authClient";

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMode("signup");
  }, []);

  const isSignup = mode === "signup";

  const canSubmit = useMemo(() => {
    if (!email.trim()) return false;
    if (!password || password.length < 8) return false;
    if (isSignup && password !== confirm) return false;
    return true;
  }, [email, password, confirm, isSignup]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!canSubmit) return;

    try {
      setBusy(true);

      if (isSignup) {
        await signup(email.trim(), password);
        setMode("login");
        setConfirm("");
        return;
      }

      const token = await login(email.trim(), password);
      const accessToken =
        token?.access_token || token?.token || (typeof token === "string" ? token : "");

      if (!accessToken) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      localStorage.setItem("access_token", accessToken);
      onAuthed?.({ email: email.trim() });
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authHeader">
          <h1>Marketing Video Generator</h1>
          <p className="sub">
            {isSignup
              ? "Create an account to get started."
              : "Log in to generate videos."}
          </p>
        </div>

        {/* Tabs */}
        <div className="authTabs">
          <button
            type="button"
            className={`tab ${isSignup ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign up
          </button>

          <button
            type="button"
            className={`tab ${!isSignup ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Log in
          </button>
        </div>

        {/* Form */}
        <form className="authForm" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {isSignup && (
            <div>
              <label className="label">Confirm password</label>
              <input
                className="input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="notice error">{error}</div>}

          <button className="btn btnPrimary" disabled={!canSubmit || busy}>
            {busy ? "Working…" : isSignup ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
