# إعداد النشر على Vercel - خطوة بخطوة 🚀

## ✅ المشروع جاهز للنشر!

تم تهيئة جميع الملفات المطلوبة:
- ✅ `package.json` - تبعيات المشروع
- ✅ `vercel.json` - تكوين Vercel
- ✅ `api/send-email.js` - Serverless Function
- ✅ `.env.example` - مثال متغيرات البيئة
- ✅ `.gitignore` - ملفات مستبعدة

## 🔧 خطوات النشر

### 1. إعداد البريد الإلكتروني (Gmail)

**إنشاء App Password:**
1. اذهب إلى [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (فعّل إذا لم يكن مفعلاً)
3. App passwords → Generate new password
4. اختر "Mail" و "Other (Custom name)"
5. اكتب "Vercel Website"
6. انسخ كلمة المرور المُنشأة (16 رقم)

### 2. رفع المشروع إلى GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"

# إنشاء repository جديد على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. النشر على Vercel

**الطريقة الأولى - الواجهة الويب:**
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. اضغط "New Project"
4. اختر المستودع من GitHub
5. Vercel سيكتشف التكوين تلقائياً
6. اضغط "Deploy"

**الطريقة الثانية - CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. إعداد متغيرات البيئة

في لوحة تحكم Vercel:
1. اذهب إلى Project Settings
2. Environment Variables
3. أضف المتغيرات التالية:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
CONTACT_RATE_LIMIT=20
CONTACT_WINDOW_HOURS=1
NODE_ENV=production
```

### 5. إعادة النشر

بعد إضافة متغيرات البيئة:
1. اذهب إلى Deployments
2. اضغط على آخر deployment
3. اضغط "Redeploy"

## 🧪 اختبار النشر

بعد النشر، اختبر:
- [ ] الصفحة الرئيسية تعمل
- [ ] جميع الصفحات تُحمّل
- [ ] نموذج التواصل يعمل
- [ ] رفع الملفات يعمل
- [ ] وصول البريد الإلكتروني

## 🔍 استكشاف الأخطاء

### خطأ في إرسال البريد
- تحقق من App Password
- تأكد من تفعيل 2-Step Verification
- تحقق من متغيرات البيئة في Vercel

### خطأ 500 في API
- تحقق من Vercel Function Logs
- تأكد من جميع التبعيات في package.json

### خطأ في رفع الملفات
- تحقق من أحجام الملفات (< 10MB)
- تأكد من أنواع الملفات مدعومة

## 📞 الدعم

- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎉 تهانينا!

موقعك الآن جاهز للعالم! 🌍
