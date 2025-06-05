import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      // No auth required, just send email (force lowercase for email)
      await axios.post(
        `${API_BASE_URL}/api/employee-profiles/forgot_password/`,
        { email: email.trim().toLowerCase() },
        { withCredentials: false }
      );
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No account found with this email address.");
      } else {
        setError(err.response?.data?.detail || "Failed to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (no auth required)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/employee-profiles/verify_otp/`, { email, otp }, { withCredentials: false });
      setMessage("OTP verified. Please enter your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password (no auth required)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/employee-profiles/reset_password/`, {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }, { withCredentials: false });
      setMessage("Password reset successful. You can now log in.");
      setStep(4);
    } catch (err) {
      setError(
        (err.response?.data?.detail && err.response.data.detail[0]) ||
        err.response?.data?.detail ||
        "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-right" style={{ margin: "auto" }}>
        <div className="login-form-title">Forgot Password</div>
        {step === 1 && (
          <form className="login-form" onSubmit={handleRequestOtp}>
            <div className="login-input-group">
              <input
                className="login-input"
                type="email"
                placeholder=" "
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <span className="login-input-label">Email</span>
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            {error && <div className="login-error">{error}</div>}
            {message && <div className="login-success">{message}</div>}
          </form>
        )}
        {step === 2 && (
          <form className="login-form" onSubmit={handleVerifyOtp}>
            <div className="login-input-group">
              <input
                className="login-input"
                type="text"
                placeholder=" "
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
              <span className="login-input-label">Enter OTP</span>
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {error && <div className="login-error">{error}</div>}
            {message && <div className="login-success">{message}</div>}
          </form>
        )}
        {step === 3 && (
          <form className="login-form" onSubmit={handleResetPassword}>
            <div className="login-input-group">
              <input
                className="login-input"
                type="password"
                placeholder=" "
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <span className="login-input-label">New Password</span>
            </div>
            <div className="login-input-group">
              <input
                className="login-input"
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <span className="login-input-label">Confirm Password</span>
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            {error && <div className="login-error">{error}</div>}
            {message && <div className="login-success">{message}</div>}
          </form>
        )}
        {step === 4 && (
          <div>
            <div className="login-success">{message}</div>
            <a className="login-btn" href="/login" style={{ display: "inline-block", marginTop: 24 }}>
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
