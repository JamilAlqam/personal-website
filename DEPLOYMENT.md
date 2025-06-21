# دليل النشر على Vercel 🚀

## خطوات النشر السريع

### 1. التحضير
```bash
# تأكد من وجود جميع الملفات المطلوبة
ls -la
# يجب أن ترى:
# - package.json
# - vercel.json
# - api/send-email.js
# - public/
# - .env.example
```

### 2. إنشاء حساب Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. اربط حسابك

### 3. رفع المشروع إلى GitHub
```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 4. ربط المشروع بـ Vercel
1. في لوحة تحكم Vercel، اضغط "New Project"
2. اختر المستودع من GitHub
3. Vercel سيكتشف التكوين تلقائياً

### 5. إعداد متغيرات البيئة
في إعدادات المشروع في Vercel، أضف:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_RATE_LIMIT=20
CONTACT_WINDOW_HOURS=1
NODE_ENV=production
```

### 6. النشر
اضغط "Deploy" - سيتم النشر تلقائياً!

## إعداد البريد الإلكتروني

### Gmail App Password
1. اذهب إلى [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (فعّل إذا لم يكن مفعلاً)
3. App passwords → Generate new password
4. اختر "Mail" و "Other"
5. انسخ كلمة المرور المُنشأة
6. استخدمها في `EMAIL_PASS`

## اختبار النشر

بعد النشر، اختبر:
1. ✅ الصفحة الرئيسية تعمل
2. ✅ جميع الصفحات تُحمّل
3. ✅ نموذج التواصل يعمل
4. ✅ رفع الملفات يعمل
5. ✅ وصول البريد الإلكتروني

## استكشاف الأخطاء

### خطأ في إرسال البريد
- تحقق من متغيرات البيئة
- تأكد من App Password صحيح
- تحقق من إعدادات Gmail

### خطأ في رفع الملفات
- تحقق من أحجام الملفات (< 10MB)
- تأكد من أنواع الملفات مدعومة

### خطأ 500
- تحقق من Logs في Vercel
- تأكد من جميع التبعيات مثبتة

## الدعم
للمساعدة، تحقق من:
- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
