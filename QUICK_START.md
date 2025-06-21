# البدء السريع ⚡

## للنشر على Vercel (الأسرع)

### 1. إعداد البريد الإلكتروني
```bash
# إنشاء App Password من Gmail:
# 1. Google Account → Security → 2-Step Verification
# 2. App passwords → Generate new password
# 3. انسخ كلمة المرور
```

### 2. رفع إلى GitHub
```bash
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 3. النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. Import من GitHub
3. أضف متغيرات البيئة:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   ```
4. Deploy!

---

## للتشغيل المحلي

### 1. تثبيت التبعيات
```bash
cd server
npm install
```

### 2. إعداد البيئة
```bash
# انسخ .env.example إلى .env
cp ../.env.example .env
# عدّل .env بإعداداتك
```

### 3. التشغيل
```bash
npm start
# اذهب إلى http://localhost:3000
```

---

## اختبار سريع

بعد النشر، اختبر:
- [ ] الصفحة الرئيسية
- [ ] نموذج التواصل
- [ ] رفع الملفات
- [ ] وصول البريد

## المساعدة
- 📖 اقرأ `README.md` للتفاصيل
- 🚀 اقرأ `DEPLOYMENT.md` للنشر
- 🐛 تحقق من Vercel Logs للأخطاء
