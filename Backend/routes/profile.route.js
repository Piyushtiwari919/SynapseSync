import express from "express";
import { handleProfileView, handleProfileEdit } from "../controllers/profile.controller.js";
import { userAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/profile/view",userAuth,handleProfileView);

router.post("/profile/edit",userAuth,upload.single("avatar"),handleProfileEdit);

export default router;