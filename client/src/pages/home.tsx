import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { GeminiResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<GeminiResponse | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    console.log("Search initiated for:", searchQuery);
    setQuery(searchQuery);
    setSearchInitiated(true);
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Make direct API call instead of using refetch
      console.log("Making API request for search:", searchQuery);
      // Encoding for special characters in Arabic or other languages
      const encodedQuery = encodeURIComponent(searchQuery);
      console.log("Encoded query:", encodedQuery);
      
      const response = await apiRequest("POST", "/api/search", { query: searchQuery });
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Search results received:", data);
      
      if (!data || !data.results) {
        throw new Error("Invalid search response format");
      }
      
      // Add default values for optional fields if missing
      if (data.resultsCount === undefined) {
        data.resultsCount = data.results.length;
      }
      if (data.searchTime === undefined) {
        data.searchTime = 0;
      }
      
      // Update the search data state
      setSearchData(data);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(err as Error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLucky = async (searchQuery: string) => {
    console.log("Feeling Lucky initiated for:", searchQuery);
    
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      
      // Encoding for special characters in Arabic or other languages
      const encodedQuery = encodeURIComponent(searchQuery);
      console.log("Lucky Encoded query:", encodedQuery);
      
      const response = await apiRequest("POST", "/api/search", { query: searchQuery });
      if (!response.ok) {
        throw new Error(`Lucky search failed with status ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Lucky search results:", data);
      
      if (!data || !data.results) {
        throw new Error("Invalid lucky search response format");
      }
      
      // Redirect to the first result URL if available
      if (data.results && data.results.length > 0) {
        const firstUrl = data.results[0].url;
        console.log("Redirecting to:", firstUrl);
        window.location.href = firstUrl;
      } else {
        console.log("No results found for lucky search, falling back to regular search");
        // If no results, perform regular search
        handleSearch(searchQuery);
      }
    } catch (err) {
      console.error("Feeling Lucky error:", err);
      // Fall back to regular search in case of error
      handleSearch(searchQuery);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-4xl mx-auto pt-10 pb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">كاروت كو</h1>
          <p className="text-xl text-gray-600 mb-2">محرك بحث ذكي مدعوم بالذكاء الاصطناعي</p>
          <p className="text-sm text-gray-500 mb-8">تطوير فريق كاروت كو بقيادة إسلام إبراهيم</p>
          
          <SearchForm 
            onSearch={handleSearch} 
            onLucky={handleLucky}
          />
        </div>
        
        {searchInitiated && (
          <>
            {isSearching && <LoadingState />}
            {searchError && <ErrorState />}
            {searchData && !isSearching && !searchError && (
              <SearchResults results={searchData} query={query} />
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
