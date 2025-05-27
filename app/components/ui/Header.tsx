export function Header() {
  return (
    <header className="py-6 flex items-center justify-between relative">
      <img
        src="https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg"
        alt="Coinbase"
        className="h-8 ml-4"
      />

      <span className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-blue-600 dark:text-blue-400">
        AgentKit
      </span>
    </header>
  );
}
