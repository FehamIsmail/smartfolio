import { AgentRequest, AgentResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { createAgent, WalletConfig } from "./create-agent";
import { Message, generateId, generateText } from "ai";

const messages: Message[] = [];

// Extended request type to include wallet config
export interface ExtendedAgentRequest extends AgentRequest {
  walletConfig?: WalletConfig;
}

/**
 * Handles incoming POST requests to interact with the AgentKit-powered AI agent.
 * This function processes user messages and streams responses from the agent.
 *
 * @function POST
 * @param {Request & { json: () => Promise<ExtendedAgentRequest> }} req - The incoming request object containing the user message and optional wallet config.
 * @returns {Promise<NextResponse<AgentResponse>>} JSON response containing the AI-generated reply or an error message.
 *
 * @description Sends a single message to the agent and returns the agents' final response.
 *
 * @example
 * const response = await fetch("/api/agent", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ 
 *       userMessage: input,
 *       walletConfig: { address: "0x...", chainId: 1 }
 *     }),
 * });
 */
export async function POST(
  req: Request & { json: () => Promise<ExtendedAgentRequest> },
): Promise<NextResponse<AgentResponse>> {
  try {
    // 1️. Extract user message and wallet config from the request body
    const { userMessage, walletConfig } = await req.json();

    // 2. Get the agent (with wallet config if provided)
    const agent = await createAgent(walletConfig);

    // 3.Start streaming the agent's response
    messages.push({ id: generateId(), role: "user", content: userMessage });
    const { text } = await generateText({
      ...agent,
      messages,
    });

    // 4. Add the agent's response to the messages
    messages.push({ id: generateId(), role: "assistant", content: text });

    // 5️. Return the final response
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process message" });
  }
}
