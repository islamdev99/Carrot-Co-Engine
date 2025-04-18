import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from 'react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  tags?: string[];
}

interface ResultsListProps {
  results: SearchResult[];
}

export default function ResultsList({ results }: ResultsListProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter(result => result.tags?.includes(filter));
  }, [results, filter]);

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لم يتم العثور على نتائج</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 justify-end">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${filter === "all" ? "bg-primary text-white" : "bg-gray-100"}`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilter("ويكيبيديا")}
          className={`px-3 py-1 rounded ${filter === "ويكيبيديا" ? "bg-primary text-white" : "bg-gray-100"}`}
        >
          ويكيبيديا
        </button>
      </div>
      <div className="space-y-6">
        {filteredResults.map((result, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="text-right" dir="rtl">
              <a 
                href={result.url} 
                className="text-sm text-gray-600 hover:underline mb-1 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.url}
              </a>

              <h3 className="text-xl font-medium text-blue-700 hover:underline mb-2">
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.title}
                </a>
              </h3>

              <p className="text-gray-700 mb-1">{result.snippet}</p>

              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-end">
                  {result.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}