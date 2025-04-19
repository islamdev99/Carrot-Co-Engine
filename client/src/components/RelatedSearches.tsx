import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

interface RelatedSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
}

export default function RelatedSearches({ searches, onSelect }: RelatedSearchesProps) {
  const [_, setLocation] = useLocation();
  
  const handleSearchClick = (search: string) => {
    // Use wouter for proper routing instead of manipulating window.location directly
    setLocation(`/?q=${encodeURIComponent(search)}`);
    onSelect(search);
  };
  
  return (
    <Card className="bg-white shadow-sm border border-gray-200 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 text-right" dir="rtl">
          عمليات بحث ذات صلة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-right" dir="rtl">
          {searches.map((search, index) => (
            <li key={index}>
              <button 
                onClick={() => handleSearchClick(search)}
                className="text-blue-600 hover:underline text-start w-full"
              >
                {search}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
