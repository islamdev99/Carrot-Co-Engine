
# توثيق واجهة برمجة التطبيقات (API)

## نقاط النهاية (Endpoints)

### 1. البحث
```
GET /api/search
```

**المعلمات:**
- `q`: نص البحث (مطلوب)
- `limit`: عدد النتائج (اختياري، الافتراضي: 10)

**مثال الاستجابة:**
```json
{
  "results": [
    {
      "title": "عنوان النتيجة",
      "url": "الرابط",
      "snippet": "مقتطف من النتيجة"
    }
  ],
  "summary": "ملخص النتائج"
}
```

### 2. التلخيص
```
POST /api/summarize
```

**المعلمات:**
- `text`: النص المراد تلخيصه (مطلوب)

**مثال الاستجابة:**
```json
{
  "summary": "الملخص الناتج"
}
```

## كيفية الاستخدام

```typescript
// مثال على استخدام API البحث
const search = async (query: string) => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return response.json();
};

// مثال على استخدام API التلخيص
const summarize = async (text: string) => {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  return response.json();
};
```
