import { useState } from "react";
import { GeminiResponse } from "@shared/schema";
import GeminiSummary from "./GeminiSummary";
import ResultsList from "./ResultsList";
import RelatedSearches from "./RelatedSearches";
import QuickFacts from "./QuickFacts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchResultsProps {
  results: GeminiResponse;
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  const [page, setPage] = useState(1);
  const resultsPerPage = 4;
  const totalPages = Math.ceil(results.results.length / resultsPerPage);
  
  const paginatedResults = results.results.slice(
    (page - 1) * resultsPerPage, 
    page * resultsPerPage
  );
  
  return (
    <div className="search-results-appear animate-in fade-in slide-in-from-bottom-5 duration-300 ease-in-out">
      {/* Results Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-lg font-medium text-gray-700">نتائج البحث</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span>حوالي <span>{(results.resultsCount || results.results.length).toLocaleString('ar-EG')}</span> نتيجة</span>
            <span className="mx-2">•</span>
            <span><span>{(results.searchTime || 0).toFixed(2)}</span> ثانية</span>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="overflow-x-auto pb-1">
            <TabsTrigger value="all" className="px-3 py-1.5 text-sm font-medium">
              الكل
            </TabsTrigger>
            <TabsTrigger value="images" className="px-3 py-1.5 text-sm font-medium">
              صور
            </TabsTrigger>
            <TabsTrigger value="videos" className="px-3 py-1.5 text-sm font-medium">
              فيديو
            </TabsTrigger>
            <TabsTrigger value="news" className="px-3 py-1.5 text-sm font-medium">
              أخبار
            </TabsTrigger>
            <TabsTrigger value="maps" className="px-3 py-1.5 text-sm font-medium">
              خرائط
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:flex-grow">
          {results.summary && <GeminiSummary summary={results.summary} />}
          
          <ResultsList results={paginatedResults} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative rounded-r-md"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      pageNum === page ? 'bg-primary text-white' : 'text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="relative rounded-l-md"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              </nav>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-24">
            {results.relatedSearches.length > 0 && (
              <RelatedSearches 
                searches={results.relatedSearches} 
                onSelect={(search) => {
                  // Function called after navigation is performed in RelatedSearches component
                  console.log(`Searching for related term: ${search}`);
                }} 
              />
            )}
            
            {results.quickFacts.length > 0 && (
              <QuickFacts facts={results.quickFacts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
