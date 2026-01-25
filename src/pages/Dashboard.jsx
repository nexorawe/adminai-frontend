import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("free");

  const [usage, setUsage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    const loadAll = async () => {
      setLoading(true);
      setError("");

      try {
        const billingRes = await api.get("/billing/me");
        setPlan(billingRes.data?.plan || "free");
      } catch {
        setPlan("free");
      }

      try {
        const usageRes = await api.get("/usage/me");
        setUsage(usageRes.data || null);
      } catch {
        setUsage(null);
      }

      setLoading(false);
    };

    loadAll();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openBillingPortal = async () => {
    setError("");
    try {
      const res = await api.post("/billing/create-portal-session");
      const url = res.data?.portal_url;
      if (!url) {
        setError("Portal URL not returned");
        return;
      }
      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to open billing portal");
    }
  };

  const badgeStyle = {
    padding: "4px 12px",
    borderRadius: 999,
    border: "1px solid #444",
    fontSize: 12,
    marginLeft: 10,
  };

  const cardStyle = {
    border: "1px solid #333",
    borderRadius: 14,
    padding: 15,
    marginTop: 15,
  };

  const renderUsageBar = (label, used, limit) => {
    const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <b>{label}</b>
          <span style={{ opacity: 0.85 }}>
            {used}/{limit}
          </span>
        </div>

        <div
          style={{
            height: 10,
            background: "#222",
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 6,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: pct >= 90 ? "#ff3b30" : pct >= 70 ? "#ff9500" : "#34c759",
            }}
          />
        </div>

        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 5 }}>
          Remaining: <b>{Math.max(limit - used, 0)}</b>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 30, maxWidth: 950, margin: "0 auto" }}>
      <h2>
        Dashboard
        <span style={badgeStyle}>{plan.toUpperCase()}</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p style={{ marginTop: 10 }}>
            Welcome <b>{user?.name || "User"}</b>
          </p>
          <p style={{ opacity: 0.85 }}>
            Email: <b>{user?.email || "-"}</b>
          </p>

          {error && (
            <p style={{ color: "red", marginTop: 10 }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Quick Actions</h3>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              <button onClick={() => navigate("/ai-writer")}>AI Writer</button>
              <button onClick={() => navigate("/gmail")}>Gmail Inbox</button>
              <button onClick={() => navigate("/pricing")}>Pricing</button>

              {plan === "pro" ? (
                <button onClick={openBillingPortal}>Manage Billing</button>
              ) : (
                <button onClick={() => navigate("/pricing")}>Upgrade to Pro</button>
              )}

              <button onClick={logout}>Logout</button>
            </div>
          </div>

          {/* Usage */}
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Daily Usage</h3>

            {!usage ? (
              <p style={{ opacity: 0.85 }}>Usage data not available.</p>
            ) : (
              <>
                {renderUsageBar(
                  "AI Writer",
                  usage.used?.ai_generate ?? 0,
                  usage.limits?.ai_generate ?? 0
                )}

                {renderUsageBar(
                  "Gmail AI Replies",
                  usage.used?.gmail_generate_reply ?? 0,
                  usage.limits?.gmail_generate_reply ?? 0
                )}

                {plan !== "pro" && (
                  <div style={{ marginTop: 15 }}>
                    <p style={{ color: "#cc8800" }}>
                      Upgrade to Pro to unlock higher limits.
                    </p>
                    <button onClick={() => navigate("/pricing")}>
                      Upgrade to Pro
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
