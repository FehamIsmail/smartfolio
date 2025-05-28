"use client";

import { useAccount } from "wagmi";
import AgentChat from "./components/AgentChat";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Home page for the AgentKit Quickstart
 *
 * @returns {React.ReactNode} The home page
 */
export default function Home() {
  const { chainId, chain } = useAccount();

  return (
    <div className="flex flex-col flex-grow items-center justify-center text-black w-full h-full">
      <ConnectButton />
      <AgentChat />
      <div>
        <p>Network ID: {chainId}</p>
        <p>Network Name: {chain?.name}</p>
      </div>
    </div>
  );
}
