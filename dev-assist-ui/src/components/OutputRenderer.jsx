import { useState } from "react";
import {
  parseStructuredText,
  isStructuredText,
} from "../utils/outputFormatter";

function renderStructuredText(text, color) {
  const sections = parseStructuredText(text);
  if (!sections)
    return <p className="text-[11px] text-slate-300 leading-relaxed">{text}</p>;

  return (
    <div className="space-y-2">
      {sections.map((section, idx) => {
        if (section.type === "heading-1") {
          return (
            <h1
              key={idx}
              className="text-[13px] font-bold mt-3 mb-2"
              style={{ color }}
            >
              {section.content}
            </h1>
          );
        }
        if (section.type === "heading-2") {
          return (
            <h2
              key={idx}
              className="text-[12px] font-bold mt-2 mb-1"
              style={{ color }}
            >
              {section.content}
            </h2>
          );
        }
        if (section.type === "heading-3") {
          return (
            <h3
              key={idx}
              className="text-[11px] font-semibold mt-2 mb-1 text-slate-300"
            >
              {section.content}
            </h3>
          );
        }
        if (section.type === "list") {
          return (
            <ul key={idx} className="space-y-1 ml-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-[11px] text-slate-300">
                  <span className="shrink-0" style={{ color }}>
                    ▸
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (section.type === "code") {
          return (
            <pre
              key={idx}
              className="bg-[#070710] border border-[#1a1a28] rounded p-2 overflow-x-auto"
            >
              <code className="text-[10px] text-[#4ade80] font-mono">
                {section.content}
              </code>
            </pre>
          );
        }
        return (
          <p key={idx} className="text-[11px] text-slate-300 leading-relaxed">
            {section.content}
          </p>
        );
      })}
    </div>
  );
}

function renderValue(key, value, color) {
  if (typeof value === "string") {
    if (isStructuredText(value)) {
      return renderStructuredText(value, color);
    }
    return (
      <p className="text-[11px] text-slate-300 mt-[6px] leading-relaxed">
        {value}
      </p>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="mt-[6px]">
        {value.map((v, i) => (
          <div
            key={i}
            className="flex gap-2 py-1 border-b border-[#111118] items-start last:border-0"
          >
            <span className="text-[9px] mt-[3px] shrink-0" style={{ color }}>
              ▸
            </span>
            <span className="text-[11px] text-slate-300 leading-relaxed">
              {/* FIX: render object array items as readable key-value pairs
                  instead of raw JSON.stringify output */}
              {typeof v === "object" && v !== null ? (
                <span className="flex flex-wrap gap-x-3 gap-y-1">
                  {Object.entries(v).map(([k, val]) => (
                    <span key={k}>
                      <span className="text-[8px] text-[#4a5568] tracking-widest uppercase mr-1">
                        {k}:
                      </span>
                      <span>{String(val)}</span>
                    </span>
                  ))}
                </span>
              ) : (
                String(v)
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="mt-[6px] space-y-1">
        {Object.entries(value).map(([k, v]) => (
          <div
            key={k}
            className="flex gap-2 py-1 border-b border-[#111118] last:border-0"
          >
            <span className="text-[9px] text-[#4a5568] tracking-widest w-[90px] shrink-0 pt-[1px] uppercase">
              {k}
            </span>
            <span className="text-[11px] text-slate-300">{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className="text-[11px] text-slate-300 mt-[6px] leading-relaxed">
      {String(value)}
    </p>
  );
}

export default function OutputRenderer({ output, agent, agentColors }) {
  const [showCopied, setShowCopied] = useState(false);
  const color = agentColors[agent] || "#a78bfa";

  const copyAll = () => {
    // FIX: guard against null output before attempting to copy
    if (!output) return;
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1500);
  };

  const copyToMarkdown = () => {
    // FIX: guard against null output before attempting to copy
    if (!output) return;
    const markdown = Object.entries(output)
      .filter(([key]) => key !== "error")
      .map(([key, value]) => {
        const heading = `## ${key.replace(/_/g, " ").toUpperCase()}`;
        if (typeof value === "string") {
          return `${heading}\n\n${value}`;
        }
        if (Array.isArray(value)) {
          return `${heading}\n\n${value
            .map((v) =>
              typeof v === "object" ? JSON.stringify(v) : `- ${v}`
            )
            .join("\n")}`;
        }
        return `${heading}\n\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
      })
      .join("\n\n");

    navigator.clipboard.writeText(markdown);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1500);
  };

  if (!output) {
    return (
      <div className="bg-[#0d0d15] border border-[#1e1e2e] rounded-md p-4 h-full flex flex-col items-center justify-center gap-2">
        <span className="text-2xl text-[#1e1e2e]">◈</span>
        <span className="text-[9px] text-[#374151] tracking-widest">
          NO OUTPUT YET
        </span>
        <span className="text-[9px] text-[#2d3748] tracking-wide">
          Run an agent to see results
        </span>
      </div>
    );
  }

  if (output.error) {
    return (
      <div className="bg-[#0d0d15] border border-[#450a0a] rounded-md p-4 h-full flex flex-col">
        <div className="text-[9px] tracking-widest text-[#f87171] mb-3">
          ERROR
        </div>
        <p className="text-[11px] text-[#f87171] leading-relaxed flex-1">
          {output.error}
        </p>
        <p className="text-[9px] text-[#6b7280] mt-3 pt-3 border-t border-[#450a0a]">
          Ensure your webhook URL is configured and the API is reachable.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d15] border border-[#1e1e2e] rounded-md p-4 flex flex-col h-full animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e1e2e] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color }}>
            ◈
          </span>
          <span
            className="text-[10px] tracking-[3px] font-bold"
            style={{ color }}
          >
            OUTPUT
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToMarkdown}
            className="bg-transparent border border-[#1e1e2e] rounded px-[8px] py-1 text-[8px] tracking-widest font-mono cursor-pointer transition-colors duration-200 hover:border-[#374151]"
            style={{ color: "#4a5568" }}
            title="Copy as Markdown"
          >
            ⎘ MD
          </button>
          <button
            onClick={copyAll}
            className="bg-transparent border border-[#1e1e2e] rounded px-[8px] py-1 text-[9px] tracking-widest font-mono cursor-pointer transition-colors duration-200"
            style={{ color: showCopied ? "#4ade80" : "#4a5568" }}
          >
            {showCopied ? "✓ COPIED" : "⎘ COPY"}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {Object.entries(output).map(([key, value]) => (
          <div
            key={key}
            className="bg-[#070710] border border-[#1a1a28] rounded p-3"
          >
            <div
              className="text-[9px] tracking-[2px] font-bold mb-2 uppercase"
              style={{ color }}
            >
              {key.replace(/_/g, " ")}
            </div>
            {renderValue(key, value, color)}
          </div>
        ))}
      </div>
    </div>
  );
}