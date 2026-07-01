# Inkore

تطبيق React (Vite) جاهز للنشر على Vercel.

## ⚠️ ملاحظة معمارية مهمة قبل النشر للجمهور

هذا التطبيق **كامل من جهة العميل (client-side)** بالكامل: كل المنشورات والتعليقات
والتفاعلات والحظر تُخزَّن في `localStorage` الخاص بمتصفح كل زائر (`db.*` بأعلى
`src/App.jsx`). هذا يعني عملياً:

- **كل زائر يرى بياناته الخاصة فقط.** منشور يكتبه شخص من هاتفه لن يظهر لشخص
  آخر يفتح نفس الرابط من متصفح مختلف — لا يوجد خادم/قاعدة بيانات مشتركة.
- نظام الحظر (`banDevice`) ونظام حدّ المعدّل (`rate limiting`) يعتمدان على
  hash مشتق من الجهاز نفسه، ويمكن تجاوزهما بسهولة بمسح بيانات المتصفح.
- هذا مثالي لعرض تجريبي (demo)، نموذج أولي (prototype)، أو أداة شخصية على
  جهاز واحد — لكنه **غير مناسب كموقع تواصل عام متعدد المستخدمين** بصيغته
  الحالية.

إذا كان الهدف تطبيقاً حقيقياً يشارك فيه مستخدمون مختلفون نفس المنشورات، فالخطوة
التالية المنطقية هي استبدال طبقة `db` بخادم فعلي (مثال: Vercel + Postgres عبر
Supabase/Neon، أو Vercel KV) — يمكنني مساعدتك ببناء هذه الطبقة إن رغبت.

إن كان الاستخدام المقصود فردياً (يوميات شخصية، ملاحظات...) فلا حاجة لأي تعديل،
والتطبيق بصيغته الحالية جاهز تماماً.

## التشغيل محلياً

```bash
npm install
npm run dev
```

يفتح على `http://localhost:5173`.

## النشر على Vercel

### الطريقة الأولى — عبر GitHub (موصى بها)

1. ارفع هذا المجلد كمستودع جديد على GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <رابط-المستودع>
   git push -u origin main
   ```
2. من [vercel.com/new](https://vercel.com/new) اختر "Import Git Repository"
   وحدد هذا المستودع.
3. Vercel يكتشف إعدادات Vite تلقائياً (Build Command: `vite build`،
   Output Directory: `dist`) — لا حاجة لأي تعديل يدوي. اضغط **Deploy**.

### الطريقة الثانية — عبر Vercel CLI مباشرة

```bash
npm install -g vercel
vercel        # نشر تجريبي (preview)
vercel --prod # نشر نهائي (production)
```

## بنية المشروع

```
├── index.html          نقطة الدخول HTML (تتضمن meta viewport المطلوب)
├── vite.config.js       إعداد Vite + React
├── vercel.json           إعداد صريح لـ Vercel (framework/build/output)
├── package.json
└── src/
    ├── main.jsx          تركيب React (ReactDOM.createRoot)
    └── App.jsx            المكوّن الرئيسي (Inkore) — كل منطق التطبيق
```

## متغيرات البيئة

لا توجد. التطبيق لا يتصل بأي API خارجي حالياً.
