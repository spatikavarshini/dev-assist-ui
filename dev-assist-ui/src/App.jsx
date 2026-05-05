import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AgentForm from "./components/AgentForm";
import OutputRenderer from "./components/OutputRenderer";
import HistoryPanel from "./components/HistoryPanel";
import { getConfig, isConfigValid } from "./utils/config";

const AGENT_COLORS = {
  docs: "#4ade80",
  prioritize: "#fb923c",
  bug: "#f87171",
  pr: "#a78bfa",
  commit: "#38bdf8",
  sprint: "#facc15",
  standup: "#34d399",
};

export default function App() {
  const [agent, setAgent] = useState("docs");
  const [output, setOutput] = useState(null);
  // FIX: currentAgent was kept separate from agent to show which agent
  // produced the current output. Previously handleRestore only set output
  // and currentAgent but not agent, leaving the sidebar and form out of sync.
  // Now handleRestore sets all three so the UI is fully consistent.
  const [currentAgent, setCurrentAgent] = useState("docs");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const API_URL = getConfig("API_WEBHOOK_URL");
  const MAX_HISTORY = getConfig("MAX_HISTORY_ITEMS");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("devassist-history");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, MAX_HISTORY));
        }
      }
    } catch (error) {
      console.warn("Failed to load history from localStorage:", error);
    }
  }, [MAX_HISTORY]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("devassist-history", JSON.stringify(history));
    } catch (error) {
      console.warn("Failed to save history to localStorage:", error);
    }
  }, [history]);

  const handleSubmit = async (formData) => {
    if (!isConfigValid()) {
      setOutput({
        error:
          "API webhook URL is not configured. Please set VITE_API_WEBHOOK_URL in your .env file.",
      });
      return;
    }

    setLoading(true);
    setOutput(null);
    setCurrentAgent(agent);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        getConfig("REQUEST_TIMEOUT"),
      );

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: agent, ...formData }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setOutput(data);

      const now = new Date();
      const time =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      setHistory((prev) =>
        [{ agent, input: formData, output: data, time }, ...prev].slice(
          0,
          MAX_HISTORY,
        ),
      );
    } catch (error) {
      let errorMessage = "API request failed";

      if (error.name === "AbortError") {
        errorMessage = "Request timeout — API took too long to respond";
      } else if (error instanceof TypeError) {
        errorMessage =
          "Network error — unable to reach API. Check your connection and webhook URL.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setOutput({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // FIX: also update `agent` (not just `currentAgent`) so the sidebar
  // highlight, form fields, and run button color all match the restored item
  const handleRestore = (item) => {
    setOutput(item.output);
    setCurrentAgent(item.agent);
    setAgent(item.agent);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-slate-200 font-mono overflow-hidden">
      <Sidebar agent={agent} setAgent={setAgent} agentColors={AGENT_COLORS} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-5 py-3 border-b border-[#1e1e2e] flex items-center justify-between bg-[#0a0a0f] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#374151] tracking-widest uppercase">
              Workspace
            </span>
            <span className="text-[10px] text-[#1e1e2e]">›</span>
            <span
              className="text-[10px] tracking-widest uppercase font-bold"
              style={{ color: AGENT_COLORS[agent] }}
            >
              {agent}
            </span>
          </div>
          <span className="text-[9px] text-[#2d3748] tracking-wider">
            DEVASSIST AI v2.2
          </span>
        </div>

        {/* Main grid */}
        <div
          className="flex-1 grid gap-3 p-3 overflow-hidden"
          style={{ gridTemplateColumns: "340px 1fr 220px" }}
        >
          <div className="overflow-hidden">
            <AgentForm
              agent={agent}
              onSubmit={handleSubmit}
              loading={loading}
              agentColors={AGENT_COLORS}
            />
          </div>
          <div className="overflow-hidden">
            <OutputRenderer
              output={output}
              agent={currentAgent}
              agentColors={AGENT_COLORS}
            />
          </div>
          <div className="overflow-hidden">
            <HistoryPanel
              history={history}
              onRestore={handleRestore}
              onClearHistory={handleClearHistory}
              agentColors={AGENT_COLORS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
