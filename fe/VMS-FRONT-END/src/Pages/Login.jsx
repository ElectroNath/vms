import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const OutlookAuth = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username: form.username,
          password: form.password,
        },
        {
          withCredentials: true, // 👈 crucial for cookies
        }
      );

      navigate("/home"); // move to home if login succeeds
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail); // JWT error message
      } else {
        setError("Incorrect username or Password .");
      }
    } finally {
      setLoading(false);
    }
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
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
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
        <button className="outlook-auth-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default OutlookAuth;
