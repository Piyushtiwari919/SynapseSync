import { Router } from "express";
import { requireVerification, userAuth } from "../middlewares/auth.js";
import {
  createPostContoller,
  updatePostContoller,
  getUserPosts
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.js";

const postRouter = Router();

postRouter.get("/post/:userId",userAuth,requireVerification, getUserPosts);

postRouter.post(
  "/post/create",
  userAuth,
  upload.single("postImage"),
  createPostContoller
);

//   requireVerification,

postRouter.patch("/post/update/like", userAuth, updatePostContoller.like);
postRouter.patch("/post/update/dislike", userAuth, updatePostContoller.dislike);

export default postRouter;
