import { useState } from "react";

const API_URL = "https://vicodathon2026.onrender.com";

const quickPrompts = [
  "Explain AI agents in simple terms",
  "What are the latest AI trends?",
  "How can AI automate business workflows?",
  "Explain generative AI and its applications",
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [agentLoading, setAgentLoading] = useState(false);
  const [publication, setPublication] = useState(null);
  const [agentStatus, setAgentStatus] = useState("");

  const askVikram = async (customPrompt = null) => {
    const question = customPrompt ?? prompt;

    if (!question.trim() || chatLoading) return;

    setPrompt(question);
    setChatLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: question,
        }),
      });

      const data = await res.json();

      setResponse(data.response || "No response received.");
    } catch (error) {
      console.error(error);
      setResponse(
        "❌ Backend connection failed. The server may be waking up. Please try again."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const runAgent = async () => {
    if (agentLoading) return;

    setAgentLoading(true);
    setPublication(null);

    setAgentStatus("🔎 Discovering live technology topics...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      setAgentStatus("🧠 Evaluating topics with Vikram AI...");

      const res = await fetch(`${API_URL}/agent/run`, {
        method: "POST",
      });

      setAgentStatus("✍️ Creating AI publication...");

      const data = await res.json();

      if (data.status === "published") {
        setPublication(data.publication);
        setAgentStatus("🚀 Publication created successfully!");
      } else {
        setAgentStatus(
          data.message || "No publication was created."
        );
      }
    } catch (error) {
      console.error(error);
      setAgentStatus(
        "❌ Agent connection failed. Please try again."
      );
    } finally {
      setAgentLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        {/* HEADER */}
        <header style={{ marginBottom: "40px" }}>
          <h1>🚀 Vikram AI</h1>

          <p>
            Autonomous AI technology assistant
          </p>
        </header>

        {/* CHAT */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "1px solid #ddd",
          }}
        >
          <h2>💬 Ask Vikram</h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Vikram AI something..."
            rows={5}
            disabled={chatLoading}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          {/* QUICK PROMPTS */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {quickPrompts.map((item) => (
              <button
                key={item}
                onClick={() => askVikram(item)}
                disabled={chatLoading}
                style={{
                  padding: "9px 14px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  background: "#f8f9fa",
                  cursor: chatLoading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => askVikram()}
            disabled={chatLoading || !prompt.trim()}
            style={{
              marginTop: "18px",
              padding: "12px 25px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              cursor:
                chatLoading || !prompt.trim()
                  ? "not-allowed"
                  : "pointer",
              opacity:
                chatLoading || !prompt.trim()
                  ? 0.6
                  : 1,
            }}
          >
            {chatLoading
              ? "🤖 Vikram is thinking..."
              : "Ask Vikram AI"}
          </button>

          {response && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "10px",
                background: "#f8f9fa",
                border: "1px solid #ddd",
              }}
            >
              <h3>🤖 Vikram AI Response</h3>

              <p
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                }}
              >
                {response}
              </p>
            </div>
          )}
        </section>

        {/* AUTONOMOUS AGENT */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "1px solid #ddd",
          }}
        >
          <h2>🧠 Autonomous Agent</h2>

          <p>
            Vikram discovers live technology topics,
            evaluates them, writes a post and stores
            the publication in memory.
          </p>

          <button
            onClick={runAgent}
            disabled={agentLoading}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              cursor: agentLoading
                ? "not-allowed"
                : "pointer",
              opacity: agentLoading ? 0.7 : 1,
            }}
          >
            {agentLoading
              ? "🤖 Agent Running..."
              : "▶️ Run Autonomous Agent"}
          </button>

          {/* AGENT ACTIVITY */}
          {agentStatus && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "10px",
                background: "#f8f9fa",
                border: "1px solid #ddd",
              }}
            >
              <strong>{agentStatus}</strong>
            </div>
          )}
        </section>

        {/* PUBLICATION */}
        {publication && (
          <section
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              border: "1px solid #ddd",
            }}
          >
            <h2>📰 Latest AI Publication</h2>

            <h3>{publication.topic}</h3>

            <p>
              <strong>Published:</strong>{" "}
              {publication.published_at}
            </p>

            {publication.source && (
              <p>
                <strong>Source:</strong>{" "}
                <a
                  href={publication.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              </p>
            )}

            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "10px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {publication.post}
            </div>

            {publication.reason && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#eef6ff",
                }}
              >
                <strong>🤖 Agent Decision</strong>

                <p>
                  {publication.reason.why_selected}
                </p>

                {publication.reason.decision_mode && (
                  <p>
                    <strong>Mode:</strong>{" "}
                    {publication.reason.decision_mode}
                  </p>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;