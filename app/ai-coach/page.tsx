"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTED_QUESTIONS = [
  "How can I save more money?",
  "What's my spending pattern?",
  "How much should I invest monthly?",
  "Help me create a budget plan",
  "Analyze my financial health",
  "What's my emergency fund status?",
];

const WELCOME_MESSAGE = {
  role: "bot" as const,
  text: "Hello! I'm your AI Financial Coach with access to your personal financial data. I can provide personalized advice based on your actual income, expenses, savings, and investments. What would you like to know about your finances today?",
};

export default function FinanceChatbot() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    const timeoutId = setTimeout(scrollToBottom, 50);
    scrollToBottom();
    
    return () => clearTimeout(timeoutId);
  }, [messages, currentStreamingMessage]);

  useEffect(() => {
    if (input.trim() && lastError) {
      setLastError(null);
    }
  }, [input, lastError]);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;

    setIsLoading(true);
    const userMessage: { role: "user" | "bot"; text: string } = {
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setCurrentStreamingMessage("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch("/api/chatbot", {
        method: "POST",
        body: JSON.stringify({ question: text }),
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      // Handle streaming response from Vercel AI SDK
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let completeResponse = '';

        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Handle data stream format from Vercel AI SDK
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Extract the actual text content
              try {
                const content = line.substring(2);
                const parsed = JSON.parse(content);
                if (parsed && typeof parsed === 'string') {
                  completeResponse += parsed;
                  setCurrentStreamingMessage(completeResponse);
                }
              } catch (error) {
                // If parsing fails, treat as plain text
                const content = line.substring(2);
                if (content) {
                  completeResponse += content;
                  setCurrentStreamingMessage(completeResponse);
                }
              }
            }
          }
        }

        // After stream is complete, add the full message to the messages list
        setMessages((prev) => [...prev, { role: "bot", text: completeResponse }]);
        setCurrentStreamingMessage("");
      } else {
        throw new Error("Response body is empty");
      }
    } catch (error : any) {
      console.error("Error getting chatbot response:", error);
      
      // Enhanced error handling
      let errorMessage = "I apologize for the interruption. Let me provide some general financial guidance based on common scenarios.";

      if (error.name === "AbortError") {
        errorMessage = "The request took longer than expected. Here's some general financial advice while I work on improving response times.";
      } else if (error.message.includes("status: 401")) {
        errorMessage = "Please make sure you're logged in to access personalized financial advice.";
      } else if (error.message.includes("status: 404")) {
        errorMessage = "I'm having trouble accessing the financial advice service. Here's some general guidance.";
      }

      setLastError(error.message);
      setMessages((prev) => [...prev, { role: "bot", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">🤖 AI Financial Coach</h2>
            <p className="text-sm opacity-80">
              Personalized advice using your financial data
            </p>
          </div>
          <div className="flex items-center bg-blue-700 px-2 py-1 rounded text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            <span>RAG Enabled</span>
          </div>
        </div>
      </div>

      {/* Message container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Streaming message display */}
        {currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none shadow-sm">
              <p className="whitespace-pre-wrap">{currentStreamingMessage}</p>
              <div className="flex items-center mt-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                <span className="text-xs text-gray-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 shadow-sm">
              <div className="flex gap-2 items-center">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions or error retry */}
      {lastError ? (
        <div className="px-4 pb-2">
          <p className="text-sm text-red-500 mb-2">
            Something went wrong with the last request.
          </p>
          <button
            onClick={() => {
              setLastError(null);
              const lastUserMessage = [...messages]
                .reverse()
                .find((m) => m.role === "user")?.text;
              if (lastUserMessage) {
                setMessages((prev) => prev.slice(0, prev.length - 2));
                setTimeout(() => sendMessage(lastUserMessage), 300);
              }
            }}
            className="text-xs bg-blue-100 hover:bg-blue-200 px-4 py-1.5 rounded-full text-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : (
        messages.length < 3 && (
          <div className="px-4 pb-2">
            <p className="text-sm text-gray-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow"
            placeholder="Ask about your finances..."
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}