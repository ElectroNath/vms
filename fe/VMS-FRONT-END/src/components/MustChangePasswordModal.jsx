import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../api";
import "../styles/change_pass.css"; // Ensure you have the correct styles

function MustChangePasswordModal({ open, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/employee-profiles/change_password/`,
        { new_password: newPassword, confirm_password: confirmPassword },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setLoading(false);
      setError("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.detail?.[0] ||
        err.response?.data?.detail ||
        "Failed to change password."
      );
    }
  };

  return (
    <div className="qr-modal-overlay" style={{ zIndex: 20000 }}>
      <div className="qr-modal-content" style={{ maxWidth: 400 }}>
        <h3>Change Your Password</h3>
        <form onSubmit={handleSubmit}>
        <div className="login-input-group">
          <input
            className="login-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading || success}
          />
          <span className="login-input-label">New Password</span>
        </div>
        <div className="login-input-group">
          <input
            className="login-input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading || success}
          />
           <span className="login-input-label">Confirm Password</span>
        </div>
          {error && <div style={{ color: "#c00", marginBottom: 10 }}>{error}</div>}
          {success && <div style={{ color: "#247150", marginBottom: 10 }}>Password changed successfully!</div>}
          <button
            type="submit"
            className="qr-modal-close-btn"
            style={{ width: "100%" }}
            disabled={loading || success}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MustChangePasswordModal;
