import { useState, useEffect, useCallback } from "react";
import { validateForm } from "../utils/validation";

const inputCls =
  "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-[11px] text-slate-200 tracking-[0.5px] outline-none mb-2 font-mono placeholder-[#374151] focus:border-[#374151] transition-colors resize-y";
const labelCls = "block text-[9px] tracking-[2px] text-[#4a5568] mb-1";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

const AGENT_FIELDS = {
  docs: ({ form, set }) => (
    <>
      <Field label="FEATURE NAME">
        <input
          className={inputCls}
          placeholder="e.g. User Authentication"
          value={form.feature || ""}
          onChange={set("feature")}
        />
      </Field>
      <Field label="DESCRIPTION">
        <textarea
          className={inputCls}
          style={{ minHeight: 80 }}
          placeholder="Describe the feature in detail..."
          value={form.description || ""}
          onChange={set("description")}
        />
      </Field>
    </>
  ),
  prioritize: ({ form, set }) => (
    <Field label="ISSUES (comma separated)">
      <textarea
        className={inputCls}
        style={{ minHeight: 100 }}
        placeholder="Fix login bug, Add dark mode, Update dependencies..."
        value={form.issues || ""}
        onChange={set("issues")}
      />
    </Field>
  ),
  bug: ({ form, set }) => (
    <Field label="BUG REPORT">
      <textarea
        className={inputCls}
        style={{ minHeight: 120 }}
        placeholder="Describe the bug, steps to reproduce, expected vs actual behavior..."
        value={form.bug || ""}
        onChange={set("bug")}
      />
    </Field>
  ),
  pr: ({ form, set }) => (
    <>
      <Field label="PR TITLE">
        <input
          className={inputCls}
          placeholder="feat: add user authentication"
          value={form.title || ""}
          onChange={set("title")}
        />
      </Field>
      <Field label="PR DESCRIPTION">
        <textarea
          className={inputCls}
          style={{ minHeight: 80 }}
          placeholder="What changes were made and why?"
          value={form.pr || ""}
          onChange={set("pr")}
        />
      </Field>
    </>
  ),
  commit: ({ form, set }) => (
    <Field label="CHANGES SUMMARY">
      <textarea
        className={inputCls}
        style={{ minHeight: 120 }}
        placeholder="List the changes made in this commit..."
        value={form.changes || ""}
        onChange={set("changes")}
      />
    </Field>
  ),
  sprint: ({ form, set }) => (
    <>
      <Field label="BACKLOG ITEMS">
        <textarea
          className={inputCls}
          style={{ minHeight: 80 }}
          placeholder="List backlog items..."
          value={form.backlog || ""}
          onChange={set("backlog")}
        />
      </Field>
      <Field label="TEAM CAPACITY (story points)">
        <input
          className={inputCls}
          placeholder="e.g. 40"
          value={form.capacity || ""}
          onChange={set("capacity")}
        />
      </Field>
    </>
  ),
  standup: ({ form, set }) => (
    <>
      <Field label="YESTERDAY">
        <input
          className={inputCls}
          placeholder="What did you complete?"
          value={form.yesterday || ""}
          onChange={set("yesterday")}
        />
      </Field>
      <Field label="TODAY">
        <input
          className={inputCls}
          placeholder="What will you work on?"
          value={form.today || ""}
          onChange={set("today")}
        />
      </Field>
      <Field label="BLOCKERS">
        <input
          className={inputCls}
          placeholder="Any blockers or impediments?"
          value={form.blockers || ""}
          onChange={set("blockers")}
        />
      </Field>
    </>
  ),
};

export default function AgentForm({ agent, onSubmit, loading, agentColors }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState([]);
  const color = agentColors[agent] || "#a78bfa";

  // FIX: reset form and errors when agent changes — previously could
  // carry stale field values from the previous agent into the new one
  useEffect(() => {
    setForm({});
    setErrors([]);
  }, [agent]);

  // FIX: memoize setter so AGENT_FIELDS components don't get new function
  // references on every keystroke, avoiding unnecessary re-renders
  const set = useCallback(
    (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
    [],
  );

  // Add keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter" && !loading) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, form, agent]); // dependencies to re-attach when they change

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
    <div className="bg-[#0d0d15] border border-[#1e1e2e] rounded-md p-4 animate-[fadeIn_0.2s_ease] flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e1e2e]">
        <span className="text-sm" style={{ color }}>
          ◈
        </span>
        <span
          className="text-[10px] tracking-[3px] font-bold"
          style={{ color }}
        >
          {agent.toUpperCase()} AGENT
        </span>
      </div>

      <div className="mb-3 flex-1 overflow-y-auto">
        {errors.length > 0 && (
          <div className="bg-[#450a0a] border border-[#f87171] rounded p-2 mb-3">
            {errors.map((error, idx) => (
              <div
                key={idx}
                className="text-[9px] text-[#f87171] mb-1 last:mb-0"
              >
                • {error}
              </div>
            ))}
          </div>
        )}
        {FieldsComponent && <FieldsComponent form={form} set={set} />}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-[9px] rounded text-[10px] tracking-[3px] font-bold font-mono transition-all duration-200 relative overflow-hidden"
        style={{
          background: loading ? "#1e1e2e" : color,
          color: loading ? "#6b7280" : "#0a0a0f",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "PROCESSING..." : "▶ RUN AGENT"}
      </button>
      <div className="text-[8px] text-[#4a5568] text-center mt-1">
        Press Ctrl+Enter to submit
      </div>
    </div>
  );
}
