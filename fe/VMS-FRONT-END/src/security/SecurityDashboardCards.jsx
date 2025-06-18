import React from "react";

function SecurityDashboardCards({ stats }) {
  return (
    <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
      <div className="dashboard-card">
        <div className="dashboard-card-title">Guests</div>
        <div className="dashboard-card-value">{stats.guests}</div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card-title">Devices</div>
        <div className="dashboard-card-value">{stats.devices}</div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card-title">Access Logs</div>
        <div className="dashboard-card-value">{stats.access_logs}</div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card-title">Verified Guests</div>
        <div className="dashboard-card-value">{stats.verified_guests}</div>
      </div>
    </div>
  );
}

export default SecurityDashboardCards;
