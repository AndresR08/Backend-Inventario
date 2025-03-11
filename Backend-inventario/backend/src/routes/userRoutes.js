const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController"); 

const { authMiddleware } = require("../middlewares/auth");
const { adminMiddleware } = require("../middlewares/auth");


const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createUser);
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
