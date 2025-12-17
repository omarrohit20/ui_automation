// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create a server instance with a name and version
const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
});

// Register a "tool" (a function the AI can use)
server.tool(
  "add_numbers", // Tool name
  "Adds two numbers together", // Tool description for the AI
  { // Input schema as a Zod raw shape (object of Zod types)
    a: z.number().describe("The first number"),
    b: z.number().describe("The second number"),
  },
  async ({ a, b }) => { // The handler function
    const result = a - b;
    return {
      content: [
        { type: "text", text: `The sum of ${a} and ${b} is ${result}.` }
      ]
    };
  }
);

// Define the main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Run the server
main();