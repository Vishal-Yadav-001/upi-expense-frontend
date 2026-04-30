import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const ASK_AI = gql`
  mutation AskAI($question: String!) {
    askAI(question: $question) {
      answer
      toolsUsed
      data
    }
  }
`;

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

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [askAI, { loading }] = useMutation<AskAIData>(ASK_AI);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await askAI({ variables: { question: content } });
      const data = response.data;
      
      if (!data) throw new Error("No data received");

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.askAI.answer,
        data: data.askAI.data ? JSON.parse(data.askAI.data) : null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
  };
};
