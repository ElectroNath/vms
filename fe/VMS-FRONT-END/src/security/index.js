import React from "react";
import { Routes, Route } from "react-router-dom";
import SecurityDashboard from "./Dashboard";
import SecurityDevices from "./Devices";
import SecurityAccessLogScan from "./AccessLogScan";

function SecurityRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SecurityDashboard />} />
      <Route path="/devices" element={<SecurityDevices />} />
      <Route path="/scan-access" element={<SecurityAccessLogScan />} />
    </Routes>
  );
}

export default SecurityRoutes;
