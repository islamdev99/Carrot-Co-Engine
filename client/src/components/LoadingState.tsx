import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="text-center py-16 animate-in fade-in zoom-in duration-300">
      <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-primary">
        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" />
        <span>جاري البحث...</span>
      </div>
    </div>
  );
}
