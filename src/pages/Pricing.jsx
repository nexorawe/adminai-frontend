import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Pricing() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlan = async () => {
      setLoadingPlan(true);
      setError("");

      try {
        const res = await api.get("/billing/me");
        setPlan(res.data?.plan || "free");
      } catch (err) {
        setPlan("free");
      } finally {
        setLoadingPlan(false);
      }
    };

    loadPlan();
  }, []);

  const upgradeToPro = async () => {
    setLoadingCheckout(true);
    setError("");

    try {
      const res = await api.post("/billing/create-checkout-session");
      const url = res.data?.checkout_url;

      if (!url) {
        setError("Checkout URL not returned from server");
        return;
      }

      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start checkout");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const openBillingPortal = async () => {
    setLoadingPortal(true);
    setError("");

    try {
      const res = await api.post("/billing/create-portal-session");
      const url = res.data?.portal_url;

      if (!url) {
        setError("Portal URL not returned from server");
        return;
      }

      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to open billing portal");
    } finally {
      setLoadingPortal(false);
    }
  };

  const cardStyle = (featured = false) => ({
    flex: 1,
    minWidth: 260,
    border: featured ? "2px solid #000" : "1px solid #333",
    padding: 20,
    borderRadius: 14,
  });

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h1>Pricing</h1>

      {loadingPlan ? (
        <p>Loading plan...</p>
      ) : (
        <p style={{ opacity: 0.8 }}>
          Current plan: <b>{plan.toUpperCase()}</b>
        </p>
      )}

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <div style={{ display: "flex", gap: 20, marginTop: 25, flexWrap: "wrap" }}>
        {/* FREE */}
        <div style={cardStyle(false)}>
          <h2 style={{ marginTop: 0 }}>Free</h2>
          <p style={{ fontSize: 28, margin: "10px 0" }}>
            $0<span style={{ fontSize: 14 }}>/month</span>
          </p>

          <ul style={{ lineHeight: 1.8 }}>
            <li>AI Writer limited daily usage</li>
            <li>Gmail AI replies limited daily usage</li>
            <li>Basic experience</li>
          </ul>

          <button onClick={() => navigate("/dashboard")} style={{ marginTop: 10 }}>
            Back to Dashboard
          </button>
        </div>

        {/* PRO */}
        <div style={cardStyle(true)}>
          <h2 style={{ marginTop: 0 }}>
            AdminAI Pro{" "}
            <span
              style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 999,
                border: "1px solid #111",
                marginLeft: 8,
              }}
            >
              Recommended
            </span>
          </h2>

          <p style={{ fontSize: 28, margin: "10px 0" }}>
            $15<span style={{ fontSize: 14 }}>/month</span>
          </p>

          <ul style={{ lineHeight: 1.8 }}>
            <li>Much higher daily AI Writer limits</li>
            <li>Much higher Gmail AI reply limits</li>
            <li>Billing portal access</li>
            <li>Priority updates</li>
          </ul>

          {plan === "pro" ? (
            <>
              <p style={{ color: "green", marginTop: 10 }}>
                ✅ You are already a Pro user
              </p>

              <button
                onClick={openBillingPortal}
                disabled={loadingPortal}
                style={{ marginTop: 10 }}
              >
                {loadingPortal ? "Opening..." : "Manage Billing"}
              </button>
            </>
          ) : (
            <button
              onClick={upgradeToPro}
              disabled={loadingCheckout}
              style={{ marginTop: 10 }}
            >
              {loadingCheckout ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          )}

          <p style={{ fontSize: 12, opacity: 0.75, marginTop: 12 }}>
            Payments handled securely by Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
