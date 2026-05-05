const AGENTS = [
  { id: "docs",       label: "DOCS",       icon: "◈", desc: "Feature documentation" },
  { id: "prioritize", label: "PRIORITIZE", icon: "◎", desc: "Issue triage & ranking" },
  { id: "bug",        label: "BUG",        icon: "⬡", desc: "Bug analysis & fix" },
  { id: "pr",         label: "PR REVIEW",  icon: "◇", desc: "Pull request review" },
  { id: "commit",     label: "COMMIT",     icon: "○", desc: "Commit message gen" },
  { id: "sprint",     label: "SPRINT",     icon: "◈", desc: "Sprint planning" },
  { id: "standup",    label: "STANDUP",    icon: "◎", desc: "Daily standup gen" },
];

export default function Sidebar({ agent, setAgent, agentColors }) {
  return (
    <div
      className="w-[220px] flex flex-col shrink-0 border-r"
      style={{ background: "#c7d2fe", borderColor: "#8b5cf6" }}
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b" style={{ borderColor: "#8b5cf6" }}>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)", color: "#0ea5e9" }}
          >
            DA
          </div>
          <span className="text-[13px] font-bold tracking-[3px]" style={{ color: "#4338ca" }}>
            DEVASSIST
          </span>
        </div>
        <div className="text-[9px] tracking-[2px] mt-1 ml-8" style={{ color: "#4f46e5" }}>
          AI ENGINEERING SUITE
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[8px] tracking-[3px] uppercase" style={{ color: "#4338ca" }}>Agents</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-[2px]">
        {AGENTS.map((a) => {
          const active = agent === a.id;
          const color = agentColors[a.id];
          return (
            <button
              key={a.id}
              onClick={() => setAgent(a.id)}
              className="w-full text-left px-3 py-[9px] rounded-md relative transition-all duration-150 group"
              style={{
                background: active ? `${color}12` : "transparent",
                border: `1px solid ${active ? `${color}30` : "transparent"}`,
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-[13px] transition-all duration-150"
                  style={{ color: active ? color : "#475569" }}
                >
                  {a.icon}
                </span>
                <div>
                  <div
                    className="text-[10px] tracking-[2px] font-bold transition-colors"
                    style={{ color: active ? color : "#475569" }}
                  >
                    {a.label}
                  </div>
                  <div className="text-[9px] mt-[1px] tracking-[0.5px]" style={{ color: "#4338ca" }}>
                    {a.desc}
                  </div>
                </div>
                {active && (
                  <div
                    className="ml-auto w-1 h-1 rounded-full"
                    style={{ background: color }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "#8b5cf6" }}>
        <div className="text-[8px] tracking-widest mb-2" style={{ color: "#4338ca" }}>SYSTEM</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: "#0ea5e9" }} />
            <span className="text-[9px] tracking-widest" style={{ color: "#0ea5e9" }}>ONLINE</span>
          </div>
          <div className="text-[8px]" style={{ color: "#4338ca" }}>All agents ready</div>
        </div>
      </div>
    </div>
  );
}

