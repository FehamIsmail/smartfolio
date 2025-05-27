"use client";

import AgentChat from "./components/AgentChat";

/**
 * Home page for the AgentKit Quickstart
 *
 * @returns {React.ReactNode} The home page
 */
export default function Home() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center text-black w-full h-full">
      <AgentChat />
    </div>
  );
}
