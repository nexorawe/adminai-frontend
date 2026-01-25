import { useNavigate } from "react-router-dom";

export default function UpgradeModal({ open, message, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 15,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Daily limit reached</h3>

        <p style={{ opacity: 0.9 }}>
          {message ||
            "You reached your daily limit on the Free plan. Upgrade to Pro to continue."}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={() => navigate("/pricing")}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #111",
              cursor: "pointer",
            }}
          >
            Upgrade to Pro
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #aaa",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
