"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Send, User, Bot } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Answer } from "@/components/chat/answer";

interface Message {
  id: string;
  role: "assistant" | "user" | "system" | "data";
  content: string;
  citations?: Citation[];
}

interface ChatMessage {
  id: number;
  content: string;
  role: "assistant" | "user";
  created_at: string;
}

interface Chat {
  id: number;
  title: string;
  messages: ChatMessage[];
}

interface Citation {
  id: number;
  text: string;
  metadata: Record<string, any>;
}

// Extend the default useChat message type
declare module "ai/react" {
  interface Message {
    citations?: Citation[];
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    messages,
    data,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: `/api/chat/${params.id}/messages`,
    headers: {
      Authorization: `Bearer ${
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : ""
      }`,
    },
  });

  useEffect(() => {
    if (isInitialLoad) {
      fetchChat();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [messages, isInitialLoad]);

  const fetchChat = async () => {
    try {
      const data: Chat = await api.get(`/api/chat/${params.id}`);
      const formattedMessages = data.messages.map((msg) => {
        if (msg.role !== "assistant" || !msg.content)
          return {
            id: msg.id.toString(),
            role: msg.role,
            content: msg.content,
          };

        try {
          if (!msg.content.includes("__LLM_RESPONSE__")) {
            return {
              id: msg.id.toString(),
              role: msg.role,
              content: msg.content,
            };
          }

          const [base64Part, responseText] =
            msg.content.split("__LLM_RESPONSE__");

          const contextData = base64Part
            ? (JSON.parse(atob(base64Part.trim())) as {
                context: Array<{
                  page_content: string;
                  metadata: Record<string, any>;
                }>;
              })
            : null;

          const citations: Citation[] =
            contextData?.context.map((citation, index) => ({
              id: index + 1,
              text: citation.page_content,
              metadata: citation.metadata,
            })) || [];

          return {
            id: msg.id.toString(),
            role: msg.role,
            content: responseText || "",
            citations,
          };
        } catch (e) {
          console.error("Failed to process message:", e);
          return {
            id: msg.id.toString(),
            role: msg.role,
            content: msg.content,
          };
        }
      });
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      if (error instanceof ApiError) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      router.push("/dashboard/chat");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const processMessageContent = (message: Message): Message => {
    if (message.role !== "assistant" || !message.content) return message;

    try {
      if (!message.content.includes("__LLM_RESPONSE__")) {
        return message;
      }

      const [base64Part, responseText] =
        message.content.split("__LLM_RESPONSE__");

      const contextData = base64Part
        ? (JSON.parse(atob(base64Part.trim())) as {
            context: Array<{
              page_content: string;
              metadata: Record<string, any>;
            }>;
          })
        : null;

      const citations: Citation[] =
        contextData?.context.map((citation, index) => ({
          id: index + 1,
          text: citation.page_content,
          metadata: citation.metadata,
        })) || [];

      return {
        ...message,
        content: responseText || "",
        citations,
      };
    } catch (e) {
      console.error("Failed to process message:", e);
      return message;
    }
  };

  const markdownParse = (text: string) => {
    return text
      .replace(/\[\[([cC])itation/g, "[citation")
      .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
      .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
      .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)");
  };

  const processedMessages = useMemo(() => {
    return messages.map((message) => {
      if (message.role !== "assistant" || !message.content) return message;

      try {
        if (!message.content.includes("__LLM_RESPONSE__")) {
          return {
            ...message,
            content: markdownParse(message.content),
          };
        }

        const [base64Part, responseText] =
          message.content.split("__LLM_RESPONSE__");

        const contextData = base64Part
          ? (JSON.parse(atob(base64Part.trim())) as {
              context: Array<{
                page_content: string;
                metadata: Record<string, any>;
              }>;
            })
          : null;

        const citations: Citation[] =
          contextData?.context.map((citation, index) => ({
            id: index + 1,
            text: citation.page_content,
            metadata: citation.metadata,
          })) || [];

        return {
          ...message,
          content: markdownParse(responseText || ""),
          citations,
        };
      } catch (e) {
        console.error("Failed to process message:", e);
        return message;
      }
    });
  }, [messages]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-blue-100 bg-white vietinbank-shadow rounded-t-xl mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 vietinbank-gradient rounded-lg flex items-center justify-center p-1">
              <div className="w-full h-full bg-white rounded-md flex items-center justify-center p-0.5">
                <img
                  src="/logo_vietinbank.png"
                  alt="VietinBank Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-700">VietinBank AI Assistant</h1>
              <p className="text-sm text-gray-600">Hỏi đáp các tài liệu thuộc ngân hàng Vietinbank</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            🔒 Bảo mật cao
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[80px]">
          {processedMessages.map((message) =>
            message.role === "assistant" ? (
              <div
                key={message.id}
                className="flex justify-start items-start space-x-3"
              >
                <div className="w-10 h-10 flex items-center justify-center vietinbank-gradient rounded-lg vietinbank-shadow p-1">
                  <div className="w-full h-full bg-white rounded-md flex items-center justify-center p-0.5">
                    <img
                      src="/logo_vietinbank.png"
                      alt="VietinBank Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="max-w-[80%] chat-message-assistant rounded-xl px-4 py-3 vietinbank-shadow">
                  <Answer
                    key={message.id}
                    markdown={message.content}
                    citations={message.citations}
                  />
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className="flex justify-end items-start space-x-3"
              >
                <div className="max-w-[80%] chat-message-user rounded-xl px-4 py-3 vietinbank-red-shadow">
                  {message.content}
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white vietinbank-red-shadow">
                  <User className="h-5 w-5" />
                </div>
              </div>
            )
          )}
          <div className="flex justify-start">
            {isLoading &&
              processedMessages[processedMessages.length - 1]?.role !=
                "assistant" && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center vietinbank-gradient rounded-lg p-1">
                    <div className="w-full h-full bg-white rounded-md flex items-center justify-center p-0.5">
                      <img
                        src="/logo_vietinbank.png"
                        alt="VietinBank Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="max-w-[80%] chat-message-assistant rounded-xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-sm text-blue-600">VietinBank đang suy nghĩ...</span>
                    </div>
                  </div>
                </div>
              )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="border-t-2 border-blue-100 p-4 flex items-center space-x-4 bg-white absolute bottom-0 left-0 right-0 vietinbank-shadow"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Hỏi VietinBank AI về các dịch vụ ngân hàng..."
            className="flex-1 min-w-0 h-12 rounded-xl border-2 border-blue-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent banking-card"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 vietinbank-gradient text-white hover:opacity-90 h-12 px-6 py-2 vietinbank-shadow"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
