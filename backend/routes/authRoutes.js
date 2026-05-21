const express = require("express");
const router = express.Router();
const { login, me } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Rate limit: max 10 login attempts per IP per 15 minutes (S3 security fix)
let loginLimiter;
try {
  const rateLimit = require("express-rate-limit");
  loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: "बहुत अधिक प्रयास। 15 मिनट बाद दोबारा कोशिश करें।" },
    standardHeaders: true,
    legacyHeaders: false,
  });
} catch {
  // express-rate-limit not installed, skip silently in dev
  loginLimiter = (req, res, next) => next();
}

router.post("/login", loginLimiter, login);
router.get("/me", auth, me);

module.exports = router;
