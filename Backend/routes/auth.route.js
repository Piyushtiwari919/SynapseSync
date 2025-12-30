import express from "express";
import authController from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
