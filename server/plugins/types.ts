
import { SearchResult } from "@shared/schema";

export interface SearchPlugin {
  name: string;
  description: string;
  search(query: string): Promise<SearchResult[]>;
}

export interface PluginManager {
  registerPlugin(plugin: SearchPlugin): void;
  search(query: string): Promise<SearchResult[]>;
}
