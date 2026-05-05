import { useState } from "react";
import { parseStructuredText, isStructuredText } from "../utils/outputFormatter";

function renderStructuredText(text, color) {
  const sections = parseStructuredText(text);
  if (!sections)
    return <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.7 }}>{text}</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {sections.map((section, idx) => {
        if (section.type === "heading-1")
          return <h1 key={idx} style={{ fontSize: "13px", fontWeight: "bold", color, marginTop: "8px" }}>{section.content}</h1>;
        if (section.type === "heading-2")
          return <h2 key={idx} style={{ fontSize: "12px", fontWeight: "bold", color, marginTop: "6px" }}>{section.content}</h2>;
        if (section.type === "heading-3")
          return <h3 key={idx} style={{ fontSize: "11px", fontWeight: "600", color: "#475569", marginTop: "4px" }}>{section.content}</h3>;
        if (section.type === "list")
          return (
            <ul key={idx} style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#475569" }}>
                  <span style={{ color, flexShrink: 0 }}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        if (section.type === "code")
          return (
            <pre key={idx} style={{ background: "#dbeafe", border: "1px solid #7dd3fc", borderRadius: "6px", padding: "10px", overflowX: "auto" }}>
              <code style={{ fontSize: "10px", color: "#0ea5e9", fontFamily: "monospace" }}>{section.content}</code>
            </pre>
          );
        return (
          <p key={idx} style={{ fontSize: "11px", color: "#475569", lineHeight: 1.7 }}>{section.content}</p>
        );
      })}
    </div>
  );
}

function renderValue(key, value, color) {
  if (typeof value === "string") {
    if (isStructuredText(value)) return renderStructuredText(value, color);
    return <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px", lineHeight: 1.7 }}>{value}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <div style={{ marginTop: "6px" }}>
        {value.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", padding: "6px 0", borderBottom: "1px solid #7dd3fc", alignItems: "flex-start" }}
            className="last:border-0">
            <span style={{ fontSize: "9px", marginTop: "3px", flexShrink: 0, color }}>▸</span>
            <span style={{ fontSize: "11px", color: "#475569", lineHeight: 1.7 }}>
              {typeof v === "object" && v !== null ? (
                <span style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
                  {Object.entries(v).map(([k, val]) => (
                    <span key={k}>
                      <span style={{ fontSize: "8px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "4px" }}>{k}:</span>
                      <span>{String(val)}</span>
                    </span>
                  ))}
                </span>
              ) : String(v)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {Object.entries(value).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: "8px", padding: "5px 0", borderBottom: "1px solid #7dd3fc" }}
            className="last:border-0">
            <span style={{ fontSize: "9px", color: "#475569", letterSpacing: "0.1em", width: "90px", flexShrink: 0, paddingTop: "1px", textTransform: "uppercase" }}>{k}</span>
            <span style={{ fontSize: "11px", color: "#475569" }}>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }

  return <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px", lineHeight: 1.7 }}>{String(value)}</p>;
}

export default function OutputRenderer({ output, agent, agentColors }) {
  const [copyState, setCopyState] = useState("idle"); // idle | json | md
  const color = agentColors[agent] || "#0ea5e9";

  const copyJSON = () => {
    if (!output) return;
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    setCopyState("json");
    setTimeout(() => setCopyState("idle"), 1500);
  };

  const copyMarkdown = () => {
    if (!output) return;
    const md = Object.entries(output)
      .filter(([key]) => key !== "error")
      .map(([key, value]) => {
        const heading = `## ${key.replace(/_/g, " ").toUpperCase()}`;
        if (typeof value === "string") return `${heading}\n\n${value}`;
        if (Array.isArray(value))
          return `${heading}\n\n${value.map((v) => (typeof v === "object" ? JSON.stringify(v) : `- ${v}`)).join("\n")}`;
        return `${heading}\n\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
      })
      .join("\n\n");
    navigator.clipboard.writeText(md);
    setCopyState("md");
    setTimeout(() => setCopyState("idle"), 1500);
  };

  if (!output) {
    return (
      <div
        className="rounded-lg p-4 h-full flex flex-col items-center justify-center gap-3"
        style={{ background: "#e0e7ff", border: "1px solid #c7d2fe" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
          style={{ background: "#c7d2fe", border: "1px solid #8b5cf6", color: "#4338ca" }}
        >
          ◈
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="text-[10px] tracking-widest mb-1" style={{ color: "#4338ca" }}>NO OUTPUT YET</div>
          <div className="text-[9px]" style={{ color: "#475569" }}>Run an agent to see results here</div>
        </div>
      </div>
    );
  }

  if (output.error) {
    return (
      <div
        className="rounded-lg p-4 h-full flex flex-col"
        style={{ background: "#e0e7ff", border: "1px solid #fda4af30" }}
      >
        <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid #fda4af20" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#fb7185" }} />
          <span className="text-[10px] tracking-widest" style={{ color: "#fb7185" }}>ERROR</span>
        </div>
        <p className="flex-1 text-[11px] leading-relaxed" style={{ color: "#fb7185" }}>{output.error}</p>
        <p className="text-[9px] mt-3 pt-3" style={{ color: "#475569", borderTop: "1px solid #fda4af20" }}>
          Ensure your webhook URL is configured and the API is reachable.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-4 flex flex-col h-full"
      style={{ background: "#e0e7ff", border: "1px solid #c7d2fe" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 shrink-0" style={{ borderBottom: "1px solid #c7d2fe" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: `linear-gradient(to bottom, ${color}, ${color}40)` }} />
          <span className="text-[10px] tracking-[3px] font-bold" style={{ color }}>OUTPUT</span>
          <span className="text-[8px] px-2 py-[2px] rounded-full" style={{ background: `${color}15`, color: `${color}cc`, border: `1px solid ${color}20` }}>
            {Object.keys(output).length} fields
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyMarkdown}
            className="rounded-md px-2 py-1 text-[8px] tracking-wider font-mono cursor-pointer transition-all"
            style={{
              background: copyState === "md" ? "#0ea5e920" : "transparent",
              border: `1px solid ${copyState === "md" ? "#0ea5e940" : "#c7d2fe"}`,
              color: copyState === "md" ? "#0ea5e9" : "#475569",
            }}
          >
            ⎘ MD
          </button>
          <button
            onClick={copyJSON}
            className="rounded-md px-2 py-1 text-[8px] tracking-wider font-mono cursor-pointer transition-all"
            style={{
              background: copyState === "json" ? "#0ea5e920" : "transparent",
              border: `1px solid ${copyState === "json" ? "#0ea5e940" : "#c7d2fe"}`,
              color: copyState === "json" ? "#0ea5e9" : "#475569",
            }}
          >
            {copyState === "json" ? "✓ COPIED" : "⎘ JSON"}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {Object.entries(output).map(([key, value]) => (
          <div
            key={key}
            className="rounded-md p-3"
            style={{ background: "#c7d2fe", border: "1px solid #7dd3fc" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 rounded-full" style={{ background: color }} />
              <div className="text-[9px] tracking-[2px] font-bold uppercase" style={{ color }}>
                {key.replace(/_/g, " ")}
              </div>
            </div>
            {renderValue(key, value, color)}
          </div>
        ))}
      </div>
    </div>
  );
}

