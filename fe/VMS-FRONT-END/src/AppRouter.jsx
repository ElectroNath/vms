import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import InviteGuest from "./Pages/InviteGuest";
// import other employee/security pages as needed

function AppRouter() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/invite-guest" element={<InviteGuest />} />
      {/* Add more employee/security routes here */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRouter;