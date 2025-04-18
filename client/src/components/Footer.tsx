import { Link } from "wouter";
import { Search, Facebook, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <div className="h-6 w-6 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <span className="ml-2 text-lg font-medium text-primary">Carroto</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">محرك بحث مدعوم بالذكاء الإصطناعي</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">المنتج</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="#features" className="text-base text-gray-500 hover:text-gray-900">الميزات</Link></li>
                <li><Link href="#pricing" className="text-base text-gray-500 hover:text-gray-900">الأسعار</Link></li>
                <li><Link href="#api" className="text-base text-gray-500 hover:text-gray-900">واجهة برمجة التطبيقات</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">الشركة</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/about" className="text-base text-gray-500 hover:text-gray-900">من نحن</Link></li>
                <li><Link href="/team" className="text-base text-gray-500 hover:text-gray-900">فريق العمل</Link></li>
                <li><Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">اتصل بنا</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">القانونية</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">شروط الاستخدام</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-base text-gray-700 font-medium">&copy; {new Date().getFullYear()} كاروت كو. جميع الحقوق محفوظة.</p>
            <p className="text-sm text-gray-500 mt-1">تم التطوير بواسطة فريق كاروت كو بقيادة إسلام إبراهيم</p>
            <p className="text-sm text-gray-500 mt-1">Powered by Google Gemini AI</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
