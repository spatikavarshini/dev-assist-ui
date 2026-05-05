/**
 * Configuration for API endpoints and environment settings
 * FIX: Added safe fallback for import.meta.env to prevent crashes
 * when VITE_API_WEBHOOK_URL is not set
 */

const CONFIG = {
  API_WEBHOOK_URL:
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_API_WEBHOOK_URL
      : undefined,
  REQUEST_TIMEOUT: 30000,
  MAX_HISTORY_ITEMS: 50,
};

export function getConfig(key) {
  return CONFIG[key];
}

export function isConfigValid() {
  return (
    !!CONFIG.API_WEBHOOK_URL &&
    CONFIG.API_WEBHOOK_URL !== "YOUR_WEBHOOK_URL" &&
    !CONFIG.API_WEBHOOK_URL.includes("undefined")
  );
}

export default CONFIG;