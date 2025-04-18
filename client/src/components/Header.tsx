import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";

export default function Header() {
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 text-primary">
                <Search className="h-8 w-8" />
              </div>
              <div className="ml-2">
                <span className="text-xl font-bold text-primary bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">كاروت كو</span>
                <span className="block text-xs text-gray-500">محرك بحث ذكي</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  الرئيسية
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  عن الفريق
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  الإعدادات
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
