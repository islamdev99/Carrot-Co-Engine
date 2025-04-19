
import axios from "axios";
import { SearchPlugin } from "./types";
import { SearchResult } from "@shared/schema";

export class YouTubePlugin implements SearchPlugin {
  name = "YouTube";
  description = "البحث في يوتيوب";

  async search(query: string): Promise<SearchResult[]> {
    try {
      // Note: This needs a YouTube API key configured
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          q: query,
          part: 'snippet',
          maxResults: 3,
          type: 'video',
          key: process.env.YOUTUBE_API_KEY
        }
      });
      
      return response.data.items.map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        snippet: item.snippet.description,
        tags: ["يوتيوب"]
      }));
    } catch (error) {
      console.error("YouTube search error:", error);
      return [];
    }
  }
}
