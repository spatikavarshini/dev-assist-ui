/**
 * Form validation utilities
 *
 * FIX: Original used trimmed.substring(1) to strip bullet characters,
 * which leaves a leading space on "- item" style bullets (only strips "-" not "- ").
 * Now uses substring(2) to correctly strip both the character and the space.
 * (This mirrors the fix in outputFormatter.js parseStructuredText.)
 */

export const AGENT_VALIDATORS = {
  docs: (form) => {
    const errors = [];
    if (!form.feature?.trim()) errors.push("Feature name is required");
    if (!form.description?.trim()) errors.push("Description is required");
    return errors;
  },
  prioritize: (form) => {
    const errors = [];
    if (!form.issues?.trim()) errors.push("At least one issue is required");
    return errors;
  },
  bug: (form) => {
    const errors = [];
    if (!form.bug?.trim()) errors.push("Bug report is required");
    return errors;
  },
  pr: (form) => {
    const errors = [];
    if (!form.title?.trim()) errors.push("PR title is required");
    if (!form.pr?.trim()) errors.push("PR description is required");
    return errors;
  },
  commit: (form) => {
    const errors = [];
    if (!form.changes?.trim()) errors.push("Changes summary is required");
    return errors;
  },
  sprint: (form) => {
    const errors = [];
    if (!form.backlog?.trim()) errors.push("Backlog items are required");
    if (!form.capacity?.trim()) errors.push("Team capacity is required");
    return errors;
  },
  standup: (form) => {
    const errors = [];
    if (!form.yesterday?.trim()) errors.push("Yesterday section is required");
    if (!form.today?.trim()) errors.push("Today section is required");
    return errors;
  },
};

export function validateForm(agent, form) {
  const validator = AGENT_VALIDATORS[agent];
  if (!validator) return [];
  return validator(form);
}

export function isFormValid(agent, form) {
  return validateForm(agent, form).length === 0;
}