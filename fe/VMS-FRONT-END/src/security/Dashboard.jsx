import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import SecurityDashboardCards from "./SecurityDashboardCards";
import SecurityDashboardTable from "./SecurityDashboardTable";
import "../styles/SecurityDashboard.css";
import { useNavigate } from "react-router-dom";

function SecurityDashboard() {
  const [stats, setStats] = useState({ guests_today: 0, devices: 0, logs_today: 0, verified_guests_today: 0 });
  const [recentGuests, setRecentGuests] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const today = new Date().toISOString().slice(0, 10);
        const [dashboardRes, guestsRes, logsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/security/dashboard/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/security/guests/?date=${today}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/security/access-logs/?date=${today}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(dashboardRes.data);
        setRecentGuests(guestsRes.data.slice(0, 5));
        setRecentLogs((logsRes.data || []).slice(0, 5));
      } catch (e) {
        if (e.response && e.response.status === 404) {
          setError("No data found for today. Please check if the backend security endpoints are set up correctly.");
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-table-page security-dashboard-root">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <h2 style={{ marginBottom: 12, fontSize: 24 }}>Security Dashboard</h2>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", margin: 40 }}>Loading...</div>
      ) : error ? (
        <div style={{ color: "red", margin: 20 }}>{error}</div>
      ) : (
        <>
          <SecurityDashboardCards stats={stats} />
          <div className="security-dashboard-flex" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280, maxWidth: 600 }}>
              <SecurityDashboardTable
                title="Today's Guests"
                columns={[
                  { key: "full_name", label: "Full Name" },
                  { key: "phone", label: "Phone" },
                  { key: "purpose", label: "Purpose" },
                  { key: "visit_date", label: "Visit Date" },
                  { key: "is_verified", label: "Verified" },
                ]}
                data={recentGuests.map(g => ({
                  ...g,
                  is_verified: g.is_verified ? "Yes" : "No"
                }))}
              />
            </div>
            <div style={{ flex: 1, minWidth: 280, maxWidth: 600 }}>
              <SecurityDashboardTable
                title="Today's Access Logs"
                columns={[
                  { key: "person_type", label: "Person Type" },
                  { key: "person_id", label: "Person ID" },
                  { key: "device_serial", label: "Device Serial" },
                  { key: "scanned_by", label: "Scanned By" },
                  { key: "time_in", label: "Time In" },
                  { key: "status", label: "Status" },
                ]}
                data={recentLogs}
              />
            </div>
          </div>
        </>
      )}
      <style>{`
        @media (max-width: 900px) {
          .security-dashboard-flex {
            flex-direction: column !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 600px) {
          .security-dashboard-root {
            padding: 8px !important;
          }
          .dashboard-card {
            min-width: 120px !important;
            padding: 12px 8px !important;
          }
          .admin-table-page h2 {
            font-size: 1.2rem !important;
          }
          .login-btn {
            font-size: 15px !important;
            padding: 7px 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default SecurityDashboard;
