import { useState } from "react";
import api from "../services/api";

export default function AIWriter() {
  const [type, setType] = useState("Email Reply");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOutput("");

    try {
      const res = await api.post("/ai/generate", { type, input });
      setOutput(res.data.output);
    } catch (err) {
      alert(err.response?.data?.detail || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: 900, margin: "0 auto" }}>
      <h2>AI Writer</h2>

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
    </div>
  );
}
