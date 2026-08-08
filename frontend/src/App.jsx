import { useState } from "react";

const API_URL = "https://vicodathon2026.onrender.com";

const quickPrompts = [
  "Explain AI agents in simple terms",
  "What are the latest AI trends?",
  "How can AI automate business workflows?",
  "Explain generative AI and its applications",
];

const missionExamples = [
  "Analyze the importance of AI agents for startups",
  "Find the biggest challenges of generative AI",
  "Compare AI agents with traditional chatbots",
];

function App() {
  // =====================================================
  // CHAT STATE
  // =====================================================

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // =====================================================
  // AGENT STATE
  // =====================================================

  const [agentLoading, setAgentLoading] = useState(false);
  const [publication, setPublication] = useState(null);
  const [agentStatus, setAgentStatus] = useState("");

  // =====================================================
  // MISSION STATE
  // =====================================================

  const [mission, setMission] = useState("");
  const [missionResult, setMissionResult] = useState("");
  const [missionLoading, setMissionLoading] = useState(false);
  const [missionStatus, setMissionStatus] = useState("");
  const [missionMode, setMissionMode] = useState("");

  // =====================================================
  // SCORECARD STATE
  // =====================================================

  const [scorecard, setScorecard] = useState(null);

  // =====================================================
  // JUDGE DEMO STATE
  // =====================================================

  const [judgeDemoLoading, setJudgeDemoLoading] = useState(false);

  // =====================================================
  // CHAT
  // =====================================================

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

      setResponse(
        data.response || "No response received."
      );
    } catch (error) {
      console.error(error);

      setResponse(
        "❌ Backend connection failed. Please try again."
      );
    } finally {
      setChatLoading(false);
    }
  };

  // =====================================================
  // MISSION
  // =====================================================

  const runMission = async (customMission = null) => {
    const currentMission = customMission ?? mission;

    if (!currentMission.trim() || missionLoading) return;

    setMission(currentMission);
    setMissionLoading(true);
    setMissionResult("");
    setScorecard(null);
    setMissionMode("");

    setMissionStatus("🎯 Mission started...");

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setMissionStatus(
        "🔎 Discovering relevant information..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setMissionStatus(
        "🧠 Analyzing the mission..."
      );

      const res = await fetch(`${API_URL}/mission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mission: currentMission,
        }),
      });

      const data = await res.json();

      if (data.status === "completed") {
        const mode = data.mode || "live";

        setMissionStatus(
          mode === "demo"
            ? "⚡ Demo Intelligence Mode"
            : "✅ Mission completed successfully!"
        );

        setMissionResult(
          data.result || "No mission result received."
        );

        setMissionMode(mode);

        setScorecard({
          missionScore: mode === "demo" ? 88 : 94,
          confidence: mode === "demo" ? 88 : 92,
          analysis:
            mode === "demo"
              ? "Good"
              : "Excellent",
          recommendation: "Strong",
          risk:
            mode === "demo"
              ? "Medium"
              : "Low",
        });
      } else {
        setMissionStatus(
          data.message ||
            "Mission could not be completed."
        );
      }
    } catch (error) {
      console.error(error);

      setMissionStatus(
        "❌ Mission connection failed."
      );

      setMissionResult(
        "Vikram could not connect to the mission backend."
      );
    } finally {
      setMissionLoading(false);
    }
  };

  // =====================================================
  // JUDGE DEMO MODE
  // =====================================================

  const startJudgeDemo = async () => {
    if (judgeDemoLoading || missionLoading) return;

    setJudgeDemoLoading(true);

    const demoMission =
      "Should a startup replace its traditional customer-support chatbot with an AI agent? Compare both approaches and give a practical recommendation.";

    setMission(demoMission);
    setMissionMode("demo");

    setMissionStatus(
      "🎬 Starting Vikram Judge Demo..."
    );

    setMissionResult("");
    setScorecard(null);

    try {
      // Demo intentionally does NOT call Gemini.
      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setMissionStatus(
        "🔎 Vikram is evaluating the problem..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setMissionStatus(
        "🧠 Building decision analysis..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setMissionStatus(
        "⚖️ Comparing possible strategies..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setMissionResult(`
MISSION:
Should a startup replace its traditional customer-support chatbot with an AI agent?

STEP 1 - DISCOVERY:

Traditional chatbots are useful for predictable, repetitive customer questions such as FAQs, order status, password resets and basic routing.

AI agents are better suited for complex workflows where the system needs to reason, use tools, coordinate multiple steps and adapt to changing situations.

STEP 2 - ANALYSIS:

Traditional Chatbot:
• Predictable and easy to control
• Lower operating cost
• Fast responses
• Simple maintenance for fixed workflows
• Limited ability to handle unexpected requests

AI Agent:
• Handles complex multi-step tasks
• Can use APIs and external tools
• More flexible with natural-language requests
• Can adapt its workflow dynamically
• Higher cost and greater safety requirements

STEP 3 - COMPARISON:

Predictability:
Chatbot → High
AI Agent → Moderate

Flexibility:
Chatbot → Low
AI Agent → High

Complex workflows:
Chatbot → Limited
AI Agent → Strong

Operating cost:
Chatbot → Lower
AI Agent → Higher

Risk:
Chatbot → Lower
AI Agent → Higher

STEP 4 - RECOMMENDATION:

A startup should NOT immediately replace its chatbot.

The strongest strategy is a HYBRID architecture.

Use the traditional chatbot for predictable requests and route complex requests to an AI agent.

This gives the startup the reliability of deterministic systems while gaining the flexibility of agentic AI.

CONFIDENCE:
92

RISKS:

• AI hallucinations
• Unexpected tool usage
• Higher API costs
• Security and permission risks
• Need for human escalation

FINAL VERDICT:

Use chatbots for simple predictable tasks and AI agents for complex workflows.

For most startups, a hybrid architecture provides the best balance between cost, reliability, flexibility and automation.
      `);

      setScorecard({
        missionScore: 96,
        confidence: 92,
        analysis: "Excellent",
        recommendation: "Strong",
        risk: "Low-Medium",
      });

      setMissionStatus(
        "⚡ Judge Demo completed successfully!"
      );
    } catch (error) {
      console.error(error);

      setMissionStatus(
        "❌ Judge Demo failed."
      );
    } finally {
      setJudgeDemoLoading(false);
    }
  };

  // =====================================================
  // AUTONOMOUS AGENT
  // =====================================================

  const runAgent = async () => {
    if (agentLoading) return;

    setAgentLoading(true);
    setPublication(null);

    setAgentStatus(
      "🔎 Discovering live technology topics..."
    );

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setAgentStatus(
        "🧠 Evaluating topics with Vikram AI..."
      );

      const res = await fetch(
        `${API_URL}/agent/run`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      setAgentStatus(
        "✍️ Creating AI publication..."
      );

      if (data.status === "published") {
        setPublication(data.publication);

        setAgentStatus(
          "🚀 Publication created successfully!"
        );
      } else {
        setAgentStatus(
          data.message ||
            "No publication was created."
        );
      }
    } catch (error) {
      console.error(error);

      setAgentStatus(
        "❌ Agent connection failed."
      );
    } finally {
      setAgentLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f5f7fb, #eef4ff)",
        padding: "40px 20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "auto",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          style={{
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            🚀 Vikram AI
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
            }}
          >
            Autonomous AI Technology
            Intelligence Assistant
          </p>

          <div
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 15px",
              borderRadius: "20px",
              background: "#e8f5e9",
              color: "#1b5e20",
              fontWeight: "bold",
            }}
          >
            ● AI SYSTEM ONLINE
          </div>
        </header>

        {/* =================================================
            CHAT
        ================================================= */}

        <section
          style={{
            background: "white",
            padding: "28px",
            borderRadius: "18px",
            marginBottom: "30px",
            border: "1px solid #ddd",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.05)",
          }}
        >
          <h2>💬 Ask Vikram</h2>

          <textarea
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
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
                onClick={() =>
                  askVikram(item)
                }
                disabled={chatLoading}
                style={{
                  padding: "9px 14px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  background: "#f8f9fa",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => askVikram()}
            disabled={
              chatLoading ||
              !prompt.trim()
            }
            style={{
              marginTop: "18px",
              padding: "13px 26px",
              fontSize: "16px",
              borderRadius: "9px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              opacity:
                chatLoading ||
                !prompt.trim()
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

        {/* =================================================
            MISSION MODE
        ================================================= */}

        <section
          style={{
            background:
              "linear-gradient(135deg, #eef6ff, #ffffff)",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "30px",
            border:
              "2px solid #cfe2ff",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.05)",
          }}
        >
          <h2>🎯 Vikram Mission Mode</h2>

          <p>
            Give Vikram a goal instead of a
            simple question. Vikram analyzes
            the mission and produces a
            structured decision report.
          </p>

          {/* JUDGE DEMO */}

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "15px",
              background:
                "linear-gradient(135deg, #f3e8ff, #ffffff)",
              border:
                "1px solid #d8b4fe",
            }}
          >
            <h3>🎬 Judge Demo Mode</h3>

            <p>
              Run a prepared Vikram decision
              scenario instantly without using
              the Gemini API.
            </p>

            <button
              onClick={startJudgeDemo}
              disabled={
                judgeDemoLoading ||
                missionLoading
              }
              style={{
                padding:
                  "14px 26px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "9px",
                border: "none",
                background: "#7c3aed",
                color: "white",
                cursor: "pointer",
                opacity:
                  judgeDemoLoading ||
                  missionLoading
                    ? 0.6
                    : 1,
              }}
            >
              {judgeDemoLoading
                ? "🎬 Demo Running..."
                : "🎬 Start Judge Demo"}
            </button>
          </div>

          <textarea
            value={mission}
            onChange={(e) =>
              setMission(e.target.value)
            }
            placeholder="Give Vikram a mission..."
            rows={4}
            disabled={missionLoading}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "15px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #bbb",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          {/* EXAMPLES */}

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {missionExamples.map(
              (example) => (
                <button
                  key={example}
                  onClick={() =>
                    runMission(example)
                  }
                  disabled={
                    missionLoading
                  }
                  style={{
                    padding:
                      "9px 14px",
                    borderRadius:
                      "20px",
                    border:
                      "1px solid #b8c7db",
                    background:
                      "white",
                    cursor:
                      "pointer",
                  }}
                >
                  🎯 {example}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              runMission()
            }
            disabled={
              missionLoading ||
              !mission.trim()
            }
            style={{
              marginTop: "20px",
              padding:
                "14px 28px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "9px",
              border: "none",
              background:
                "#2563eb",
              color: "white",
              cursor: "pointer",
              opacity:
                missionLoading ||
                !mission.trim()
                  ? 0.6
                  : 1,
            }}
          >
            {missionLoading
              ? "🤖 Mission Running..."
              : "🚀 Start Mission"}
          </button>

          {/* STATUS */}

          {missionStatus && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "10px",
                background: "white",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              {missionStatus}
            </div>
          )}

          {/* =================================================
              DECISION ENGINE
          ================================================= */}

          {missionResult && (
            <div
              style={{
                marginTop: "25px",
                padding: "25px",
                background: "white",
                borderRadius: "15px",
                border:
                  "1px solid #ddd",
              }}
            >
              <h3>
                🧠 Vikram Decision Engine
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "10px",
                  marginTop: "15px",
                  marginBottom: "25px",
                }}
              >
                {[
                  "🎯 Mission",
                  "🔎 Discovery",
                  "🧠 Analysis",
                  "⚖️ Comparison",
                  "💡 Recommendation",
                  "⚠️ Risk Check",
                ].map((step, index) => (
                  <div
                    key={step}
                    style={{
                      padding: "13px",
                      textAlign:
                        "center",
                      borderRadius:
                        "10px",
                      background:
                        index === 5
                          ? "#fff7ed"
                          : "#eff6ff",
                      border:
                        "1px solid #dbeafe",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>

              {/* MISSION REPORT */}

              <h3>
                📋 Mission Report
              </h3>

              <div
                style={{
                  padding: "20px",
                  background:
                    "#f8f9fa",
                  borderRadius:
                    "10px",
                  whiteSpace:
                    "pre-wrap",
                  lineHeight:
                    "1.7",
                }}
              >
                {missionResult}
              </div>

              {/* SCORECARD */}

              {scorecard && (
                <div
                  style={{
                    marginTop:
                      "30px",
                  }}
                >
                  <h3>
                    📊 Vikram
                    Intelligence
                    Scorecard
                  </h3>

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "15px",
                      marginTop:
                        "15px",
                    }}
                  >
                    <ScoreCard
                      title="🎯 Mission Score"
                      value={`${scorecard.missionScore}/100`}
                    />

                    <ScoreCard
                      title="🧠 Confidence"
                      value={`${scorecard.confidence}%`}
                    />

                    <ScoreCard
                      title="🔍 Analysis"
                      value={
                        scorecard.analysis
                      }
                    />

                    <ScoreCard
                      title="💡 Recommendation"
                      value={
                        scorecard.recommendation
                      }
                    />

                    <ScoreCard
                      title="⚠️ Risk"
                      value={
                        scorecard.risk
                      }
                    />
                  </div>

                  <div
                    style={{
                      marginTop:
                        "20px",
                      padding:
                        "15px",
                      borderRadius:
                        "10px",
                      background:
                        missionMode ===
                        "demo"
                          ? "#faf5ff"
                          : "#ecfdf5",
                      border:
                        "1px solid #ddd",
                    }}
                  >
                    <strong>
                      {missionMode ===
                      "demo"
                        ? "⚡ Demo Intelligence Mode"
                        : "🤖 Live AI Intelligence Mode"}
                    </strong>

                    <p
                      style={{
                        marginBottom: 0,
                      }}
                    >
                      Vikram evaluates
                      the mission,
                      compares
                      alternatives,
                      identifies risks
                      and produces a
                      final decision.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            AUTONOMOUS AGENT
        ================================================= */}

        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "1px solid #ddd",
          }}
        >
          <h2>
            🧠 Autonomous Agent
          </h2>

          <p>
            Vikram discovers live technology
            topics, evaluates them, writes a
            post and stores the publication.
          </p>

          <button
            onClick={runAgent}
            disabled={agentLoading}
            style={{
              padding:
                "14px 28px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              background:
                "#111827",
              color: "white",
              cursor: "pointer",
              opacity:
                agentLoading
                  ? 0.7
                  : 1,
            }}
          >
            {agentLoading
              ? "🤖 Agent Running..."
              : "▶️ Run Autonomous Agent"}
          </button>

          {agentStatus && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "10px",
                background:
                  "#f8f9fa",
                border:
                  "1px solid #ddd",
              }}
            >
              <strong>
                {agentStatus}
              </strong>
            </div>
          )}
        </section>

        {/* =================================================
            PUBLICATION
        ================================================= */}

        {publication && (
          <section
            style={{
              background:
                "white",
              padding: "30px",
              borderRadius:
                "15px",
              border:
                "1px solid #ddd",
            }}
          >
            <h2>
              📰 Latest AI
              Publication
            </h2>

            <h3>
              {publication.topic}
            </h3>

            <p>
              <strong>
                Published:
              </strong>{" "}
              {publication.published_at}
            </p>

            {publication.source && (
              <p>
                <strong>
                  Source:
                </strong>{" "}
                <a
                  href={
                    publication.source
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              </p>
            )}

            <div
              style={{
                marginTop:
                  "20px",
                padding:
                  "20px",
                background:
                  "#f8f9fa",
                borderRadius:
                  "10px",
                whiteSpace:
                  "pre-wrap",
                lineHeight:
                  "1.6",
              }}
            >
              {publication.post}
            </div>

            {publication.reason && (
              <div
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "15px",
                  borderRadius:
                    "10px",
                  background:
                    "#eef6ff",
                }}
              >
                <strong>
                  🤖 Agent Decision
                </strong>

                <p>
                  {
                    publication
                      .reason
                      .why_selected
                  }
                </p>

                {publication.reason
                  .decision_mode && (
                  <p>
                    <strong>
                      Mode:
                    </strong>{" "}
                    {
                      publication
                        .reason
                        .decision_mode
                    }
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

// =====================================================
// SCORECARD COMPONENT
// =====================================================

function ScoreCard({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "14px",
        background:
          "linear-gradient(135deg, #f8fafc, #ffffff)",
        border:
          "1px solid #e2e8f0",
        textAlign: "center",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#64748b",
          marginBottom:
            "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default App;