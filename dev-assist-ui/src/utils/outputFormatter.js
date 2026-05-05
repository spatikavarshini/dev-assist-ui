/**
 * Format structured output with support for:
 * - Markdown-like formatting
 * - Bullet points
 * - Headings
 * - Code blocks
 *
 * FIX: Code block detection was broken — the original checked trimmed.startsWith("```")
 * twice for both opening AND closing, so the closing branch was unreachable and code
 * blocks never closed. Now uses an inCodeBlock flag to track open/close state correctly.
 */

export function formatOutputValue(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;
  if (typeof value === "object" && value !== null) return value;
  return String(value);
}

export function parseStructuredText(text) {
  if (typeof text !== "string") return null;

  const lines = text.split("\n");
  const sections = [];
  let currentSection = null;
  let inCodeBlock = false; // FIX: track open/close state separately

  for (const line of lines) {
    const trimmed = line.trim();

    // FIX: handle code block open/close with a dedicated flag
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Closing fence — finalize the code section
        if (currentSection) sections.push(currentSection);
        currentSection = null;
        inCodeBlock = false;
      } else {
        // Opening fence — start a new code section
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "code", content: "" };
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      // Accumulate raw lines inside code block
      currentSection.content +=
        (currentSection.content ? "\n" : "") + line;
      continue;
    }

    // Headers
    if (trimmed.startsWith("###")) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: "heading-3",
        content: trimmed.replace(/^#+\s*/, ""),
      };
    } else if (trimmed.startsWith("##")) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: "heading-2",
        content: trimmed.replace(/^#+\s*/, ""),
      };
    } else if (trimmed.startsWith("#")) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: "heading-1",
        content: trimmed.replace(/^#+\s*/, ""),
      };
    }
    // Bullet points
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (currentSection?.type !== "list") {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "list", items: [] };
      }
      currentSection.items.push(trimmed.substring(2).trim());
    }
    // Regular paragraphs
    else if (trimmed) {
      if (currentSection?.type === "paragraph") {
        currentSection.content += "\n" + trimmed;
      } else {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "paragraph", content: trimmed };
      }
    }
  }

  // FIX: push any unclosed section at end of input (including unclosed code blocks)
  if (currentSection) sections.push(currentSection);

  return sections;
}

export function isStructuredText(text) {
  if (typeof text !== "string") return false;
  return (
    text.includes("\n") &&
    (text.includes("#") ||
      text.includes("- ") ||
      text.includes("```") ||
      text.includes("* "))
  );
}