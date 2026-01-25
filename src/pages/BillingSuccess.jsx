import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function BillingSuccess() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshPlan = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/billing/me");
      setPlan(res.data?.plan || "free");
    } catch (err) {
      setError("Failed to fetch billing status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Refresh plan immediately when returning from Stripe
    refreshPlan();
  }, []);

  return (
    <div style={{ padding: 30, maxWidth: 850, margin: "0 auto" }}>
      <h1>✅ Payment Successful</h1>

      <p style={{ marginTop: 10 }}>
        Thank you for subscribing to <b>AdminAI</b> 🎉
      </p>

      {loading ? (
        <p style={{ marginTop: 15 }}>Refreshing your plan...</p>
      ) : error ? (
        <p style={{ color: "red", marginTop: 15 }}>{error}</p>
      ) : (
        <div
          style={{
            marginTop: 15,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #333",
          }}
        >
          <p style={{ margin: 0 }}>
            Current plan: <b>{plan.toUpperCase()}</b>
          </p>

          {plan !== "pro" && (
            <p style={{ marginTop: 8, color: "#cc8800" }}>
              Your upgrade may take a few seconds (webhook syncing). Click refresh.
            </p>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <button onClick={refreshPlan} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Plan"}
        </button>

        <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        <button onClick={() => navigate("/ai-writer")}>Use AI Writer</button>
        <button onClick={() => navigate("/gmail")}>Go to Gmail Inbox</button>
      </div>
    </div>
  );
}
