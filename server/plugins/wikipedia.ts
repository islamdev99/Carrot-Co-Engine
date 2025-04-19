
import axios from "axios";
import { SearchPlugin } from "./types";
import { SearchResult } from "@shared/schema";

export class WikipediaPlugin implements SearchPlugin {
  name = "Wikipedia";
  description = "البحث في ويكيبيديا العربية";

  async search(query: string): Promise<SearchResult[]> {
    try {
      const searchUrl = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
      const response = await axios.get(searchUrl);
      const results = response.data.query.search;
      
      return results.slice(0, 3).map(result => ({
        title: result.title,
        url: `https://ar.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
        snippet: result.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
        tags: ["ويكيبيديا"]
      }));
    } catch (error) {
      console.error("Wikipedia search error:", error);
      return [];
    }
  }
}
