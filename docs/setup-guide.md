
# دليل إعداد وتشغيل محرك بحث كاروت كو

## المتطلبات الأساسية

قبل البدء، تأكد من توفر:

- Node.js (v18 أو أحدث)
- npm (v9 أو أحدث)
- حساب Google Cloud للحصول على مفتاح Gemini AI

## خطوات الإعداد

1. استنساخ المشروع:
```bash
git clone https://github.com/your-username/carrot-search-engine.git
cd carrot-search-engine
```

2. تثبيت الاعتماديات:
```bash
npm install
```

3. إعداد المتغيرات البيئية:
- قم بإنشاء ملف `.env`
- أضف مفتاح Gemini AI:
```
GEMINI_API_KEY=your_api_key_here
```

4. تشغيل المشروع في وضع التطوير:
```bash
npm run dev
```

## اختبار المشروع

1. تأكد من عمل الخدمة الخلفية:
```bash
curl http://localhost:5000/api/health
```

2. افتح المتصفح على:
```
http://localhost:3000
```

## نشر المشروع

1. بناء نسخة الإنتاج:
```bash
npm run build
```

2. تشغيل نسخة الإنتاج:
```bash
npm run start
```

## إضافة مصادر بحث جديدة

1. أنشئ ملف جديد في مجلد `plugins`
2. قم بتنفيذ واجهة `SearchPlugin`
3. سجل الإضافة في `pluginManager`

## حل المشكلات الشائعة

- **مشكلة الاتصال بـ API**: تأكد من صحة مفتاح API
- **مشكلات CORS**: تأكد من إعداد origins المسموح بها
- **أخطاء TypeScript**: قم بتحديث الأنماط في مجلد `shared`
