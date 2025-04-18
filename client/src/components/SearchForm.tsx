import { useState, FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mic } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: string) => void;
  onLucky: (query: string) => void;
}

export default function SearchForm({ onSearch, onLucky }: SearchFormProps) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleLuckyClick = () => {
    if (query.trim()) {
      onLucky(query);
    }
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore - WebkitSpeechRecognition is not in the TypeScript types
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'ar';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        if (inputRef.current) {
          inputRef.current.value = transcript;
        }
      };
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="اكتب استعلامك هنا..."
            dir="rtl"
            className="w-full px-4 py-6 pr-12 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary rounded-full shadow-sm text-gray-800 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-primary"
              onClick={startVoiceSearch}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 border">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-right px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                  onSearch(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-4 space-x-4 rtl:space-x-reverse">
          <Button 
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-purple-700"
          >
            بحث
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50"
            onClick={handleLuckyClick}
          >
            أشعر بالحظ
          </Button>
        </div>
      </form>
    </div>
  );
}
