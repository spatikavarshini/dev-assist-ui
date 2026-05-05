export default function HistoryPanel({ history = [], onRestore, agentColors = {}, onClearHistory }) {
  return (
    <div
      className="rounded-lg p-3 h-full flex flex-col"
      style={{ background: "#e0e7ff", border: "1px solid #c7d2fe" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 shrink-0" style={{ borderBottom: "1px solid #c7d2fe" }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: "#475569" }}>◎</span>
          <span className="text-[10px] tracking-[3px] font-bold" style={{ color: "#475569" }}>HISTORY</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[8px] px-2 py-[2px] rounded-full"
            style={{ background: "#7dd3fc", color: "#475569", border: "1px solid #c7d2fe" }}
          >
            {history.length}
          </span>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[9px] transition-colors"
              style={{ color: "#475569", cursor: "pointer", background: "none", border: "none" }}
              onMouseEnter={e => (e.target.style.color = "#fb7185")}
              onMouseLeave={e => (e.target.style.color = "#475569")}
              title="Clear all history"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="text-xl" style={{ color: "#7dd3fc" }}>◎</div>
            <div className="text-[9px] tracking-widest" style={{ color: "#c7d2fe" }}>No history yet</div>
          </div>
        )}

        {history.map((item, idx) => {
          const color = agentColors[item.agent] || "#475569";
          const keysPreview = item.output
            ? Object.keys(item.output).slice(0, 3).join(", ")
            : "(no output)";

          return (
            <button
              key={idx}
              onClick={() => onRestore?.(item)}
              className="w-full text-left rounded-md p-2 transition-all duration-150 group"
              style={{
                background: "transparent",
                border: "1px solid #7dd3fc",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${color}08`;
                e.currentTarget.style.borderColor = `${color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "#7dd3fc";
              }}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{ background: `${color}15`, color }}
                  >
                    {item.agent?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="text-[9px] font-bold" style={{ color }}>
                      {item.agent?.toUpperCase()}
                    </div>
                    <div className="text-[8px] mt-[2px] truncate max-w-[120px]" style={{ color: "#475569" }}>
                      {keysPreview}
                    </div>
                  </div>
                </div>
                <div className="text-[8px] shrink-0 mt-[1px]" style={{ color: "#475569" }}>
                  {item.time}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

