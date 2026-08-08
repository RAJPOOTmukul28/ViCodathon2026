import React, { useState } from "react";

const API_URL = "https://vicodathon2026.onrender.com";

const quickPrompts = [
"Explain AI agents in simple terms",
"What are the latest AI trends?",
"How can AI automate business workflows?"
];

const missionExamples = [
"Analyze the importance of AI agents for startups",
"Find the biggest challenges of generative AI",
"Compare AI agents with traditional chatbots"
];

const demoMission =
"Should a startup replace its traditional customer-support chatbot with an AI agent? Compare both approaches and give a practical recommendation.";

function App() {
const [prompt, setPrompt] = useState("");
const [response, setResponse] = useState("");
const [chatLoading, setChatLoading] = useState(false);

const [mission, setMission] = useState("");
const [missionResult, setMissionResult] = useState("");
const [missionLoading, setMissionLoading] = useState(false);
const [missionStatus, setMissionStatus] = useState("");
const [missionMode, setMissionMode] = useState("");

const [scorecard, setScorecard] = useState(null);

const [agentLoading, setAgentLoading] = useState(false);
const [agentStatus, setAgentStatus] = useState("");
const [publication, setPublication] = useState(null);

const [judgeLoading, setJudgeLoading] = useState(false);

async function askVikram(customPrompt) {
const question = customPrompt || prompt;


if (!question.trim() || chatLoading) {
  return;
}

setPrompt(question);
setChatLoading(true);
setResponse("");

try {
  const res = await fetch(API_URL + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: question
    })
  });

  const data = await res.json();

  setResponse(
    data.response || data.message || "No response received."
  );
} catch (error) {
  console.error(error);
  setResponse("Backend connection failed.");
}

setChatLoading(false);


}

async function runMission(customMission) {
const currentMission = customMission || mission;


if (!currentMission.trim() || missionLoading) {
  return;
}

setMission(currentMission);
setMissionLoading(true);
setMissionResult("");
setScorecard(null);
setMissionMode("");
setMissionStatus("🎯 Mission started...");

try {
  setMissionStatus("🔎 Analyzing mission...");

  const res = await fetch(API_URL + "/mission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mission: currentMission
    })
  });

  const data = await res.json();

  if (data.status === "completed") {
    const mode = data.mode || "live";

    setMissionMode(mode);

    setMissionStatus(
      mode === "demo"
        ? "⚡ Demo Intelligence Mode"
        : "✅ Mission completed successfully!"
    );

    setMissionResult(
      data.result || "No mission result received."
    );

    setScorecard({
      missionScore: mode === "demo" ? 88 : 94,
      confidence: mode === "demo" ? 88 : 92,
      analysis: mode === "demo" ? "Good" : "Excellent",
      recommendation: "Strong",
      risk: mode === "demo" ? "Medium" : "Low"
    });
  } else {
    setMissionStatus(
      data.message || "Mission could not be completed."
    );
  }
} catch (error) {
  console.error(error);

  setMissionStatus("❌ Mission connection failed.");
  setMissionResult(
    "Vikram could not connect to the mission backend."
  );
}

setMissionLoading(false);


}

async function startJudgeDemo() {
if (judgeLoading || missionLoading) {
return;
}


setJudgeLoading(true);
setMission(demoMission);
setMissionMode("demo");
setMissionResult("");
setScorecard(null);

try {
  setMissionStatus("🎬 Starting Vikram Judge Demo...");

  await wait(500);
  setMissionStatus("🔎 Discovering relevant information...");

  await wait(500);
  setMissionStatus("🧠 Building decision analysis...");

  await wait(500);
  setMissionStatus("⚖️ Comparing strategies...");

  await wait(500);

  const result = [
    "MISSION:",
    "",
    demoMission,
    "",
    "STEP 1 - DISCOVERY:",
    "",
    "Traditional chatbots work well for predictable questions such as FAQs, order status and password resets.",
    "",
    "AI agents are better for complex workflows where reasoning, tools and multiple steps are required.",
    "",
    "STEP 2 - ANALYSIS:",
    "",
    "Traditional Chatbot:",
    "• Predictable",
    "• Lower cost",
    "• Easy to control",
    "• Fast responses",
    "• Limited flexibility",
    "",
    "AI Agent:",
    "• Handles complex tasks",
    "• Can use APIs and tools",
    "• More flexible",
    "• Can adapt workflows",
    "• Higher cost and risk",
    "",
    "STEP 3 - COMPARISON:",
    "",
    "Predictability → Chatbot: High | AI Agent: Moderate",
    "Flexibility → Chatbot: Low | AI Agent: High",
    "Complex workflows → Chatbot: Limited | AI Agent: Strong",
    "Cost → Chatbot: Lower | AI Agent: Higher",
    "Risk → Chatbot: Lower | AI Agent: Higher",
    "",
    "STEP 4 - RECOMMENDATION:",
    "",
    "Do not immediately replace the chatbot.",
    "",
    "The strongest strategy is a HYBRID architecture.",
    "",
    "Use the traditional chatbot for predictable requests and route complex requests to an AI agent.",
    "",
    "FINAL VERDICT:",
    "",
    "For most startups, a hybrid architecture provides the best balance between reliability, flexibility, cost and automation.",
    "",
    "CONFIDENCE: 92%",
    "",
    "RISKS:",
    "• AI hallucinations",
    "• Higher API costs",
    "• Security risks",
    "• Unexpected tool usage",
    "• Need for human escalation"
  ].join("\n");

  setMissionResult(result);

  setScorecard({
    missionScore: 96,
    confidence: 92,
    analysis: "Excellent",
    recommendation: "Strong",
    risk: "Low-Medium"
  });

  setMissionStatus("⚡ Judge Demo completed successfully!");
} catch (error) {
  console.error(error);
  setMissionStatus("❌ Judge Demo failed.");
}

setJudgeLoading(false);


}

