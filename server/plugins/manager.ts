
import { SearchPlugin } from "./types";
import { SearchResult } from "@shared/schema";

export class PluginManager {
  private plugins: SearchPlugin[] = [];

  registerPlugin(plugin: SearchPlugin) {
    this.plugins.push(plugin);
  }

  async search(query: string): Promise<SearchResult[]> {
    const results = await Promise.all(
      this.plugins.map(plugin => plugin.search(query))
    );
    return results.flat();
  }
}

export const pluginManager = new PluginManager();
