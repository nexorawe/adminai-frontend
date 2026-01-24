import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load user from localStorage
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

    // fetch billing plan
    api
      .get("/billing/me")
      .then((res) => {
        setPlan(res.data?.plan || "free");
      })
      .catch(() => {
        setPlan("free");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const badgeStyle = {
    padding: "4px 12px",
    borderRadius: 999,
    border: "1px solid #444",
    fontSize: 12,
    marginLeft: 10,
  };

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
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

          <hr style={{ margin: "20px 0" }} />

          <h3>Quick Actions</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <button onClick={() => navigate("/ai-writer")}>AI Writer</button>
            <button onClick={() => navigate("/gmail")}>Gmail Inbox</button>
            <button onClick={() => navigate("/pricing")}>Pricing</button>
            <button onClick={logout}>Logout</button>
          </div>

          <div style={{ marginTop: 25 }}>
            <h3>Plan Details</h3>
            <p>
              Current plan: <b>{plan.toUpperCase()}</b>
            </p>

            {plan !== "pro" ? (
              <div style={{ marginTop: 10 }}>
                <p style={{ color: "#cc8800" }}>
                  You are on Free plan. Upgrade to Pro to unlock higher limits.
                </p>
                <button onClick={() => navigate("/pricing")}>Upgrade to Pro</button>
              </div>
            ) : (
              <p style={{ color: "green", marginTop: 10 }}>
                ✅ You are a Pro user. Thank you for supporting AdminAI!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
