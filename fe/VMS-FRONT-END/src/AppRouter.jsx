import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import InviteGuest from "./Pages/InviteGuest";
import AppLayout from "./Layouts/AppLayout";
import Permission from "./components/Permission";

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <Permission>
            <AppLayout>
              <Home />
            </AppLayout>
          </Permission>
        }
      />
      <Route
        path="/invite-guest"
        element={
          <Permission>
            <AppLayout>
              <InviteGuest />
            </AppLayout>
          </Permission>
        }
      />
      {/* Add more employee/security routes here */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRouter;