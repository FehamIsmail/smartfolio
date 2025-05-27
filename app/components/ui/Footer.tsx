export function Footer() {
  return (
    <footer className="py-4 text-center text-gray-500 dark:text-gray-400 flex-none">
      <img
        src="https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg"
        alt="Coinbase"
        className="h-6 mx-auto mb-2"
      />
      <div className="mt-2">
        <a
          href="https://github.com/coinbase/agentkit"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          href="https://docs.cdp.coinbase.com/agentkit/docs/welcome"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          Documentation
        </a>{" "}
        |{" "}
        <a
          href="https://discord.gg/CDP"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          Discord
        </a>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Powered by{" "}
        <a
          href="https://docs.cdp.coinbase.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          CDP
        </a>
      </p>
      <p className="text-xs text-gray-400 mt-2">© {new Date().getFullYear()} Coinbase, Inc.</p>
    </footer>
  );
}
