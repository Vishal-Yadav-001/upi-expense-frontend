export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

const GEMINI_MODEL_STORAGE_KEY = "upi_gemini_model";
const GEMINI_API_KEY_STORAGE_KEY = "upi_gemini_api_key";

export const GEMINI_MODEL_OPTIONS = [
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    description: "Recommended",
  },
  {
    value: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash-Lite",
    description: "Fastest and cheapest",
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    description: "Best for deeper reasoning",
  },
  {
    value: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    description: "Legacy fallback option",
  },
] as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredGeminiModel() {
  if (!canUseStorage()) {
    return DEFAULT_GEMINI_MODEL;
  }

  return localStorage.getItem(GEMINI_MODEL_STORAGE_KEY) || DEFAULT_GEMINI_MODEL;
}

export function getStoredGeminiApiKey() {
  if (!canUseStorage()) {
    return "";
  }

  return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || "";
}

export function saveGeminiSettings({
  apiKey,
  model,
}: {
  apiKey: string;
  model: string;
}) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(GEMINI_MODEL_STORAGE_KEY, model || DEFAULT_GEMINI_MODEL);

  const normalizedApiKey = apiKey.trim();
  if (normalizedApiKey) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, normalizedApiKey);
    return;
  }

  localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
}
