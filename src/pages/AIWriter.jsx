import { useEffect, useState } from "react";
import api from "../services/api";

export default function AIWriter() {
  const [type, setType] = useState("Email Reply");
  const [tone, setTone] = useState("Professional");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await api.get("/ai/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const generate = async () => {
    setLoading(true);
    setOutput("");

    try {
      const res = await api.post("/ai/generate", {
        type,
        tone,
        input,
      });

      setOutput(res.data.output);

      // ✅ refresh history after generation
      await loadHistory();
    } catch (err) {
      alert(err.response?.data?.detail || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: 900, margin: "0 auto" }}>
      <h2>AI Writer</h2>

      {/* Type */}
      <div style={{ marginTop: 10 }}>
        <label>Document type</label>
        <br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Email Reply</option>
          <option>Proposal</option>
          <option>Quotation</option>
          <option>Announcement</option>
        </select>
      </div>

      {/* Tone */}
      <div style={{ marginTop: 10 }}>
        <label>Tone</label>
        <br />
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option>Professional</option>
          <option>Friendly</option>
          <option>Short</option>
          <option>Persuasive</option>
        </select>
      </div>

      {/* Input */}
      <div style={{ marginTop: 15 }}>
        <label>Instructions</label>
        <br />
        <textarea
          rows={7}
          style={{ width: "100%" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: Write a proposal for a website redesign project..."
        />
      </div>

      <button
        style={{ marginTop: 15 }}
        onClick={generate}
        disabled={loading || !input}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Output */}
      {output && (
        <div style={{ marginTop: 20 }}>
          <label>Output</label>
          <textarea
            rows={10}
            style={{ width: "100%" }}
            value={output}
            readOnly
          />
          <button
            style={{ marginTop: 10 }}
            onClick={() => {
              navigator.clipboard.writeText(output);
              alert("Copied!");
            }}
          >
            Copy
          </button>
        </div>
      )}

      {/* History */}
      <hr style={{ margin: "30px 0" }} />

      <h3>History</h3>

      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <div>
          {history.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setType(item.type);
                setTone(item.tone);
                setInput(item.input);
                setOutput(item.output);
              }}
            >
              <strong>{item.type}</strong> ({item.tone})
              <br />
              <small>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : ""}
              </small>
              <br />
              <small style={{ color: "#666" }}>
                {item.input?.slice(0, 100)}...
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
