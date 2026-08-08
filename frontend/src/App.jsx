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
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [agentLoading, setAgentLoading] = useState(false);
  const [publication, setPublication] = useState(null);
  const [agentStatus, setAgentStatus] = useState("");

  const [mission, setMission] = useState("");
  const [missionResult, setMissionResult] = useState("");
  const [missionLoading, setMissionLoading] = useState(false);
  const [missionStatus, setMissionStatus] = useState("");

  const [scorecard, setScorecard] = useState(null);

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

      setResponse(data.response || "No response received.");
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
  // SCORECARD
  // =====================================================

  const generateScorecard = () => {
    /*
      Demo decision-scoring engine.

      This does NOT call Gemini, so it still works when
      the Gemini free quota is exhausted.
    */

    const text = mission.toLowerCase();

    let clarity = 82;
    let innovation = 78;
    let impact = 84;
    let feasibility = 80;
    let risk = 32;

    if (
      text.includes("compare") ||
      text.includes("analyze")
    ) {
      clarity += 5;
      impact += 4;
    }

    if (
      text.includes("startup") ||
      text.includes("business")
    ) {
      impact += 6;
      feasibility += 4;
    }

    if (
      text.includes("generative ai") ||
      text.includes("ai agent")
    ) {
      innovation += 6;
    }

    if (
      text.includes("risk") ||
      text.includes("challenge")
    ) {
      risk += 8;
      clarity += 3;
    }

    clarity = Math.min(clarity, 100);
    innovation = Math.min(innovation, 100);
    impact = Math.min(impact, 100);
    feasibility = Math.min(feasibility, 100);
    risk = Math.min(risk, 100);

    const overall = Math.round(
      (clarity +
        innovation +
        impact +
        feasibility +
        (100 - risk)) /
        5
    );

    let verdict = "🟢 STRONG OPPORTUNITY";

    if (overall < 70) {
      verdict = "🟡 NEEDS FURTHER ANALYSIS";
    }

    if (overall < 50) {
      verdict = "🔴 HIGH UNCERTAINTY";
    }

    setScorecard({
      clarity,
      innovation,
      impact,
      feasibility,
      risk,
      overall,
      verdict,
    });
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

      setMissionStatus("🧠 Analyzing the mission...");

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
        setMissionStatus(
          "✅ Mission completed successfully!"
        );

        setMissionResult(
          data.result || "No mission result received."
        );

        generateScorecard();
      } else {
        setMissionStatus(
          "⚠️ Mission paused — AI credits may be temporarily unavailable."
        );

        setMissionResult(
          data.message ||
            "Vikram could not complete the mission."
        );

        // Still show decision analysis
        generateScorecard();
      }
    } catch (error) {
      console.error(error);

      setMissionStatus(
        "⚠️ Mission paused — backend connection problem."
      );

      setMissionResult(
        "Vikram could not reach the AI service. The local decision scorecard is still available."
      );

      generateScorecard();
    } finally {
      setMissionLoading(false);
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

      const res = await fetch(`${API_URL}/agent/run`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.status === "published") {
        setPublication(data.publication);

        setAgentStatus(
          "🚀 Publication created successfully!"
        );
      } else {
        setAgentStatus(
          "⚠️ Agent paused — AI credits may be temporarily unavailable."
        );
      }
    } catch (error) {
      console.error(error);

      setAgentStatus(
        "⚠️ Agent connection failed."
      );
    } finally {
      setAgentLoading(false);
    }
  };

  // =====================================================
  // SCORE BAR
  // =====================================================

  const ScoreBar = ({ label, value, danger = false }) => (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "7px",
          fontWeight: "bold",
        }}
      >
        <span>{label}</span>
        <span>{value}/100</span>
      </div>

      <div
        style={{
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: danger
              ? "#ef4444"
              : "#2563eb",
            borderRadius: "10px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f5f7fb, #eef4ff)",
        padding: "35px 20px",
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
            background:
              "linear-gradient(135deg, #111827, #2563eb)",
            color: "white",
            padding: "35px",
            borderRadius: "22px",
            marginBottom: "30px",
            boxShadow:
              "0 15px 40px rgba(37,99,235,0.18)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
            }}
          >
            🚀 Vikram AI
          </h1>

          <p
            style={{
              fontSize: "18px",
              opacity: 0.9,
              marginBottom: 0,
            }}
          >
            Autonomous AI Technology Intelligence
            Platform
          </p>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span className="badge">
              💬 Ask
            </span>

            <span className="badge">
              🎯 Mission
            </span>

            <span className="badge">
              🧠 Autonomous Agent
            </span>

            <span className="badge">
              📊 Decision Scorecard
            </span>
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
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.04)",
          }}
        >
          <h2>💬 Ask Vikram</h2>

          <textarea
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            placeholder="Ask Vikram AI something..."
            rows={4}
            disabled={chatLoading}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "9px",
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
                  border:
                    "1px solid #cbd5e1",
                  background: "#f8fafc",
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
              chatLoading || !prompt.trim()
            }
            style={{
              marginTop: "18px",
              padding: "13px 25px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "9px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
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
                padding: "22px",
                borderRadius: "12px",
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <h3>🤖 Vikram AI Response</h3>

              <p
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
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
              "2px solid #bfdbfe",
          }}
        >
          <h2>🎯 Vikram Mission Mode</h2>

          <p
            style={{
              lineHeight: "1.6",
            }}
          >
            Give Vikram a goal instead of a simple
            question. Vikram analyzes the mission,
            generates a structured report and
            evaluates the opportunity.
          </p>

          <textarea
            value={mission}
            onChange={(e) =>
              setMission(e.target.value)
            }
            placeholder="Example: Analyze the importance of AI agents for startups"
            rows={4}
            disabled={missionLoading}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              borderRadius: "12px",
              border:
                "1px solid #cbd5e1",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexWrap: "wrap",
              gap: "9px",
            }}
          >
            {missionExamples.map(
              (example) => (
                <button
                  key={example}
                  onClick={() =>
                    runMission(example)
                  }
                  disabled={missionLoading}
                  style={{
                    padding:
                      "9px 14px",
                    borderRadius:
                      "20px",
                    border:
                      "1px solid #bfdbfe",
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
              cursor:
                "pointer",
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

          {missionStatus && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "10px",
                background:
                  "white",
                border:
                  "1px solid #e2e8f0",
                fontWeight:
                  "bold",
              }}
            >
              {missionStatus}
            </div>
          )}

          {missionResult && (
            <div
              style={{
                marginTop: "25px",
                padding: "25px",
                background:
                  "white",
                borderRadius: "14px",
                border:
                  "1px solid #e2e8f0",
                whiteSpace:
                  "pre-wrap",
                lineHeight: "1.7",
              }}
            >
              <h3>
                📋 Mission Report
              </h3>

              {missionResult}
            </div>
          )}
        </section>

        {/* =================================================
            SCORECARD
        ================================================= */}

        {scorecard && (
          <section
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              marginBottom: "30px",
              border:
                "1px solid #dbeafe",
              boxShadow:
                "0 10px 30px rgba(37,99,235,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                flexWrap:
                  "wrap",
                gap: "15px",
              }}
            >
              <div>
                <h2>
                  📊 Vikram Decision
                  Scorecard
                </h2>

                <p>
                  Multi-factor evaluation
                  of the selected mission.
                </p>
              </div>

              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius:
                    "50%",
                  background:
                    "#eff6ff",
                  border:
                    "8px solid #2563eb",
                  display: "flex",
                  flexDirection:
                    "column",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                <strong
                  style={{
                    fontSize:
                      "27px",
                  }}
                >
                  {scorecard.overall}
                </strong>

                <small>
                  /100
                </small>
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              <ScoreBar
                label="🎯 Goal Clarity"
                value={
                  scorecard.clarity
                }
              />

              <ScoreBar
                label="💡 Innovation"
                value={
                  scorecard.innovation
                }
              />

              <ScoreBar
                label="📈 Potential Impact"
                value={
                  scorecard.impact
                }
              />

              <ScoreBar
                label="⚡ Feasibility"
                value={
                  scorecard.feasibility
                }
              />

              <ScoreBar
                label="⚠️ Risk"
                value={
                  scorecard.risk
                }
                danger
              />
            </div>

            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "14px",
                background:
                  "#f0fdf4",
                border:
                  "1px solid #bbf7d0",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  fontSize:
                    "22px",
                  fontWeight:
                    "bold",
                }}
              >
                {scorecard.verdict}
              </div>

              <p>
                Vikram's preliminary
                decision score:
                <strong>
                  {" "}
                  {scorecard.overall}/100
                </strong>
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            AUTONOMOUS AGENT
        ================================================= */}

        <section
          style={{
            background: "white",
            padding: "28px",
            borderRadius: "18px",
            marginBottom: "30px",
            border:
              "1px solid #e2e8f0",
          }}
        >
          <h2>
            🧠 Autonomous Agent
          </h2>

          <p
            style={{
              lineHeight: "1.6",
            }}
          >
            Vikram discovers technology
            topics, evaluates them,
            creates an AI publication
            and stores the result in
            memory.
          </p>

          <button
            onClick={runAgent}
            disabled={agentLoading}
            style={{
              padding:
                "14px 28px",
              fontSize: "16px",
              fontWeight:
                "bold",
              borderRadius: "9px",
              border: "none",
              background:
                "#111827",
              color: "white",
              cursor:
                "pointer",
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
                  "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                fontWeight:
                  "bold",
              }}
            >
              {agentStatus}
            </div>
          )}
        </section>

        {/* =================================================
            PUBLICATION
        ================================================= */}

        {publication && (
          <section
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              border:
                "1px solid #e2e8f0",
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
                marginTop: "20px",
                padding: "20px",
                background:
                  "#f8fafc",
                borderRadius:
                  "12px",
                whiteSpace:
                  "pre-wrap",
                lineHeight:
                  "1.7",
              }}
            >
              {publication.post}
            </div>

            {publication.reason && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  borderRadius:
                    "12px",
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

        <footer
          style={{
            textAlign: "center",
            marginTop: "35px",
            padding: "20px",
            color: "#64748b",
          }}
        >
          <strong>
            Vikram AI
          </strong>{" "}
          • Ask → Mission → Decide →
          Act
        </footer>
      </div>

      <style>
        {`
          .badge {
            padding: 7px 12px;
            border-radius: 20px;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            font-size: 13px;
          }

          button {
            transition: transform 0.15s ease,
                        box-shadow 0.15s ease;
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
        `}
      </style>
    </div>
  );
}

export default App;