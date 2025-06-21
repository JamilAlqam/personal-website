const nodemailer = require("nodemailer");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

// إعداد multer للذاكرة (Vercel لا يدعم تخزين الملفات على القرص)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB حد أقصى لكل ملف
    files: 5, // حد أقصى 5 ملفات
  },
  fileFilter: function (req, file, cb) {
    // السماح بأنواع ملفات محددة فقط
    const allowedTypes = /jpeg|jpg|png|gif|pdf|xlsx|doc|docx|txt/;
    const extname = allowedTypes.test(
      file.originalname.split(".").pop().toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "نوع الملف غير مسموح. الأنواع المسموحة: JPEG, JPG, PNG, xlsx, GIF, PDF, DOC, DOCX, TXT"
        )
      );
    }
  },
});

// قواعد التحقق من صحة البيانات
const validateContactForm = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("الاسم يجب أن يكون بين 2 و 100 حرف")
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .withMessage("الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("يرجى إدخال بريد إلكتروني صحيح")
    .normalizeEmail(),

  body("subject")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("الموضوع يجب ألا يتجاوز 200 حرف"),

  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("الرسالة يجب أن تكون بين 10 و 2000 حرف"),
];

// Rate limiting storage (في الذاكرة - للإنتاج يفضل استخدام Redis)
const rateLimitStore = new Map();

function checkRateLimit(ip, limit = 20, windowMs = 60 * 60 * 1000) {
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

// دالة مساعدة لتشغيل middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
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
    const contactRateLimit = parseInt(process.env.CONTACT_RATE_LIMIT) || 20;
    const contactWindowHours = parseInt(process.env.CONTACT_WINDOW_HOURS) || 1;

    if (
      !checkRateLimit(
        clientIP,
        contactRateLimit,
        contactWindowHours * 60 * 60 * 1000
      )
    ) {
      return res.status(429).json({
        message: `تم تجاوز الحد المسموح من الرسائل (${contactRateLimit} رسالة/${
          contactWindowHours === 1 ? "ساعة" : contactWindowHours + " ساعات"
        }). يرجى المحاولة لاحقاً.`,
      });
    }

    // تشغيل multer
    await runMiddleware(req, res, upload.array("attachments", 5));

    // تشغيل التحقق من صحة البيانات
    for (const validation of validateContactForm) {
      await runMiddleware(req, res, validation);
    }

    // فحص أخطاء التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "بيانات غير صحيحة",
        errors: errors.array().map((err) => err.msg),
      });
    }

    // التحقق من صحة البيانات
    const { name, email, subject, message } = req.body;

    // إعداد النقل
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // إعداد المرفقات
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
        });
      });
    }

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
        ${
          attachments.length > 0
            ? `
        <hr>
        <h3>المرفقات:</h3>
        <ul>
          ${attachments.map((att) => `<li>${att.filename}</li>`).join("")}
        </ul>
        `
            : ""
        }
      </div>
    `,
      attachments: attachments,
    };

    // إرسال البريد
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    console.error("Error sending email:", error);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "حجم الملف كبير جداً. الحد الأقصى 10MB" });
      }
      if (error.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .json({ message: "عدد الملفات كبير جداً. الحد الأقصى 5 ملفات" });
      }
    }

    if (error.message && error.message.includes("نوع الملف غير مسموح")) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "حدث خطأ أثناء إرسال الرسالة" });
  }
}
