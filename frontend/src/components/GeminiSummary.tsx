import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface GeminiSummaryProps {
  summary: string;
}

export default function GeminiSummary({ summary }: GeminiSummaryProps) {
  const paragraphs = summary.split('\n').filter(p => p.trim().length > 0);
  
  return (
    <Card className="bg-purple-50 rounded-xl p-6 mb-6 border border-purple-200">
      <CardContent className="p-0">
        <div className="flex items-start mb-3">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">ملخص Gemini</h3>
            <p className="text-xs text-gray-500">تم إنشاؤه باستخدام Google Gemini AI</p>
          </div>
        </div>
        
        <div className="text-gray-800 text-right" dir="rtl">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index < paragraphs.length - 1 ? "mb-2" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
