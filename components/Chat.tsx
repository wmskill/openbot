"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "./types";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ModelSelector from "./ModelSelector";
import { DEFAULT_MODEL, MODELS } from "@/lib/openrouter";

const STORAGE_KEY = "openbot_conversation";

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(updated);
    setIsLoading(true);

    try {
      const allMessages = updated.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, model }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${await res.text()}`);
      }

      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + text } : m
          )
        );
      }

      saveMessages(
        messages.concat(userMsg).concat({
          ...assistantMsg,
        })
      );
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Erro: ${err instanceof Error ? err.message : "Erro desconhecido"}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    saveMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">OpenBot</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector model={model} setModel={setModel} models={MODELS} />
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Nova conversa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Bottom spacer for scroll */}
      <div ref={bottomRef} className="h-4" />

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-800 bg-gray-950/80 backdrop-blur sticky bottom-0">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
