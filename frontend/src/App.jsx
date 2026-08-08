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
  const [scorecard, setScorecard] = useState(null);

  // MISSION STATE
  const [mission, setMission] = useState("");
  const [missionResult, setMissionResult] = useState("");
  const [missionLoading, setMissionLoading] = useState(false);
  const [missionStatus, setMissionStatus] = useState("");

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
  // AUTONOMOUS AGENT
  // =====================================================

  const runAgent = async () => {
    if (agentLoading) return;

    setAgentLoading(true);
    setPublication(null);
    setScorecard(null);

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
        setAgentStatus(
          "✍️ Creating AI publication..."
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );

        setPublication(data.publication);

        setScorecard(
          data.publication?.scorecard || null
        );

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
  // MISSION MODE
  // =====================================================

  const runMission = async (customMission = null) => {
    const currentMission =
      customMission ?? mission;

    if (
      !currentMission.trim() ||
      missionLoading
    ) {
      return;
    }

    setMission(currentMission);
    setMissionLoading(true);
    setMissionResult("");

    setMissionStatus(
      "🎯 Mission started..."
    );

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

      const res = await fetch(
        `${API_URL}/mission`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mission: currentMission,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "completed") {
        setMissionStatus(
          "✅ Mission completed successfully!"
        );

        setMissionResult(
          data.result ||
            "No mission result received."
        );
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
    } finally {
      setMissionLoading(false);
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

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          style={{
            marginBottom: "40px",
          }}
        >
          <h1>🚀 Vikram AI</h1>

          <p>
            Autonomous AI technology assistant
          </p>
        </header>

        {/* =================================================
            CHAT
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
              padding: "12px 25px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
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
              <h3>
                🤖 Vikram AI Response
              </h3>

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
            borderRadius: "18px",
            marginBottom: "30px",
            border: "2px solid #cfe2ff",
          }}
        >
          <h2>🎯 Vikram Mission Mode</h2>

          <p>
            Give Vikram a goal instead of a simple
            question. Vikram will analyze the mission
            and return a structured recommendation.
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
              borderRadius: "10px",
              border: "1px solid #bbb",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

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
                  disabled={missionLoading}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "20px",
                    border:
                      "1px solid #b8c7db",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  🎯 {example}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => runMission()}
            disabled={
              missionLoading ||
              !mission.trim()
            }
            style={{
              marginTop: "20px",
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "9px",
              border: "none",
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

          {missionResult && (
            <div
              style={{
                marginTop: "25px",
                padding: "25px",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #ddd",
                whiteSpace: "pre-wrap",
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
            topics, evaluates them, writes a post
            and stores the publication in memory.
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
              cursor: "pointer",
              opacity:
                agentLoading ? 0.7 : 1,
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
                background: "#f8f9fa",
                border: "1px solid #ddd",
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
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              border: "1px solid #ddd",
            }}
          >
            <h2>
              📰 Latest AI Publication
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
                  href={publication.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              </p>
            )}

            {/* =================================================
                DECISION SCORECARD
            ================================================= */}

            {publication.scorecard && (
              <DecisionScorecard
                scorecard={
                  publication.scorecard
                }
              />
            )}

            {/* =================================================
                PUBLICATION CONTENT
            ================================================= */}

            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "10px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {publication.post}
            </div>

            {/* =================================================
                AGENT DECISION
            ================================================= */}

            {publication.reason && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#eef6ff",
                }}
              >
                <strong>
                  🤖 Agent Decision
                </strong>

                <p>
                  {
                    publication.reason
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
                      publication.reason
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

// =========================================================
// SCORECARD COMPONENT
// =========================================================

function DecisionScorecard({
  scorecard,
}) {
  const overall =
    Number(scorecard.overall) || 0;

  const decision =
    scorecard.decision ||
    "REJECT";

  const isPublish =
    decision === "PUBLISH";

  return (
    <div
      style={{
        marginTop: "25px",
        padding: "25px",
        borderRadius: "16px",
        background:
          "linear-gradient(135deg, #f8fbff, #ffffff)",
        border: "2px solid #d5e7ff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
          }}
        >
          🧠 Vikram Decision Engine
        </h3>

        <span
          style={{
            padding: "7px 14px",
            borderRadius: "20px",
            fontWeight: "bold",
            background: isPublish
              ? "#dcfce7"
              : "#fee2e2",
            color: isPublish
              ? "#166534"
              : "#991b1b",
          }}
        >
          {isPublish
            ? "🟢 PUBLISH"
            : "🔴 REJECT"}
        </span>
      </div>

      <p
        style={{
          color: "#555",
          lineHeight: "1.5",
        }}
      >
        Vikram evaluates every discovered topic
        before deciding whether it deserves
        publication.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <Score
          title="Relevance"
          value={scorecard.relevance}
        />

        <Score
          title="Timeliness"
          value={scorecard.timeliness}
        />

        <Score
          title="Impact"
          value={scorecard.impact}
        />

        <Score
          title="Novelty"
          value={scorecard.novelty}
        />
      </div>

      {/* OVERALL */}

      <div
        style={{
          marginTop: "25px",
          padding: "22px",
          borderRadius: "14px",
          background: "white",
          textAlign: "center",
          border: "1px solid #ddd",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            letterSpacing: "1px",
            color: "#666",
          }}
        >
          OVERALL SCORE
        </div>

        <div
          style={{
            fontSize: "44px",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          {overall}
          <span
            style={{
              fontSize: "20px",
              color: "#777",
            }}
          >
            /100
          </span>
        </div>

        <div
          style={{
            margin: "15px auto 0",
            maxWidth: "500px",
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(
                100,
                Math.max(0, overall)
              )}%`,
              height: "100%",
              background:
                isPublish
                  ? "#16a34a"
                  : "#dc2626",
              transition:
                "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* REASON */}

      {scorecard.reason && (
        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            borderRadius: "12px",
            background: "white",
            border: "1px solid #ddd",
          }}
        >
          <strong>
            💡 Why Vikram made this decision
          </strong>

          <p
            style={{
              marginBottom: 0,
              lineHeight: "1.6",
            }}
          >
            {scorecard.reason}
          </p>
        </div>
      )}
    </div>
  );
}

// =========================================================
// SCORE COMPONENT
// =========================================================

function Score({
  title,
  value,
}) {
  const numericValue =
    Number(value) || 0;

  return (
    <div
      style={{
        padding: "18px",
        background: "white",
        borderRadius: "12px",
        border: "1px solid #ddd",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          {numericValue}
        </span>

        <span
          style={{
            color: "#777",
          }}
        >
          /100
        </span>
      </div>

      <div
        style={{
          marginTop: "12px",
          height: "7px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(
              100,
              Math.max(0, numericValue)
            )}%`,
            height: "100%",
            background: "#2563eb",
            transition:
              "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

export default App;