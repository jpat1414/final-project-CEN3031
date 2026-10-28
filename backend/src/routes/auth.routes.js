const express = require("express");

const { authController } = require("../controllers");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get(
  "/me",
  authMiddleware.authenticateToken,
  authController.getCurrentUser
);

module.exports = router;