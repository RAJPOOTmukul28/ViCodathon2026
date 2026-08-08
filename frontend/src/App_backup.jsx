import React, { useState } from "react";

const API_URL = "https://vicodathon2026.onrender.com";

function App() {
const [prompt, setPrompt] = useState("");
const [response, setResponse] = useState("");
const [loading, setLoading] = useState(false);

const askVikram = async () => {
if (prompt.trim() === "") {
return;
}


setLoading(true);
setResponse("");

try {
  const res = await fetch(API_URL + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt
    })
  });

  const data = await res.json();

  setResponse(data.response || data.message || "No response received.");
} catch (error) {
  console.log(error);
  setResponse("Backend connection failed.");
}

setLoading(false);


};

return (
<div
style={{
minHeight: "100vh",
background: "#f1f5f9",
padding: "40px 20px",
fontFamily: "Arial"
}}
>
<div
style={{
maxWidth: "900px",
margin: "auto"
}}
>
<div
style={{
background: "white",
padding: "35px",
borderRadius: "20px",
textAlign: "center"
}}
> <h1>Vikram AI 🚀</h1>


      <p>
        Autonomous AI Technology Intelligence Platform
      </p>

      <div
        style={{
          display: "inline-block",
          padding: "8px 15px",
          borderRadius: "20px",
          background: "#dcfce7",
          color: "#15803d"
        }}
      >
        ● AI SYSTEM ONLINE
      </div>
    </div>

    <div
      style={{
        background: "white",
        marginTop: "25px",
        padding: "30px",
        borderRadius: "20px"
      }}
    >
      <h2>💬 Ask Vikram</h2>

      <p>
        Ask Vikram anything about AI, technology,
        startups or automation.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Vikram AI something..."
        rows="5"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          fontSize: "16px"
        }}
      />

      <button
        onClick={() =>
          setPrompt("Explain AI agents in simple terms")
        }
        style={buttonStyle}
      >
        Explain AI agents
      </button>

      <button
        onClick={() =>
          setPrompt("What are the latest AI trends?")
        }
        style={buttonStyle}
      >
        AI Trends
      </button>

      <br />

      <button
        onClick={askVikram}
        disabled={loading}
        style={mainButtonStyle}
      >
        {loading
          ? "Vikram is thinking..."
          : "Ask Vikram AI →"}
      </button>

      {response !== "" && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "15px",
            background: "#f8fafc",
            whiteSpace: "pre-wrap"
          }}
        >
          <h3>🤖 Vikram Response</h3>

          <p>{response}</p>
        </div>
      )}
    </div>
  </div>
</div>


);
}

const buttonStyle = {
marginTop: "12px",
marginRight: "8px",
padding: "9px 14px",
borderRadius: "20px",
border: "1px solid #bfdbfe",
background: "#eff6ff",
color: "#1d4ed8",
cursor: "pointer"
};

const mainButtonStyle = {
marginTop: "18px",
padding: "14px 24px",
border: "none",
borderRadius: "12px",
background: "#2563eb",
color: "white",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer"
};

export default App;
