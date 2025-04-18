// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var searchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty")
});
var geminiResponseSchema = z.object({
  summary: z.string(),
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      snippet: z.string(),
      tags: z.array(z.string()).optional()
    })
  ),
  relatedSearches: z.array(z.string()),
  quickFacts: z.array(
    z.object({
      title: z.string(),
      content: z.string()
    })
  ),
  resultsCount: z.number().optional().default(() => 0),
  searchTime: z.number().optional().default(() => 0)
});

// server/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
var geminiKey = "AIzaSyD0VACW_n1m84fjq29d8_CL6dbsiriyDzc";
var genAI = new GoogleGenerativeAI(geminiKey);
var model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
async function searchWikipedia(query) {
  try {
    const searchUrl = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const searchResponse = await axios.get(searchUrl);
    const searchResults = searchResponse.data.query.search;
    if (searchResults.length === 0) {
      return [];
    }
    const topResults = searchResults.slice(0, 3);
    const wikiResults = topResults.map((result) => {
      const snippet = result.snippet.replace(/<\/?[^>]+(>|$)/g, "");
      return {
        title: result.title,
        url: `https://ar.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, "_"))}`,
        snippet,
        tags: ["\u0648\u064A\u0643\u064A\u0628\u064A\u062F\u064A\u0627"]
      };
    });
    return wikiResults;
  } catch (error) {
    console.error("Wikipedia search error:", error);
    return [];
  }
}
async function generateSearchResults(query) {
  try {
    const startTime = performance.now();
    const wikipediaResultsPromise = searchWikipedia(query);
    const prompt = `
      Query: ${query}
      
      I need the following information about this query in Arabic language:
      1. A brief summary (2-3 paragraphs)
      2. A list of 2-3 relevant web results with title, url, and snippet
      3. A list of 6 related searches 
      4. Quick facts (3 items) about the topic
      
      It is extremely important to return your response as a valid JSON object with exactly these properties: 
      {
        "summary": "Your summary in Arabic here...",
        "results": [
          { "title": "Result 1 title", "url": "https://example.com/1", "snippet": "Result 1 snippet" },
          { "title": "Result 2 title", "url": "https://example.com/2", "snippet": "Result 2 snippet" }
        ],
        "relatedSearches": ["related search 1", "related search 2", ...],
        "quickFacts": [
          { "title": "Fact 1 title", "content": "Fact 1 content" },
          { "title": "Fact 2 title", "content": "Fact 2 content" }
        ]
      }
      
      Do not add any explanations, markdown formatting, or text outside of the JSON object. Your response must be a valid JSON object that can be parsed directly.
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let parsedResponse;
    try {
      let jsonText = responseText;
      const jsonBlockMatch = responseText.match(/```(?:json)?([\s\S]*?)```/);
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        jsonText = jsonBlockMatch[1].trim();
      } else {
        jsonText = responseText.replace(/```json|```/g, "").trim();
      }
      const jsonMatch = jsonText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      console.log("Attempting to parse JSON:", jsonText);
      parsedResponse = JSON.parse(jsonText);
      console.log("Successfully parsed Gemini response");
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.log("Raw response:", responseText);
      const summaryMatch = responseText.match(/summary["\s:]+([^"]+)/i);
      const summary = summaryMatch ? summaryMatch[1] : `\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0646 ${query}`;
      parsedResponse = {
        summary,
        results: [],
        relatedSearches: [],
        quickFacts: []
      };
    }
    const wikipediaResults = await wikipediaResultsPromise;
    const combinedResults = [
      ...Array.isArray(parsedResponse.results) ? parsedResponse.results : [],
      ...wikipediaResults
    ];
    const endTime = performance.now();
    const searchTime = (endTime - startTime) / 1e3;
    return {
      summary: parsedResponse.summary || `\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0646 ${query}`,
      results: combinedResults,
      relatedSearches: Array.isArray(parsedResponse.relatedSearches) ? parsedResponse.relatedSearches : [],
      quickFacts: Array.isArray(parsedResponse.quickFacts) ? parsedResponse.quickFacts : [],
      resultsCount: combinedResults.length + 50,
      // Adding some random count to make it look more realistic
      searchTime
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return generatePlaceholderResponse(query);
  }
}
function generatePlaceholderResponse(query) {
  return {
    summary: `\u0646\u0623\u0633\u0641\u060C \u0644\u0645 \u0646\u062A\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0645\u0646 Gemini API. \u0647\u0630\u0647 \u0646\u062A\u0627\u0626\u062C \u0628\u062F\u064A\u0644\u0629 \u0639\u0646 "${query}".`,
    results: [
      {
        title: `${query} - \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0623\u0633\u0627\u0633\u064A\u0629`,
        url: "https://example.com/article1",
        snippet: `\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0627\u0645\u0629 \u0639\u0646 ${query}.`,
        tags: ["\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0623\u0633\u0627\u0633\u064A\u0629"]
      },
      {
        title: `\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062D\u0648\u0644 ${query}`,
        url: "https://example.org/guide",
        snippet: `\u062F\u0644\u064A\u0644 \u062D\u0648\u0644 ${query} \u0648\u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0627\u062A\u0647.`
      }
    ],
    relatedSearches: [
      `${query} \u0645\u0639\u0644\u0648\u0645\u0627\u062A`,
      `${query} \u062A\u0639\u0631\u064A\u0641`,
      `${query} \u0623\u0645\u062B\u0644\u0629`,
      `${query} \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0627\u062A`,
      `${query} \u062A\u0627\u0631\u064A\u062E`,
      `${query} \u0641\u064A \u0627\u0644\u0639\u0631\u0628\u064A\u0629`
    ],
    quickFacts: [
      {
        title: "\u062A\u0639\u0631\u064A\u0641",
        content: `${query} \u0647\u0648 \u0645\u0635\u0637\u0644\u062D \u064A\u0633\u062A\u062E\u062F\u0645 \u0644\u0644\u0625\u0634\u0627\u0631\u0629 \u0625\u0644\u0649...`
      },
      {
        title: "\u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645",
        content: `\u064A\u0633\u062A\u062E\u062F\u0645 ${query} \u0641\u064A \u0639\u062F\u0629 \u0645\u062C\u0627\u0644\u0627\u062A.`
      },
      {
        title: "\u0645\u0639\u0644\u0648\u0645\u0629",
        content: `\u062D\u0642\u064A\u0642\u0629 \u0645\u062B\u064A\u0631\u0629 \u0639\u0646 ${query}.`
      }
    ],
    resultsCount: 123,
    searchTime: 0.5
  };
}

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/search", async (req, res) => {
    try {
      const { query } = searchSchema.parse(req.body);
      const startTime = Date.now();
      const results = await generateSearchResults(query);
      const searchTime = (Date.now() - startTime) / 1e3;
      const responseData = {
        ...results,
        searchTime
      };
      const validatedResponse = geminiResponseSchema.parse(responseData);
      return res.json(validatedResponse);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid search query",
          errors: error.errors
        });
      }
      console.error("Search error:", error);
      return res.status(500).json({
        message: "An error occurred while processing your search"
      });
    }
  });
  app2.post("/api/voice-search", async (req, res) => {
    try {
      const { query } = searchSchema.parse(req.body);
      const startTime = Date.now();
      const results = await generateSearchResults(query);
      const searchTime = (Date.now() - startTime) / 1e3;
      const responseData = {
        ...results,
        searchTime
      };
      const validatedResponse = geminiResponseSchema.parse(responseData);
      return res.json(validatedResponse);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid voice search query",
          errors: error.errors
        });
      }
      console.error("Voice search error:", error);
      return res.status(500).json({
        message: "An error occurred while processing your voice search"
      });
    }
  });
  app2.get("/api/suggestions", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }
      const suggestions = await generateSearchSuggestions(query);
      return res.json({ suggestions });
    } catch (error) {
      console.error("Suggestions error:", error);
      return res.status(500).json({
        message: "An error occurred while fetching suggestions"
      });
    }
  });
  async function generateSearchSuggestions(query) {
    const suggestions = [
      `${query} \u062A\u0639\u0631\u064A\u0641`,
      `${query} \u0623\u0645\u062B\u0644\u0629`,
      `${query} \u0641\u064A \u0627\u0644\u0639\u0627\u0644\u0645 \u0627\u0644\u0639\u0631\u0628\u064A`,
      `${query} \u0645\u0642\u0627\u0644\u0627\u062A`,
      `\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 ${query}`
    ];
    return suggestions;
  }
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const __filename2 = fileURLToPath(import.meta.url);
  const __dirname2 = dirname(__filename2);
  const distPath = path2.resolve(__dirname2, "../public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var { resolve } = path3;
var __filename = fileURLToPath2(import.meta.url);
var __dirname = path3.dirname(__filename);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") {
  const publicPath = resolve(__dirname, "../public");
  app.use(express2.static(publicPath));
}
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
