module.exports = async function handler(req, res) {
  // السماح بـ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    return res.status(200).json({ 
      message: "API يعمل بشكل صحيح!",
      method: req.method,
      timestamp: new Date().toISOString(),
      body: req.body
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "خطأ في الخادم",
      error: error.message 
    });
  }
};
