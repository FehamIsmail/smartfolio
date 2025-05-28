import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider, prepareAgentkitWithWallet } from "./prepare-agentkit";
import { ViemWalletProvider } from "@coinbase/agentkit";
import { createWalletClient, http } from "viem";
import { mainnet, base, baseSepolia } from "viem/chains";

/**
 * Agent Configuration Guide
 *
 * This file handles the core configuration of your AI agent's behavior and capabilities.
 *
 * Key Steps to Customize Your Agent:
 *
 * 1. Select your LLM:
 *    - Modify the `openai` instantiation to choose your preferred LLM
 *    - Configure model parameters like temperature and max tokens
 *
 * 2. Instantiate your Agent:
 *    - Pass the LLM, tools, and memory into `createReactAgent()`
 *    - Configure agent-specific parameters
 */

// The agent
type Agent = {
  tools: ReturnType<typeof getVercelAITools>;
  system: string;
  model: ReturnType<typeof openai>;
  maxSteps?: number;
};
let agent: Agent;

// Wallet configuration type
export type WalletConfig = {
  address: `0x${string}`;
  chainId: number;
};

// Chain mapping for supported chains
const CHAIN_MAP = {
  1: mainnet,
  8453: base,
  84532: baseSepolia,
} as const;

/**
 * Creates an agent with a custom wallet configuration
 */
export async function createAgentWithWallet(walletConfig: WalletConfig): Promise<Agent> {
  try {
    // Initialize LLM
    const model = openai("gpt-4o-mini");

    // Map chainId to chain object
    const chain = CHAIN_MAP[walletConfig.chainId as keyof typeof CHAIN_MAP];
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${walletConfig.chainId}`);
    }

    // Create wallet client with the provided config
    const walletClient = createWalletClient({
      account: walletConfig.address,
      chain,
      transport: http(),
    });

    // Create ViemWalletProvider
    const walletProvider = new ViemWalletProvider(walletClient);

    // Initialize AgentKit with the custom wallet provider
    const { agentkit } = await prepareAgentkitWithWallet(walletProvider);

    // Initialize Agent
    const canUseFaucet = walletProvider.getNetwork().networkId == "base-sepolia";
    const faucetMessage = `If you ever need funds, you can request them from the faucet.`;
    const cantUseFaucetMessage = `If you need funds, you can provide your wallet details and request funds from the user.`;
    const system = `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. ${canUseFaucet ? faucetMessage : cantUseFaucetMessage}.
        You are connected to the user's wallet at ${walletConfig.address} on ${chain.name}.
        Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, and 
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
        restating your tools' descriptions unless it is explicitly requested.
        `;
    const tools = getVercelAITools(agentkit);

    return {
      tools,
      system,
      model,
      maxSteps: 10,
    };
  } catch (error) {
    console.error("Error initializing agent with wallet:", error);
    throw new Error("Failed to initialize agent with wallet");
  }
}

/**
 * Initializes and returns an instance of the AI agent.
 * If walletConfig is provided, creates agent with that wallet.
 * Otherwise, uses the default SmartWallet setup.
 */
export async function createAgent(walletConfig?: WalletConfig): Promise<Agent> {
  // If wallet config is provided, create agent with that wallet
  if (walletConfig) {
    return createAgentWithWallet(walletConfig);
  }

  // If agent has already been initialized with default setup, return it
  if (agent) {
    return agent;
  }

  try {
    // Initialize LLM: https://platform.openai.com/docs/models#gpt-4o
    const model = openai("gpt-4o-mini");

    const { agentkit, walletProvider } = await prepareAgentkitAndWalletProvider();

    // Initialize Agent
    const canUseFaucet = walletProvider.getNetwork().networkId == "base-sepolia";
    const faucetMessage = `If you ever need funds, you can request them from the faucet.`;
    const cantUseFaucetMessage = `If you need funds, you can provide your wallet details and request funds from the user.`;
    const system = `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. ${canUseFaucet ? faucetMessage : cantUseFaucetMessage}.
        Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, and 
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
        restating your tools' descriptions unless it is explicitly requested.
        `;
    const tools = getVercelAITools(agentkit);

    agent = {
      tools,
      system,
      model,
      maxSteps: 10,
    };

    return agent;
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw new Error("Failed to initialize agent");
  }
}
