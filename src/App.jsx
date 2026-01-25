import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { setUpgradeHandler } from "./services/api";
import { useUpgrade } from "./context/UpgradeContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIWriter from "./pages/AIWriter";
import GmailInbox from "./pages/GmailInbox";
import Pricing from "./pages/Pricing";
import BillingSuccess from "./pages/BillingSuccess";

// ✅ Protected Route wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { showUpgrade } = useUpgrade();

  // ✅ register global upgrade handler for Axios 402 responses
  useEffect(() => {
    setUpgradeHandler(showUpgrade);
  }, [showUpgrade]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/ai-writer"
        element={
          <PrivateRoute>
            <AIWriter />
          </PrivateRoute>
        }
      />

      <Route
        path="/gmail"
        element={
          <PrivateRoute>
            <GmailInbox />
          </PrivateRoute>
        }
      />

      <Route
        path="/pricing"
        element={
          <PrivateRoute>
            <Pricing />
          </PrivateRoute>
        }
      />

      <Route
        path="/billing/success"
        element={
          <PrivateRoute>
            <BillingSuccess />
          </PrivateRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
