import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
// استخدام مسار مباشر بدلاً من استيراد الصورة
const carrotLogoPath = "/messi (2).png";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            عن فريق كاروت كو
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <img 
                src={carrotLogoPath} 
                alt="شعار كاروت كو" 
                className="w-48 h-auto object-contain rounded-lg"
              />
            </div>
            <div className="w-full md:w-2/3">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">من نحن</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    فريق كاروت كو هو فريق متخصص في تطوير الألعاب والمشاريع البرمجية والمحتوى الرقمي.
                    تم تأسيس الفريق في شهر يوليو من عام 2024، بهدف إنشاء منتجات رقمية مبتكرة وعالية الجودة.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    نسعى في كاروت كو لتقديم حلول تكنولوجية متميزة تلبي احتياجات عملائنا، ونؤمن بأن الإبداع
                    والابتكار هما أساس نجاحنا.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">خدماتنا</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>تطوير ألعاب الفيديو</li>
                  <li>إنشاء تطبيقات الويب والجوال</li>
                  <li>تصميم وإنتاج المحتوى الرقمي</li>
                  <li>خدمات الذكاء الاصطناعي والتعلم الآلي</li>
                  <li>استشارات تقنية</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">رؤيتنا</h2>
                <p className="text-gray-600 leading-relaxed">
                  نطمح لأن نكون روادًا في مجال التكنولوجيا والمحتوى الرقمي في العالم العربي، وأن نساهم في 
                  تطوير صناعة الألعاب والبرمجيات من خلال الابتكار المستمر وتقديم منتجات ذات جودة عالية.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-md mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">قيادة الفريق</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-primary mb-2">إسلام إبراهيم</h3>
                <p className="text-gray-600 mb-2">المؤسس والمدير التنفيذي</p>
                <p className="text-gray-600 leading-relaxed">
                  قائد فريق كاروت كو ومؤسس الشركة، يمتلك خبرة واسعة في مجال تطوير البرمجيات وإدارة المشاريع التقنية.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">تواصل معنا</h2>
            <p className="text-lg text-gray-600 mb-4">
              يمكنك زيارة موقعنا الرسمي أو التواصل معنا عبر وسائل التواصل الاجتماعي
            </p>
            <a 
              href="https://carrot-co.odoo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              الموقع الرسمي
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}