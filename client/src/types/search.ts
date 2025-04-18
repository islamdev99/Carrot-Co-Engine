export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  tags?: string[];
}

export interface QuickFact {
  title: string;
  content: string;
}

export interface SearchResponse {
  summary: string;
  results: SearchResult[];
  relatedSearches: string[];
  quickFacts: QuickFact[];
  resultsCount: number;
  searchTime: number;
}

export interface SearchError {
  message: string;
  errors?: any[];
}
