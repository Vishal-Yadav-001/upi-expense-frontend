import { useState, useSyncExternalStore } from "react";
import { useMutation } from "@apollo/client/react";
import { ASK_AI } from "@/lib/queries";
import { getStoredGeminiApiKey, getStoredGeminiModel } from "@/lib/ai-settings";

interface AskAIData {
  askAI: {
    answer: string;
    toolsUsed: string[];
    data: string | null;
  };
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: Record<string, unknown> | null;
}

const subscribe = () => () => {};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [askAI, { loading }] = useMutation<AskAIData>(ASK_AI);
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false);

  const getAskAIVariables = (question: string) => {
    const model = getStoredGeminiModel();
    const apiKey = getStoredGeminiApiKey();

    return {
      question,
      model,
      apiKey: apiKey || undefined,
    };
  };

  const sendMessage = async (content: string) => {
    if (!isMounted) return;
    
    const userMessage: Message = {
      id: window.crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await askAI({ variables: getAskAIVariables(content) });
      const data = response.data;
      
      if (!data) throw new Error("No data received");

      const assistantMessage: Message = {
        id: window.crypto.randomUUID(),
        role: "assistant",
        content: data.askAI.answer,
        data: data.askAI.data ? JSON.parse(data.askAI.data) : null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: window.crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const addSystemMessage = (content: string) => {
    if (!isMounted) return;
    
    const systemMessage: Message = {
      id: window.crypto.randomUUID(),
      role: "assistant",
      content,
    };
    
    setMessages((prev) => [...prev, systemMessage]);
  };

  const askSilentQuestion = async (content: string) => {
    if (!isMounted) return;
    
    try {
      const response = await askAI({ variables: getAskAIVariables(content) });
      const data = response.data;
      
      if (!data) throw new Error("No data received");

      const assistantMessage: Message = {
        id: window.crypto.randomUUID(),
        role: "assistant",
        content: data.askAI.answer,
        data: data.askAI.data ? JSON.parse(data.askAI.data) : null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send silent message:", error);
      const errorMessage: Message = {
        id: window.crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error while analyzing your statement. Please ask me a question to try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return {
    messages,
    sendMessage,
    addSystemMessage,
    askSilentQuestion,
    loading,
  };
};
