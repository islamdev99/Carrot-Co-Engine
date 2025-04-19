import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchSchema, geminiResponseSchema } from "@shared/schema";
import { generateSearchResults } from "./gemini";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to perform search
  app.post("/api/search", async (req, res) => {
    try {
      // Validate the search query
      const { query } = searchSchema.parse(req.body);
      
      // Start timing the search
      const startTime = Date.now();
      
      // Get search results from Gemini
      const results = await generateSearchResults(query);
      
      // Calculate search time in seconds
      const searchTime = (Date.now() - startTime) / 1000;
      
      // Add search time to the results
      const responseData = {
        ...results,
        searchTime,
      };
      
      // Validate the response data against the schema
      const validatedResponse = geminiResponseSchema.parse(responseData);
      
      // Return the search results
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
  
  // API endpoint for voice search (just proxies to the search endpoint)
  app.post("/api/voice-search", async (req, res) => {
    try {
      // Validate the search query
      const { query } = searchSchema.parse(req.body);
      
      // Forward to the search endpoint
      const startTime = Date.now();
      const results = await generateSearchResults(query);
      const searchTime = (Date.now() - startTime) / 1000;
      
      const responseData = {
        ...results,
        searchTime,
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

  // API endpoint to get search suggestions
  app.get("/api/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }
      
      // In a real app, we would retrieve suggestions from a database or cache
      // For now, we'll generate some related terms based on the query
      const suggestions = await generateSearchSuggestions(query);
      
      return res.json({ suggestions });
    } catch (error) {
      console.error("Suggestions error:", error);
      return res.status(500).json({ 
        message: "An error occurred while fetching suggestions" 
      });
    }
  });

  // Helper function to generate search suggestions
  async function generateSearchSuggestions(query: string): Promise<string[]> {
    // In a real application, this would call an API or database
    // For now, we'll return some hardcoded suggestions related to the query
    const suggestions = [
      `${query} تعريف`,
      `${query} أمثلة`,
      `${query} في العالم العربي`,
      `${query} مقالات`,
      `كيف يعمل ${query}`,
    ];
    
    return suggestions;
  }

  const httpServer = createServer(app);
  return httpServer;
}
