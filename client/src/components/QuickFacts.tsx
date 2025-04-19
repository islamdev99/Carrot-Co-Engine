import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Fact {
  title: string;
  content: string;
}

interface QuickFactsProps {
  facts: Fact[];
}

export default function QuickFacts({ facts }: QuickFactsProps) {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 text-right" dir="rtl">
          حقائق سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-right" dir="rtl">
          {facts.map((fact, index) => (
            <div key={index}>
              <h4 className="text-sm font-medium text-gray-700">{fact.title}:</h4>
              <p className="text-gray-600">{fact.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
