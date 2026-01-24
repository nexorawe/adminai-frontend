import api from "../services/api";

export default function Pricing() {
  const upgrade = async () => {
    const res = await api.post("/billing/create-checkout-session");
    window.location.href = res.data.checkout_url;
  };

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h1>Pricing</h1>

      <div style={{ marginTop: 20, border: "1px solid #333", padding: 20, borderRadius: 10 }}>
        <h2>AdminAI Pro</h2>
        <p>$15/month</p>
        <ul>
          <li>Higher daily limits</li>
          <li>Unlimited Gmail AI replies</li>
          <li>Priority support (coming soon)</li>
        </ul>

        <button onClick={upgrade} style={{ marginTop: 10 }}>
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
