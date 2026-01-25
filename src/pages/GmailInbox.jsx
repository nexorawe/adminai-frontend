import { useEffect, useState } from "react";
import api from "../services/api";
import UpgradeModal from "../components/UpgradeModal";

export default function GmailInbox() {
  const [emails, setEmails] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [emailDetail, setEmailDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [replyTone, setReplyTone] = useState("Professional");
  const [replyText, setReplyText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Upgrade modal
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");

  const connectGmail = async () => {
    try {
      setError("");
      const res = await api.get("/gmail/connect");
      const url = res.data?.auth_url;
      if (!url) return alert("No auth_url returned from backend");
      window.location.href = url;
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to start Gmail connection");
    }
  };

  const loadEmails = async () => {
    setLoadingList(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.get("/gmail/emails?limit=15");
      setEmails(res.data?.emails || []);
    } catch (err) {
      setEmails([]);
      setError(err.response?.data?.detail || "Failed to load emails");
    } finally {
      setLoadingList(false);
    }
  };

  const loadEmailDetail = async (id) => {
    setSelectedId(id);
    setEmailDetail(null);
    setReplyText("");
    setSuccess("");
    setError("");
    setLoadingDetail(true);

    try {
      const res = await api.get(`/gmail/email/${id}`);
      setEmailDetail(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load email detail");
    } finally {
      setLoadingDetail(false);
    }
  };

  const generateReply = async () => {
    if (!selectedId) return;

    setGenerating(true);
    setError("");
    setSuccess("");
    setReplyText("");

    try {
      const res = await api.post("/gmail/generate-reply", {
        message_id: selectedId,
        tone: replyTone,
      });

      setReplyText(res.data?.reply || "");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.detail || "Failed to generate reply";

      if (status === 402) {
        setUpgradeMsg(msg);
        setUpgradeOpen(true);
      } else {
        setError(msg);
      }
    } finally {
      setGenerating(false);
    }
  };

  const sendReply = async () => {
    if (!selectedId) return;
    if (!replyText.trim()) return alert("Reply cannot be empty");

    setSending(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/gmail/send-reply", {
        message_id: selectedId,
        reply: replyText,
      });

      setSuccess("✅ Reply sent successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Gmail Inbox</h2>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button onClick={loadEmails} disabled={loadingList}>
          {loadingList ? "Loading..." : "Refresh Inbox"}
        </button>

        <button onClick={connectGmail}>Connect Gmail</button>
      </div>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}

      <div style={{ display: "flex", gap: 15, marginTop: 20 }}>
        {/* LEFT: Inbox list */}
        <div
          style={{
            width: "40%",
            border: "1px solid #333",
            borderRadius: 10,
            padding: 10,
            height: "75vh",
            overflowY: "auto",
          }}
        >
          <h3>Inbox</h3>
          {emails.length === 0 ? (
            <p>No emails found.</p>
          ) : (
            emails.map((e) => (
              <div
                key={e.id}
                onClick={() => loadEmailDetail(e.id)}
                style={{
                  border: e.id === selectedId ? "2px solid #000" : "1px solid #999",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <strong>{e.subject || "(No Subject)"}</strong>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{e.from}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{e.snippet}</div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Email preview + Reply */}
        <div
          style={{
            width: "60%",
            border: "1px solid #333",
            borderRadius: 10,
            padding: 15,
            height: "75vh",
            overflowY: "auto",
          }}
        >
          <h3>Email</h3>

          {!selectedId ? (
            <p>Select an email to view details.</p>
          ) : loadingDetail ? (
            <p>Loading email...</p>
          ) : !emailDetail ? (
            <p>Email details not available.</p>
          ) : (
            <>
              <p>
                <b>Subject:</b> {emailDetail.subject || "-"}
              </p>
              <p>
                <b>From:</b> {emailDetail.from || "-"}
              </p>
              <p>
                <b>Date:</b> {emailDetail.date || "-"}
              </p>

              <div style={{ marginTop: 10 }}>
                <b>Body:</b>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    border: "1px solid #aaa",
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 10,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {emailDetail.body || "(No body)"}
                </pre>
              </div>

              <hr style={{ margin: "20px 0" }} />

              <h3>AI Reply</h3>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label>Tone:</label>
                <select
                  value={replyTone}
                  onChange={(e) => setReplyTone(e.target.value)}
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Short</option>
                  <option>Persuasive</option>
                </select>

                <button onClick={generateReply} disabled={generating}>
                  {generating ? "Generating..." : "Generate Reply"}
                </button>
              </div>

              <textarea
                rows={10}
                style={{ width: "100%", marginTop: 10 }}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="AI reply will appear here..."
              />

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  onClick={sendReply}
                  disabled={sending || !replyText.trim()}
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(replyText);
                    alert("Copied!");
                  }}
                  disabled={!replyText.trim()}
                >
                  Copy
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Upgrade Modal */}
      <UpgradeModal
        open={upgradeOpen}
        message={upgradeMsg}
        onClose={() => setUpgradeOpen(false)}
      />
    </div>
  );
}
