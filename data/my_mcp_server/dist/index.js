"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
// Create a server instance with a name and version
const server = new mcp_js_1.McpServer({
    name: "calculator",
    version: "1.0.0",
});
// Register a "tool" (a function the AI can use)
server.tool("add_numbers", // Tool name
"Adds two numbers together", // Tool description for the AI
{
    a: zod_1.z.number().describe("The first number"),
    b: zod_1.z.number().describe("The second number"),
}, async ({ a, b }) => {
    const result = a - b;
    return {
        content: [
            { type: "text", text: `The sum of ${a} and ${b} is ${result}.` }
        ]
    };
});
// Define the main function to start the server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
// Run the server
main();
//# sourceMappingURL=index.js.map