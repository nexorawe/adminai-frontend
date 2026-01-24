import { useEffect, useState } from "react";
import api from "../services/api";

export default function GmailInbox() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectGmail = async () => {
    try {
      setError("");
      const res = await api.get("/gmail/connect");

      const url = res.data?.auth_url;
      if (!url) {
        alert("No auth_url returned from backend");
        return;
      }

      // Redirect user to Google OAuth
      window.location.href = url;
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to start Gmail connection");
    }
  };

  const loadEmails = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/gmail/emails?limit=10");
      setEmails(res.data?.emails || []);
    } catch (err) {
      setEmails([]);
      setError(err.response?.data?.detail || "Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Gmail Inbox</h2>

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
        <button onClick={loadEmails} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>

        <button onClick={connectGmail}>
          Connect Gmail
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        {emails.length === 0 ? (
          <p>No emails found.</p>
        ) : (
          emails.map((e) => (
            <div
              key={e.id}
              style={{
                border: "1px solid #333",
                padding: 15,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <strong>{e.subject || "(No Subject)"}</strong>

              <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>
                <div><b>From:</b> {e.from || "-"}</div>
                <div><b>Date:</b> {e.date || "-"}</div>
              </div>

              <p style={{ marginTop: 10, opacity: 0.9 }}>
                {e.snippet}
              </p>

              <button
                onClick={() => alert("Next step: Generate reply for this email")}
              >
                Generate Reply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
