import { useState } from "react";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await res.json();

      setResponse(data.response || "No response received.");
    } catch (error) {
      setResponse("Backend connection failed.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>🤖 Vikram AI</h1>

      <p>
        Ask Vikram AI anything about technology, AI or development.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
        rows="5"
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "12px 25px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask Vikram AI"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Vikram AI Response</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}