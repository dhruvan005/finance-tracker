// components/FinanceChatbot.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Define suggested questions for quick access
const SUGGESTED_QUESTIONS = [
  "How can I save more money?",
  "What's my spending pattern?",
  "How much should I invest monthly?",
  "Help me create a budget plan",
];

// Initial welcome message from the bot
const WELCOME_MESSAGE = {
  role: "bot" as const,
  text: "Hello! I'm your AI Financial Coach. I can help you with budgeting, saving strategies, investment advice, and more. What would you like to know about your finances today?",
};

export function FinanceChatbot() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] =
    useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    // Improved scrolling logic with a small delay to ensure DOM has updated
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Use a short timeout to ensure DOM has been updated
    const timeoutId = setTimeout(scrollToBottom, 50);
    
    // Immediate scroll for better UX
    scrollToBottom();
    
    return () => clearTimeout(timeoutId);
  }, [messages, currentStreamingMessage]);

  // Reset error state when user starts typing
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
      // Use AbortController to implement a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
      }      // Handle streaming response
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let completeResponse = ''; // Local variable to track the complete response

        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode and append the chunk
          const chunk = decoder.decode(value);
          completeResponse += chunk; // Add to our local complete response
          
          // Update the UI with current progress
          setCurrentStreamingMessage(completeResponse);
        }

        // After stream is complete, add the full message to the messages list
        setMessages((prev) => [...prev, { role: "bot", text: completeResponse }]);
        setCurrentStreamingMessage(""); // Clear the streaming message
      } else {
        throw new Error("Response body is empty");
      }
    } catch (error: any) {
      console.error("Error getting chatbot response:", error);
      // For aborted requests, try to fetch a fallback response silently
      if (error.name === "AbortError") {
        try {
          // We'll try once more with a simpler request to get a fallback response
          const fallbackRes = await fetch("/api/chatbot", {
            method: "POST",
            body: JSON.stringify({
              question: text,
              useLocalOnly: true, // Signal to use only local processing
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });          if (fallbackRes.ok) {
            // Handle streaming fallback response
            if (fallbackRes.body) {
              const reader = fallbackRes.body.getReader();
              const decoder = new TextDecoder();
              let fallbackText = "";
              
              // Show streaming in UI for fallback as well
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                fallbackText += chunk;
                
                // Update streaming UI
                setCurrentStreamingMessage(fallbackText);
              }

              // Final message with the note about using local data
              const finalText = fallbackText + "\n\n(Using local financial data due to connection timeout)";
              
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  text: finalText,
                },
              ]);
              
              // Clear streaming text
              setCurrentStreamingMessage("");
              return; // Exit early since we handled the error
            }
          }
        } catch (fallbackError) {
          console.error("Even fallback request failed:", fallbackError);
        }
      }

      // If we get here, even the fallback request failed or we had a different error
      let errorMessage =
        "I apologize for the interruption. There was an issue connecting to my financial analysis system. I can still provide general advice based on your existing financial data.";

      if (error.name === "AbortError") {
        errorMessage =
          "The request took too long to process. Here's some general information about your finances instead.";
      } else if (error.message.includes("status: 404")) {
        errorMessage =
          "I couldn't find the financial advice service. Let me provide some general insights instead.";
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
            <h2 className="text-xl font-bold">💬 AI Financial Coach</h2>
            <p className="text-sm opacity-80">
              Ask me anything about your finances
            </p>
          </div>
          <div className="flex items-center bg-blue-700 px-2 py-1 rounded text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            <span>Using local data</span>
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
              // Get the last user message
              const lastUserMessage = [...messages]
                .reverse()
                .find((m) => m.role === "user")?.text;
              if (lastUserMessage) {
                // Remove the last two messages (error message and user's question)
                setMessages((prev) => prev.slice(0, prev.length - 2));
                // Try again with the same question
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
            placeholder="Type your financial question..."
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
