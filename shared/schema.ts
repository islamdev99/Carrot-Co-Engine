import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const searchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty"),
});

export const geminiResponseSchema = z.object({
  summary: z.string(),
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      snippet: z.string(),
      tags: z.array(z.string()).optional(),
    })
  ),
  relatedSearches: z.array(z.string()),
  quickFacts: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  resultsCount: z.number().optional().default(() => 0),
  searchTime: z.number().optional().default(() => 0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SearchQuery = z.infer<typeof searchSchema>;
export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
