const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const { upsertBusinessConfig, getBusinessConfig } = require("../controllers/businessConfigController");

const router = express.Router();

router.post("/", authMiddleware, upsertBusinessConfig);
router.get("/", authMiddleware, getBusinessConfig);

module.exports = router;