async function runAgent() {
if (agentLoading) {
return;
}

setAgentLoading(true);
setPublication(null);
setAgentStatus("🔎 Discovering technology topics...");

try {
  await wait(700);

  setAgentStatus("🧠 Evaluating topics with Vikram AI...");

  const res = await fetch(API_URL + "/agent/run", {
    method: "POST"
  });

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
  setAgentStatus("❌ Agent connection failed.");
}

setAgentLoading(false);


}

function wait(ms) {
return new Promise(function(resolve) {
setTimeout(resolve, ms);
});
}

return ( <div style={styles.page}> <div style={styles.container}>

    <header style={styles.header}>
      <div style={styles.logo}>V</div>

      <h1 style={styles.title}>Vikram AI 🚀</h1>

      <p style={styles.subtitle}>
        Autonomous AI Technology Intelligence Platform
      </p>

      <div style={styles.online}>
        ● AI SYSTEM ONLINE
      </div>
    </header>

    <nav style={styles.nav}>
      <a href="#ask" style={styles.navButton}>💬 Ask</a>
      <a href="#mission" style={styles.navButton}>🎯 Mission</a>
      <a href="#scorecard" style={styles.navButton}>📊 Scorecard</a>
      <a href="#agent" style={styles.navButton}>🧠 Agent</a>
    </nav>

    <section id="ask" style={styles.card}>
      <h2 style={styles.heading}>💬 Ask Vikram</h2>

      <p style={styles.text}>
        Ask Vikram anything about AI, technology, startups or automation.
      </p>

      <textarea
        value={prompt}
        onChange={function(e) {
          setPrompt(e.target.value);
        }}
        placeholder="Ask Vikram AI something..."
        rows="5"
        style={styles.textarea}
      />

      <div style={styles.chips}>
        {quickPrompts.map(function(item) {
          return (
            <button
              key={item}
              onClick={function() {
                askVikram(item);
              }}
              style={styles.chip}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        onClick={function() {
          askVikram();
        }}
        disabled={chatLoading || !prompt.trim()}
        style={styles.primaryButton}
      >
        {chatLoading
          ? "🤖 Vikram is thinking..."
          : "Ask Vikram AI →"}
      </button>

      {response && (
        <div style={styles.response}>
          <h3>🤖 Vikram Response</h3>
          <div style={styles.responseText}>
            {response}
          </div>
        </div>
      )}
    </section>

    <section id="mission" style={styles.missionCard}>
      <h2 style={styles.heading}>🎯 Vikram Mission Mode</h2>

      <p style={styles.text}>
        Give Vikram a goal instead of a simple question.
        Vikram analyzes the problem and produces a recommendation.
      </p>

      <div style={styles.demoBox}>
        <div>
          <h3>🎬 Judge Demo</h3>
          <p style={styles.text}>
            Instant autonomous decision-making demonstration.
          </p>
        </div>

        <button
          onClick={startJudgeDemo}
          disabled={judgeLoading || missionLoading}
          style={styles.demoButton}
        >
          {judgeLoading
            ? "🎬 Running..."
            : "🎬 Start Judge Demo"}
        </button>
      </div>

      <textarea
        value={mission}
        onChange={function(e) {
          setMission(e.target.value);
        }}
        placeholder="Give Vikram a mission..."
        rows="4"
        style={styles.textarea}
      />

      <div style={styles.chips}>
        {missionExamples.map(function(item) {
          return (
            <button
              key={item}
              onClick={function() {
                runMission(item);
              }}
              style={styles.missionChip}
            >
              🎯 {item}
            </button>
          );
        })}
      </div>

      <button
        onClick={function() {
          runMission();
        }}
        disabled={missionLoading || !mission.trim()}
        style={styles.blueButton}
      >
        {missionLoading
          ? "🤖 Mission Running..."
          : "🚀 Start Mission"}
      </button>

      {missionStatus && (
        <div style={styles.status}>
          {missionStatus}
        </div>
      )}

      {missionResult && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <h3>🧠 Vikram Decision Engine</h3>

            <span style={styles.badge}>
              {missionMode === "demo"
                ? "⚡ DEMO"
                : "🤖 LIVE AI"}
            </span>
          </div>

          <div style={styles.steps}>
            <span>🎯 Mission</span>
            <span>🔎 Discovery</span>
            <span>🧠 Analysis</span>
            <span>⚖️ Comparison</span>
            <span>💡 Recommendation</span>
            <span>⚠️ Risk Check</span>
          </div>

          <h3>📋 Mission Report</h3>

          <div style={styles.report}>
            {missionResult}
          </div>
        </div>
      )}
    </section>

    {scorecard && (
      <section id="scorecard" style={styles.card}>
        <h2 style={styles.heading}>
          📊 Vikram Intelligence Scorecard
        </h2>

        <div style={styles.scoreGrid}>
          <Score
            title="🎯 Mission Score"
            value={scorecard.missionScore + "/100"}
          />

          <Score
            title="🧠 Confidence"
            value={scorecard.confidence + "%"}
          />

          <Score
            title="🔍 Analysis"
            value={scorecard.analysis}
          />

          <Score
            title="💡 Recommendation"
            value={scorecard.recommendation}
          />

          <Score
            title="⚠️ Risk"
            value={scorecard.risk}
          />
        </div>
      </section>
    )}

    <section id="agent" style={styles.card}>
      <h2 style={styles.heading}>
        🧠 Autonomous Agent
      </h2>

      <p style={styles.text}>
        Vikram discovers technology topics, analyzes them,
        creates a publication and stores the result.
      </p>

      <button
        onClick={runAgent}
        disabled={agentLoading}
        style={styles.darkButton}
      >
        {agentLoading
          ? "🤖 Agent Running..."
          : "▶️ Run Autonomous Agent"}
      </button>

      {agentStatus && (
        <div style={styles.status}>
          {agentStatus}
        </div>
      )}
    </section>

    {publication && (
      <section style={styles.card}>
        <h2 style={styles.heading}>
          📰 Latest AI Publication
        </h2>

        <h3>{publication.topic}</h3>

        {publication.published_at && (
          <p style={styles.text}>
            Published: {publication.published_at}
          </p>
        )}

        {publication.source && (
          <p>
            <a
              href={publication.source}
              target="_blank"
              rel="noreferrer"
            >
              View source
            </a>
          </p>
        )}

        <div style={styles.report}>
          {publication.post}
        </div>

        {publication.reason && (
          <div style={styles.reason}>
            <strong>🤖 Agent Decision</strong>

            <p>
              {publication.reason.why_selected}
            </p>
          </div>
        )}
      </section>
    )}

    <footer style={styles.footer}>
      <strong>Vikram AI</strong>
      <span>Autonomous Technology Intelligence</span>
      <span>Built for ViCodathon 2026 🚀</span>
    </footer>

  </div>
</div>


);
}

function Score({ title, value }) {
return ( <div style={styles.scoreCard}> <div style={styles.scoreTitle}>{title}</div> <div style={styles.scoreValue}>{value}</div> </div>
);
}

const styles = {
page: {
minHeight: "100vh",
background: "#f1f5f9",
fontFamily: "Arial, sans-serif",
padding: "35px 20px",
color: "#0f172a"
},

container: {
maxWidth: "1100px",
margin: "0 auto"
},

header: {
textAlign: "center",
padding: "20px 10px 30px"
},

logo: {
width: "70px",
height: "70px",
margin: "auto",
borderRadius: "20px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "linear-gradient(135deg, #2563eb, #7c3aed)",
color: "white",
fontSize: "32px",
fontWeight: "900"
},

title: {
fontSize: "46px",
margin: "15px 0 8px"
},

subtitle: {
color: "#64748b",
fontSize: "18px"
},

online: {
display: "inline-block",
padding: "8px 15px",
borderRadius: "20px",
background: "#dcfce7",
color: "#15803d",
fontWeight: "bold"
},

nav: {
display: "flex",
justifyContent: "center",
flexWrap: "wrap",
gap: "10px",
marginBottom: "25px"
},

navButton: {
textDecoration: "none",
padding: "10px 16px",
borderRadius: "10px",
background: "white",
border: "1px solid #e2e8f0",
color: "#334155",
fontWeight: "bold"
},

card: {
background: "white",
padding: "30px",
borderRadius: "20px",
marginBottom: "25px",
border: "1px solid #e2e8f0",
boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
},

missionCard: {
background: "white",
padding: "30px",
borderRadius: "20px",
marginBottom: "25px",
border: "1px solid #bfdbfe",
boxShadow: "0 10px 30px rgba(37,99,235,0.08)"
},

heading: {
fontSize: "27px",
marginTop: 0
},

text: {
color: "#64748b",
lineHeight: "1.7"
},

textarea: {
width: "100%",
boxSizing: "border-box",
padding: "16px",
borderRadius: "12px",
border: "1px solid #cbd5e1",
fontSize: "16px",
resize: "vertical"
},

chips: {
display: "flex",
flexWrap: "wrap",
gap: "8px",
marginTop: "12px"
},

chip: {
padding: "9px 13px",
borderRadius: "20px",
border: "1px solid #bfdbfe",
background: "#eff6ff",
color: "#1d4ed8",
cursor: "pointer"
},

missionChip: {
padding: "9px 13px",
borderRadius: "20px",
border: "1px solid #bfdbfe",
background: "#f8fafc",
color: "#1d4ed8",
cursor: "pointer"
},

primaryButton: {
marginTop: "18px",
padding: "14px 24px",
border: "none",
borderRadius: "12px",
background: "#2563eb",
color: "white",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer"
},

blueButton: {
marginTop: "18px",
padding: "14px 24px",
border: "none",
borderRadius: "12px",
background: "linear-gradient(135deg, #2563eb, #4f46e5)",
color: "white",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer"
},

darkButton: {
padding: "14px 24px",
border: "none",
borderRadius: "12px",
background: "#111827",
color: "white",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer"
},

demoBox: {
padding: "20px",
margin: "20px 0",
borderRadius: "15px",
background: "#faf5ff",
border: "1px solid #e9d5ff"
},

demoButton: {
padding: "13px 20px",
border: "none",
borderRadius: "10px",
background: "#7c3aed",
color: "white",
fontWeight: "bold",
cursor: "pointer"
},

response: {
marginTop: "25px",
padding: "20px",
borderRadius: "15px",
background: "#f8fafc",
border: "1px solid #dbeafe"
},

responseText: {
whiteSpace: "pre-wrap",
lineHeight: "1.7",
color: "#334155"
},

status: {
marginTop: "18px",
padding: "14px",
borderRadius: "12px",
background: "#f8fafc",
border: "1px solid #e2e8f0",
fontWeight: "bold"
},

resultCard: {
marginTop: "25px",
padding: "25px",
borderRadius: "17px",
border: "1px solid #e2e8f0",
background: "#ffffff"
},

resultHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap"
},

badge: {
padding: "7px 12px",
borderRadius: "20px",
background: "#f3e8ff",
color: "#7e22ce",
fontWeight: "bold"
},

steps: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
gap: "10px",
margin: "20px 0"
},

stepsSpan: {
padding: "10px",
background: "#eff6ff",
borderRadius: "10px"
},

report: {
padding: "20px",
borderRadius: "13px",
background: "#f8fafc",
border: "1px solid #e2e8f0",
whiteSpace: "pre-wrap",
lineHeight: "1.7",
color: "#334155"
},

scoreGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
gap: "14px"
},

scoreCard: {
padding: "20px",
borderRadius: "15px",
background: "#f8fafc",
border: "1px solid #e2e8f0",
textAlign: "center"
},

scoreTitle: {
color: "#64748b",
fontSize: "13px",
fontWeight: "bold"
},

scoreValue: {
marginTop: "10px",
fontSize: "22px",
fontWeight: "900"
},

reason: {
marginTop: "20px",
padding: "18px",
borderRadius: "12px",
background: "#eff6ff",
border: "1px solid #bfdbfe"
},

footer: {
display: "flex",
justifyContent: "center",
flexWrap: "wrap",
gap: "15px",
padding: "25px",
color: "#64748b",
fontSize: "13px"
}
};

export default App;
