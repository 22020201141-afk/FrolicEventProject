import express from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { listMyRegistrations } from "../controllers/registrationController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single('profilePhoto'), updateProfile);

// User registrations
router.get('/registrations', protect, listMyRegistrations);

export default router;