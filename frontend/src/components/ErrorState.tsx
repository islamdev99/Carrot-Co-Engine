import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ErrorState() {
  return (
    <div className="text-center py-16 animate-in fade-in zoom-in duration-300">
      <Alert variant="destructive" className="bg-red-50 text-red-700 p-4 rounded-lg inline-block max-w-md">
        <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <AlertTitle className="font-medium">حدث خطأ أثناء البحث.</AlertTitle>
        <AlertDescription className="text-sm mt-1">
          يرجى المحاولة مرة أخرى لاحقًا.
        </AlertDescription>
      </Alert>
    </div>
  );
}
