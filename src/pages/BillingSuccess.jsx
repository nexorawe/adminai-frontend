export default function BillingSuccess() {
  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "0 auto" }}>
      <h1>✅ Payment successful</h1>
      <p>Welcome to <b>AdminAI Pro</b> 🎉</p>

      <a href="/dashboard">
        <button style={{ marginTop: 15 }}>Go to Dashboard</button>
      </a>

      <a href="/gmail">
        <button style={{ marginTop: 15, marginLeft: 10 }}>Go to Gmail</button>
      </a>
    </div>
  );
}
