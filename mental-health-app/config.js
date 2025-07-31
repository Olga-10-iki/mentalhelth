// Environment configuration
const CONFIG = {
  // For development - these would be environment variables in production
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  NEWS_API_KEY: process.env.NEWS_API_KEY || "",

  // Free APIs (no keys needed)
  QUOTABLE_API: "https://api.quotable.io",

  // API endpoints
  ENDPOINTS: {
    quotes: "https://api.quotable.io/random",
    quotesByTag: (tag) => `https://api.quotable.io/random?tags=${tag}`,
  },
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG
}
