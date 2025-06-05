import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import MustChangePasswordModal from "../components/MustChangePasswordModal";
import "../styles/Login.css";
import Logo from "../assets/3D_App_Icon_Mockup_[Qorecraft]w[1](1).png";
import "@fontsource/montserrat"; // Defaults to weight 400
import { useNavigate, Link } from "react-router-dom";

const OutlookAuth = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      const response = await axios.post(
        `${API_BASE_URL}/api/token/`,
        {
          username: form.username,
          password: form.password,
        }
      );

      if (response.data && response.data.access) {
        Cookies.set("token", response.data.access, {
          path: "/",
          secure: false,
          sameSite: "Lax",
        });
        // After successful login, check must_change_password from change_password endpoint
        const token = Cookies.get("token");
        const mustChangeRes = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/prompt_change/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        // Log the full response for debugging
        console.log("Change password response:", mustChangeRes.data);

        // Accept all possible true-ish values for must_change_password
        const mustChange =
          mustChangeRes.data.must_change_password === true ||
          mustChangeRes.data.mustchangepassword === true ||
          mustChangeRes.data.must_change_password === "true" ||
          mustChangeRes.data.mustchangepassword === "true" ||
          mustChangeRes.data.must_change_password === 1 ||
          mustChangeRes.data.mustchangepassword === 1 ||
          mustChangeRes.data.must_change_password === "1" ||
          mustChangeRes.data.mustchangepassword === "1";

        if (mustChange) {
          setMustChangePassword(true);
          setShowModal(true);
        } else {
          setMustChangePassword(false);
          setShowModal(false);
          navigate("/home");
        }
      } else {
        setError("Login failed: No access token received.");
      }
    } catch (err) {
      // Log the error for debugging
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div
          className="login-title"
          style={{ marginTop: "2.5rem", marginBottom: "auto" }}
        >
          VISITORS MANAGEMENT
          <br />
          SYSTEM(NETCO)
        </div>
      </div>
      <img className="login-3d-icon" src={Logo} alt="3D App Icon" />
      <div className="login-right">
        <img
          className="login-nnpc-logo"
          src="/src/assets/nnpc-logo.png"
          alt="NNPC Logo"
        />
        <div className="login-nnpc-label"></div>
        <div className="login-form-title">Log-In To Your Account</div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="login-input-group">
            <input
              className="login-input"
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder=" "
            />
            <span className="login-input-label">Username</span>
          </div>
          <div className="login-input-group">
            <input
              className="login-input"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder=" "
            />
            <span className="login-input-label">Password</span>
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </button>
          <div className="login-form-row">
            <label className="login-remember">
              <input type="checkbox" /> Remember me
            </label>
            <Link className="login-forgot" to="/forgot-password">
              Forget Password
            </Link>
          </div>
        </form>
      </div>
      <MustChangePasswordModal
        open={mustChangePassword && showModal}
        onSuccess={() => {
          setMustChangePassword(false);
          setShowModal(false);
          navigate("/home");
        }}
      />
    </div>
  );
};

export default OutlookAuth;
