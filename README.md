# موقع المهندس جميل علقم الشخصي

موقع شخصي احترافي للمهندس جميل أحمد عبدالرحيم علقم، مهندس ميكانيكي ومدرب مع خبرة 18 سنة في إدارة المصانع والإنتاج.

## 🌟 المميزات

- **تصميم متجاوب** يعمل على جميع الأجهزة
- **دعم كامل للغة العربية** مع اتجاه RTL
- **نموذج تواصل متقدم** مع إمكانية رفع الملفات
- **معرض صور تفاعلي** للدورات والشهادات
- **أمان عالي** مع حماية من الهجمات
- **تحقق من صحة البيانات** شامل
- **معالجة أخطاء متقدمة**

## 🏗️ البنية التقنية

### الواجهة الأمامية (Frontend)

- **HTML5** مع دعم RTL
- **CSS3** مع تأثيرات حركية
- **JavaScript** للتفاعل
- **Font Awesome** للأيقونات
- **Google Fonts** للخطوط العربية

### الخادم (Backend)

- **Node.js** مع Express.js
- **Nodemailer** لإرسال البريد الإلكتروني
- **Multer** لرفع الملفات
- **Helmet** للأمان
- **Express Rate Limit** للحماية من الهجمات
- **Express Validator** للتحقق من البيانات

## 📁 هيكل المشروع

```
Personal/
├── public/                 # الواجهة الأمامية
│   ├── index.html         # الصفحة الرئيسية
│   ├── cv.html           # السيرة التدريبية
│   ├── services.html     # الخدمات والدورات
│   ├── certificates.html # الشهادات
│   ├── contact.html      # التواصل
│   ├── images/           # الصور
│   └── js/               # ملفات JavaScript
├── api/                   # Vercel Serverless Functions
│   └── send-email.js     # API لإرسال البريد
├── server/                # الخادم المحلي (للتطوير)
│   ├── server.js         # الملف الرئيسي للخادم
│   ├── package.json      # تبعيات Node.js
│   └── uploads/         # مجلد الملفات المرفوعة
├── package.json          # تبعيات المشروع الرئيسية
├── vercel.json          # تكوين Vercel
├── .env.example         # مثال لمتغيرات البيئة
├── .gitignore           # ملفات مستبعدة من Git
└── README.md            # هذا الملف
```

## 🚀 التشغيل

### المتطلبات

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn

### التشغيل المحلي

1. **تثبيت التبعيات:**

```bash
cd server
npm install
```

2. **إعداد متغيرات البيئة:**
   قم بتحديث ملف `.env` في مجلد `server`:

```env
# إعدادات البريد الإلكتروني
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# إعدادات معدل الرسائل (قابلة للتخصيص)
CONTACT_RATE_LIMIT=20          # عدد الرسائل المسموح بها
CONTACT_WINDOW_HOURS=1         # خلال كم ساعة

# إعدادات عامة
NODE_ENV=development           # أو production
```

3. **تشغيل الخادم:**

```bash
npm start
```

4. **فتح المتصفح:**
   انتقل إلى `http://localhost:3000`

### النشر على Vercel 🌐

المشروع جاهز للنشر على Vercel مع التكوين التلقائي:

1. **إنشاء حساب Vercel:**

   - انتقل إلى [vercel.com](https://vercel.com)
   - سجل دخول باستخدام GitHub

2. **ربط المشروع:**

   ```bash
   # تثبيت Vercel CLI (اختياري)
   npm i -g vercel

   # أو استخدم الواجهة الويب
   ```

3. **إعداد متغيرات البيئة في Vercel:**
   في لوحة تحكم Vercel، أضف المتغيرات التالية:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CONTACT_RATE_LIMIT=20
   CONTACT_WINDOW_HOURS=1
   NODE_ENV=production
   ```

4. **النشر:**
   - ادفع الكود إلى GitHub
   - Vercel سينشر تلقائياً
   - أو استخدم: `vercel --prod`

### مميزات النشر على Vercel:

- ✅ **Serverless Functions** للـ API
- ✅ **CDN عالمي** للملفات الثابتة
- ✅ **HTTPS تلقائي**
- ✅ **نشر تلقائي** من Git
- ✅ **معاينة للفروع**
- ✅ **مراقبة الأداء**

## 📧 إعداد البريد الإلكتروني

### Gmail

1. فعّل المصادقة الثنائية
2. أنشئ App Password
3. استخدم App Password في `.env`

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

## 🔒 الأمان

- **Helmet.js** للحماية من هجمات XSS و CSRF
- **Rate Limiting** لمنع الهجمات DDoS
- **تحقق من صحة البيانات** شامل
- **تشفير الملفات** المرفوعة
- **تنظيف البيانات** تلقائياً

### ⚙️ تخصيص معدل الرسائل

يمكنك تخصيص عدد الرسائل المسموح بها من خلال ملف `.env`:

```env
# أمثلة لإعدادات مختلفة:

# للاستخدام الشخصي (قليل الرسائل)
CONTACT_RATE_LIMIT=10
CONTACT_WINDOW_HOURS=1

# للاستخدام التجاري (متوسط الرسائل)
CONTACT_RATE_LIMIT=50
CONTACT_WINDOW_HOURS=1

# للمواقع عالية الحركة
CONTACT_RATE_LIMIT=100
CONTACT_WINDOW_HOURS=1

# أو توزيع على فترة أطول
CONTACT_RATE_LIMIT=200
CONTACT_WINDOW_HOURS=24
```

**ملاحظة:** في وضع التطوير (`NODE_ENV=development`)، لا يتم تطبيق حدود الرسائل على الطلبات المحلية.

## 📱 الصفحات

1. **الرئيسية** - نبذة عن المهندس جميل
2. **السيرة التدريبية** - الدورات المقدمة مع الصور
3. **الخدمات والدورات** - الخدمات المتاحة
4. **الشهادات** - الشهادات المهنية والعلمية
5. **التواصل** - نموذج تواصل مع رفع ملفات

## 🛠️ التطوير

### إضافة صفحة جديدة

1. أنشئ ملف HTML في مجلد `public`
2. أضف الروابط في شريط التنقل
3. أضف الأنماط المطلوبة

### تخصيص التصميم

- الألوان الرئيسية في متغيرات CSS
- الخطوط في بداية ملفات CSS
- الأيقونات من Font Awesome

## 📞 التواصل

- **الموقع:** http://localhost:3000
- **البريد الإلكتروني:** eng.jamil.w.o.s.2003@gmail.com
- **الواتساب:** +962796843499

## 📄 الترخيص

جميع الحقوق محفوظة © 2024 جميل علقم

---

تم تطوير هذا المشروع بواسطة الذكاء الاصطناعي لخدمة المهندس جميل علقم.
