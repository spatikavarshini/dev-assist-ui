import { useState, useEffect, useCallback } from "react";
import { validateForm } from "../utils/validation";

const labelCls = "block text-[9px] tracking-[2px] mb-1 uppercase";

function Field({ label, color, children }) {
  return (
    <div>
      <label className={labelCls} style={{ color: "#6366f1" }}>{label}</label>
      {children}
    </div>
  );
}

function makeInputStyle(color) {
  return {
    width: "100%",
    background: "#eff6ff",
    border: "1px solid #6366f1",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "11px",
    color: "#334155",
    letterSpacing: "0.5px",
    outline: "none",
    marginBottom: "10px",
    fontFamily: "monospace",
    resize: "vertical",
    transition: "border-color 0.2s",
  };
}

const AGENT_FIELDS = {
  docs: ({ form, set, color }) => (
    <>
      <Field label="Feature Name" color={color}>
        <input
          style={makeInputStyle(color)}
          placeholder="e.g. User Authentication"
          value={form.feature || ""}
          onChange={set("feature")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
      <Field label="Description" color={color}>
        <textarea
          style={{ ...makeInputStyle(color), minHeight: 80 }}
          placeholder="Describe the feature in detail..."
          value={form.description || ""}
          onChange={set("description")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
    </>
  ),
  prioritize: ({ form, set, color }) => (
    <Field label="Issues (comma separated)" color={color}>
      <textarea
        style={{ ...makeInputStyle(color), minHeight: 100 }}
        placeholder="Fix login bug, Add dark mode, Update dependencies..."
        value={form.issues || ""}
        onChange={set("issues")}
        onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
        onBlur={e => (e.target.style.borderColor = "#6366f1")}
      />
    </Field>
  ),
  bug: ({ form, set, color }) => (
    <Field label="Bug Report" color={color}>
      <textarea
        style={{ ...makeInputStyle(color), minHeight: 120 }}
        placeholder="Describe the bug, steps to reproduce, expected vs actual behavior..."
        value={form.bug || ""}
        onChange={set("bug")}
        onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
        onBlur={e => (e.target.style.borderColor = "#6366f1")}
      />
    </Field>
  ),
  pr: ({ form, set, color }) => (
    <>
      <Field label="PR Title" color={color}>
        <input
          style={makeInputStyle(color)}
          placeholder="feat: add user authentication"
          value={form.title || ""}
          onChange={set("title")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
      <Field label="PR Description" color={color}>
        <textarea
          style={{ ...makeInputStyle(color), minHeight: 80 }}
          placeholder="What changes were made and why?"
          value={form.pr || ""}
          onChange={set("pr")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
    </>
  ),
  commit: ({ form, set, color }) => (
    <Field label="Changes Summary" color={color}>
      <textarea
        style={{ ...makeInputStyle(color), minHeight: 120 }}
        placeholder="List the changes made in this commit..."
        value={form.changes || ""}
        onChange={set("changes")}
        onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
        onBlur={e => (e.target.style.borderColor = "#6366f1")}
      />
    </Field>
  ),
  sprint: ({ form, set, color }) => (
    <>
      <Field label="Backlog Items" color={color}>
        <textarea
          style={{ ...makeInputStyle(color), minHeight: 80 }}
          placeholder="List backlog items..."
          value={form.backlog || ""}
          onChange={set("backlog")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
      <Field label="Team Capacity (story points)" color={color}>
        <input
          style={makeInputStyle(color)}
          placeholder="e.g. 40"
          value={form.capacity || ""}
          onChange={set("capacity")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
    </>
  ),
  standup: ({ form, set, color }) => (
    <>
      <Field label="Yesterday" color={color}>
        <input
          style={makeInputStyle(color)}
          placeholder="What did you complete?"
          value={form.yesterday || ""}
          onChange={set("yesterday")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
      <Field label="Today" color={color}>
        <input
          style={makeInputStyle(color)}
          placeholder="What will you work on?"
          value={form.today || ""}
          onChange={set("today")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
      <Field label="Blockers" color={color}>
        <input
          style={makeInputStyle(color)}
          placeholder="Any blockers or impediments?"
          value={form.blockers || ""}
          onChange={set("blockers")}
          onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
          onBlur={e => (e.target.style.borderColor = "#6366f1")}
        />
      </Field>
    </>
  ),
};

export default function AgentForm({ agent, onSubmit, loading, agentColors }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState([]);
  const color = agentColors[agent] || "#2dd4bf";

  useEffect(() => {
    setForm({});
    setErrors([]);
  }, [agent]);

  const set = useCallback(
    (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter" && !loading) handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, form, agent]);

  const handleSubmit = () => {
    const formErrors = validateForm(agent, form);
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors([]);
    onSubmit(form);
  };

  const FieldsComponent = AGENT_FIELDS[agent];

  return (
    <div
      className="rounded-lg p-4 flex flex-col h-full"
      style={{ background: "#eef2ff", border: "1px solid #6366f1" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: "1px solid #c7d2fe" }}>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold"
          style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
        >
          {agent[0].toUpperCase()}
        </div>
        <div>
          <div className="text-[10px] tracking-[3px] font-bold" style={{ color }}>
            {agent.toUpperCase()} AGENT
          </div>
          <div className="text-[8px] tracking-wider mt-[1px]" style={{ color: "#4338ca" }}>
            Configure &amp; run
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto mb-3 pr-1">
        {errors.length > 0 && (
          <div
            className="rounded-md p-2 mb-3 border"
            style={{ background: "#fce7f3", borderColor: "#fb718520" }}
          >
            {errors.map((error, idx) => (
              <div key={idx} className="text-[9px] mb-1 last:mb-0" style={{ color: "#fb7185" }}>
                ⚠ {error}
              </div>
            ))}
          </div>
        )}
        {FieldsComponent && <FieldsComponent form={form} set={set} color={color} />}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-[10px] rounded-md text-[10px] tracking-[3px] font-bold font-mono transition-all duration-200"
        style={{
          background: loading ? "#7dd3fc" : `linear-gradient(135deg, ${color}cc 0%, ${color} 100%)`,
          color: loading ? "#6366f1" : "#c7d2fe",
          border: loading ? "1px solid #c7d2fe" : "none",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : `0 4px 20px ${color}30`,
        }}
      >
        {loading ? "⟳  PROCESSING..." : "▶  RUN AGENT"}
      </button>
      <div className="text-[8px] text-center mt-2" style={{ color: "#4338ca" }}>
        Ctrl+Enter to submit
      </div>
    </div>
  );
}



