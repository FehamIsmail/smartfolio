"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "../hooks/useAgent";
import { useAccount } from "wagmi";
import ReactMarkdown from "react-markdown";

/**
 * AgentChat component that integrates with wagmi for wallet connectivity
 *
 * @returns {React.ReactNode} The agent chat interface
 */
export default function AgentChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isThinking } = useAgent();
  const { address, chainId, isConnected } = useAccount();

  // Ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    
    const message = input;
    setInput("");
    
    // Create wallet config if wallet is connected
    const walletConfig = isConnected && address && chainId 
      ? { address: address as `0x${string}`, chainId }
      : undefined;

    await sendMessage(message, walletConfig);
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center text-black w-full h-full">
      <div className="w-full max-w-2xl h-[70vh] bg-white shadow-lg rounded-lg p-4 flex flex-col mb-10">
        {/* Wallet Status */}
        {isConnected && address && (
          <div className="mb-4 p-2 bg-green-100 rounded text-sm">
            🟢 Connected: {address.slice(0, 6)}...{address.slice(-4)} on Chain {chainId}
          </div>
        )}
        
        {!isConnected && (
          <div className="mb-4 p-2 bg-yellow-100 rounded text-sm">
            ⚠️ Wallet not connected - using default agent wallet
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto space-y-3 p-2">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">
              {isConnected 
                ? `Start chatting with AgentKit using your connected wallet!`
                : `Connect your wallet above or start chatting with the default agent...`
              }
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl shadow ${
                  msg.sender === "user"
                    ? "bg-[#0052FF] text-white self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                <ReactMarkdown
                  components={{
                    a: props => (
                      <a
                        {...props}
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))
          )}

          {/* Thinking Indicator */}
          {isThinking && <div className="text-right mr-2 text-gray-500 italic">🤖 Thinking...</div>}

          {/* Invisible div to track the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            className="flex-grow p-2 rounded border"
            placeholder={isConnected ? "Type a message..." : "Type a message (using default wallet)..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSendMessage()}
            disabled={isThinking}
          />
          <button
            onClick={onSendMessage}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              isThinking
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-[#0052FF] hover:bg-[#003ECF] text-white shadow-md"
            }`}
            disabled={isThinking}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 