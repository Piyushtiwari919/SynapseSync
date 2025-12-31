import express from "express";
import { handleProfileView, handleProfileEdit } from "../controllers/profile.controller.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile/view",userAuth,handleProfileView);

router.get("/profile/edit",userAuth,handleProfileEdit);

export default router;