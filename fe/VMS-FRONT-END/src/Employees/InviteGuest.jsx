import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "../components/Modals"; // Ensure this is a styled modal
import { API_BASE_URL } from "../api";

function InviteGuest() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    purpose: "",
    visitDate: "",
    id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("You are not authenticated. Please log in.");
          setShowModal(true);
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/me/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (res?.data?.id) {
          setForm((f) => ({ ...f, invited_by: String(res.data.id) }));
        } else {
          throw new Error();
        }
      } catch {
        setError(
          "Could not determine your employee profile ID. Please contact admin."
        );
        setShowModal(true);
      }
    };
    fetchUserId();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setShowModal(false);

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.purpose ||
      !form.visitDate
    ) {
      setError("All fields are required.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      const payload = {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        purpose: form.purpose.trim(),
        visit_date: form.visitDate,
        invited_by: form.invited_by ? Number(form.invited_by) : undefined,
      };

      Object.keys(payload).forEach(
        (key) =>
          (payload[key] === undefined || payload[key] === "") &&
          delete payload[key]
      );

      await axios.post(`${API_BASE_URL}/api/guests/`, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      setSuccess("Guest invitation submitted successfully!");
      setShowModal(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        purpose: "",
        visitDate: "",
        invited_by: form.invited_by,
      });
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object" && !Array.isArray(data)) {
          const messages = Object.entries(data)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
            )
            .join(" | ");
          setError(messages);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Failed to submit invitation. Please try again.");
        }
      } else {
        setError("Failed to submit invitation. Please try again.");
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-root">
      <style>{`
        .form-root {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          background-color: #f2f4f7;
        }

        .form-container {
          min-width: 700px;
          max-width: 1100px;
          height: 100vh;
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .login-form-title {
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .login-input-group {
          position: relative;
        }

        .login-input {
          width: 100%;
          padding: 12px;
          font-size: 18px;
          border: 1px solid #ccc;
          border-radius: 6px;
          outline: none;
        }

        .login-input-label {
          position: absolute;
          top: -10px;
          left: 12px;
          background: white;
          padding: 0 4px;
          font-size: 14px;
          color: #666;
        }

        .login-btn {
          padding: 12px;
          background-color: #007bff;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-root {
            height: 75px !important;
            padding: 20px;
            align-items: flex-start !important;
            background-color: green;
            border
          }

          .form-container {
            min-width: unset !important;
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            margin-top: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 24px 20px;
            border-radius: 12px;
          }

          .login-form-title {
            text-align: center;
            font-size: 22px !important;
          }

          .login-btn,
          .login-input {
            font-size: 16px;
          }

          .login-form {
            gap: 1.1rem;
          }
        }
      `}</style>

      <div className="form-container">
        <div className="login-form-title">Invite Guest</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <input
              className="login-input"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span className="login-input-label">Full Name</span>
          </div>

          <div className="login-input-group">
            <input
              className="login-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span className="login-input-label">Email</span>
          </div>

          <div className="login-input-group">
            <input
              className="login-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span className="login-input-label">Phone</span>
          </div>

          <div className="login-input-group">
            <input
              className="login-input"
              type="text"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span className="login-input-label">Purpose</span>
          </div>

          <div className="login-input-group">
            <input
              className="login-input"
              type="date"
              name="visitDate"
              value={form.visitDate}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span className="login-input-label">Visit Date</span>
          </div>

          <input
            type="hidden"
            name="invited_by"
            value={form.invited_by || ""}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {showModal && (error || success) && (
          <Modal
            message={error || success}
            isSuccess={!!success}
            onClose={() => {
              setShowModal(false);
              setError("");
              setSuccess("");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default InviteGuest;
