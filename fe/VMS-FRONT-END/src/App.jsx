import React, { useState } from "react";
import "./outlook-auth.css";

const OutlookAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.confirmPassword)) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Simulate authentication (replace with real API call)
    setTimeout(() => {
      if (isLogin) {
        if (form.email === "user@example.com" && form.password === "password") {
          setError("");
          alert("Login successful!");
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("");
        alert("Account created!");
      }
    }, 700);
  };

  return (
    <div className="outlook-auth-container">
      <img
        className="outlook-auth-logo"
        src="/src/assets/nnpc-logo.png"
        alt="NNPC Logo"
      />
      <div className="outlook-auth-title">LOGIN</div>
      <form className="outlook-auth-form" onSubmit={handleSubmit}>
        {error && <div className="outlook-auth-error">{error}</div>}
        <input
          className="outlook-auth-input"
          type="email"
          name="email"
          placeholder="Email, phone, or Skype"
          value={form.email}
          onChange={handleChange}
          autoComplete="username"
        />
        <input
          className="outlook-auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        {!isLogin && (
          <input
            className="outlook-auth-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        )}
        {isLogin && (
          <a className="outlook-auth-link" href="#">
            Forgot password?
          </a>
        )}
        <button className="outlook-auth-btn" type="submit">
          {isLogin ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="outlook-auth-switch">
        {isLogin ? (
          <>
            No account?{" "}
            <span
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
            >
              Create one!
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
            >
              Sign in
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return <OutlookAuth />;
}
