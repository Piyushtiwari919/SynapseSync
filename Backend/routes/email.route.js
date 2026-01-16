import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/email.controller.js";
import { userAuth } from "../middlewares/auth.js";

const emailRouter = Router();

emailRouter.post("/otp/send", userAuth, sendOtp);
emailRouter.post("/otp/verify", userAuth, verifyOtp);

export default emailRouter;
