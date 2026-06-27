const DEFAULT_MODEL = "google/gemini-2.0-flash-free:free";

const MODELS = [
  { id: "google/gemini-2.0-flash-free:free", name: "Gemini 2.0 Flash (Free)" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)" },
  { id: "deepseek/deepseek-chat-v3.1:free", name: "DeepSeek V3 (Free)" },
  { id: "microsoft/phi-4-mini-instruct:free", name: "Phi 4 Mini (Free)" },
  { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen 2.5 Coder 32B (Free)" },
  { id: "thudm/glma-4-9b:free", name: "GLM-4-9B (Free)" },
];

export { DEFAULT_MODEL, MODELS };
