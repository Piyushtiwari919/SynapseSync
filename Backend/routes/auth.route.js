import express from "express";
import authController from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.js";
import { validateUpload } from "../middlewares/validateUpload.middleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  validateUpload,
  authController.register,
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/auth/refresh", authController.refreshUserToken);

export default router;
