export default function HistoryPanel({
  history = [],
  onRestore,
  agentColors = {},
  onClearHistory,
}) {
  return (
    <div className="bg-[#0d0d15] border border-[#1e1e2e] rounded-md p-3 h-full animate-[fadeIn_0.3s_ease] flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e1e2e] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6b7280]">◈</span>
          <span className="text-[10px] tracking-[3px] font-bold text-slate-200">
            HISTORY
          </span>
        </div>
        <div className="text-[9px] text-[#4a5568]">{history.length} saved</div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[8px] text-[#f87171] hover:text-[#fca5a5] transition-colors"
            title="Clear all history"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {history.length === 0 && (
          <div className="text-[9px] text-[#374151] tracking-widest">
            No history yet
          </div>
        )}

        {history.map((item, idx) => {
          const color = agentColors[item.agent] || "#6b7280";
          const keysPreview = item.output
            ? Object.keys(item.output).slice(0, 4).join(", ")
            : "(no output)";

          return (
            <button
              key={idx}
              onClick={() => onRestore?.(item)}
              className="w-full text-left p-2 rounded border border-[#111118] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-[12px]" style={{ color }}>
                    {item.agent?.[0]?.toUpperCase() || "◈"}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold" style={{ color }}>
                      {item.agent?.toUpperCase()}
                    </div>
                    <div className="text-[9px] text-[#374151] mt-0.5">
                      {keysPreview}
                    </div>
                  </div>
                </div>
                <div className="text-[9px] text-[#4a5568] mt-0.5">
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
