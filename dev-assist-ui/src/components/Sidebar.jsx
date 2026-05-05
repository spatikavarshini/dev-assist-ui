const AGENTS = [
  { id: "docs", label: "DOCS", icon: "◈", desc: "Feature documentation" },
  {
    id: "prioritize",
    label: "PRIORITIZE",
    icon: "◎",
    desc: "Issue triage & ranking",
  },
  { id: "bug", label: "BUG", icon: "⬡", desc: "Bug analysis & fix" },
  { id: "pr", label: "PR REVIEW", icon: "◇", desc: "Pull request review" },
  { id: "commit", label: "COMMIT", icon: "○", desc: "Commit message gen" },
  { id: "sprint", label: "SPRINT", icon: "◈", desc: "Sprint planning" },
  { id: "standup", label: "STANDUP", icon: "◎", desc: "Daily standup gen" },
];

export default function Sidebar({ agent, setAgent, agentColors }) {
  return (
    <div className="w-[220px] bg-[#0d0d15] border-r border-[#1e1e2e] flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg text-[#a78bfa]">◈</span>
          <span className="text-[13px] font-bold tracking-[3px] text-slate-200">
            DEVASSIST
          </span>
        </div>
        <div className="text-[9px] text-[#4a5568] tracking-[2px]">
          AI ENGINEERING SUITE
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {AGENTS.map((a) => {
          const active = agent === a.id;
          const color = agentColors[a.id];
          return (
            <button
              key={a.id}
              onClick={() => setAgent(a.id)}
              className="w-full text-left px-4 py-[10px] relative transition-all duration-150"
              style={{
                background: active ? "rgba(255,255,255,0.03)" : "transparent",
                borderLeft: active
                  ? `2px solid ${color}`
                  : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-[10px]">
                <span
                  className="text-[12px] transition-colors"
                  style={{ color: active ? color : "#4a5568" }}
                >
                  {a.icon}
                </span>
                <div>
                  <div
                    className="text-[10px] tracking-[2px] font-bold"
                    style={{ color: active ? color : "#6b7280" }}
                  >
                    {a.label}
                  </div>
                  <div className="text-[9px] text-[#374151] mt-[1px] tracking-[0.5px]">
                    {a.desc}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="px-4 py-3 border-t border-[#1e1e2e]">
        <div className="text-[9px] text-[#374151] tracking-widest mb-1">
          STATUS
        </div>
        <div className="flex items-center gap-[6px]">
          <div className="w-[6px] h-[6px] rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-[9px] text-[#4ade80] tracking-widest">
            ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}