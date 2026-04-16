import { userAuth } from "../middlewares/auth.js";
import { Router } from "express";
import {
  getUserStatus,
  statusController,
} from "../controllers/status.controller.js";
const statusRouter = Router();

statusRouter.get("/status/:targetUserId", userAuth, getUserStatus);

statusRouter.patch("/status/update/online", userAuth, statusController.online);

statusRouter.patch(
  "/status/update/offline",
  userAuth,
  statusController.offline,
);

export default statusRouter;
