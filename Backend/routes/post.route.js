import { Router } from "express";
import { requireVerification, userAuth } from "../middlewares/auth.js";
import {
  createPostContoller,
  updatePostContoller,
  getUserPosts,
  deletePost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.js";

const postRouter = Router();

postRouter.get("/post/:userId", userAuth, getUserPosts);

postRouter.post(
  "/post/create",
  userAuth,
  requireVerification,
  upload.single("postImage"),
  createPostContoller,
);

postRouter.patch("/post/update/like", userAuth, updatePostContoller.like);
postRouter.patch("/post/update/dislike", userAuth, updatePostContoller.dislike);
postRouter.delete("/post/delete", userAuth, deletePost);

export default postRouter;
