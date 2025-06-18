import React from "react";
import { Routes, Route } from "react-router-dom";
import SecurityDashboard from "./Dashboard";
import SecurityDevices from "./Devices";
import SecurityScan from "./Scan";
import SecurityNavbar from "./SecurityNavbar";
import SecurityGuestsToday from "./GuestsToday";

function SecurityRoutes() {
  return (
    <>
      <SecurityNavbar />
      <Routes>
        <Route path="/" element={<SecurityDashboard />} />
        <Route path="/devices" element={<SecurityDevices />} />
        <Route path="/scan-access" element={<SecurityScan />} />
        <Route path="/guests" element={<SecurityGuestsToday />} />
      </Routes>
    </>
  );
}

export default SecurityRoutes;
