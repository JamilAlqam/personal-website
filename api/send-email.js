const nodemailer = require("nodemailer");

// Rate limiting storage (في الذاكرة - للإنتاج يفضل استخدام Redis)
const rateLimitStore = new Map();

function checkRateLimit(ip, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  const requests = rateLimitStore.get(ip);
  // إزالة الطلبات القديمة
  const validRequests = requests.filter((time) => time > windowStart);

  if (validRequests.length >= limit) {
    return false;
  }

  validRequests.push(now);
  rateLimitStore.set(ip, validRequests);
  return true;
}

// دالة للتحقق من صحة البيانات
function validateInput(name, email, message) {
  const errors = [];

  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    errors.push("الاسم يجب أن يكون بين 2 و 100 حرف");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("يرجى إدخال بريد إلكتروني صحيح");
  }

  if (!message || message.trim().length < 10 || message.trim().length > 2000) {
    errors.push("الرسالة يجب أن تكون بين 10 و 2000 حرف");
  }

  return errors;
}

export default async function handler(req, res) {
  // السماح بـ CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // فحص معدل الطلبات
    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "unknown";

    if (!checkRateLimit(clientIP, 5, 60 * 60 * 1000)) {
      return res.status(429).json({
        message:
          "تم تجاوز الحد المسموح من الرسائل (5 رسائل/ساعة). يرجى المحاولة لاحقاً.",
      });
    }

    // التحقق من صحة البيانات
    const { name, email, subject, message } = req.body;

    const validationErrors = validateInput(name, email, message);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "بيانات غير صحيحة",
        errors: validationErrors,
      });
    }

    // التحقق من متغيرات البيئة
    if (
      !process.env.SMTP_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.error("Missing environment variables:", {
        SMTP_HOST: !!process.env.SMTP_HOST,
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        SMTP_PORT: process.env.SMTP_PORT,
      });
      return res.status(500).json({ message: "خطأ في إعدادات الخادم" });
    }

    // إعداد النقل
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // إعداد خيارات البريد
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `رسالة جديدة من ${name}: ${
        subject || "رسالة من موقع جميل علقم"
      }`,
      html: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>رسالة جديدة من الموقع</h2>
        <hr>
        <p><strong>اسم المرسل:</strong> ${name}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
        <p><strong>الموضوع:</strong> ${subject || "رسالة من موقع جميل علقم"}</p>
        <hr>
        <h3>نص الرسالة:</h3>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, "<br>")}
        </div>
      </div>
    `,
    };

    // إرسال البريد
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء إرسال الرسالة",
      error: error.message,
    });
  }
}
