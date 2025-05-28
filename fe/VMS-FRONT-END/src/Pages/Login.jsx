import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const OutlookAuth = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Navigate immediately (you can add checks later if needed)
    navigate("/home");
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
        />
        <input
          className="outlook-auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <a className="outlook-auth-link" href="#">
          Forgot password?
        </a>
        <button className="outlook-auth-btn" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default OutlookAuth;
