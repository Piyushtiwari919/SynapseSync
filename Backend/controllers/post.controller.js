import Post from "../models/post.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const updatePostContoller = {};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params?.userId;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //console.log(userId);
    if (!userId) {
      throw new Error("UserId is required");
    }

    const userPosts = await Post.find({ userId: userId })
      .sort({ createdAt: -1 }) //Sorted by new posts first
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName profileImageUrl")
      .populate({
        path: "comments.authorId",
        select: "firstName lastName profileImageUrl _id isVerified",
      })
      .lean();

    return res.status(200).send(userPosts);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const editPostController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const postId = req.params?.postId;
    const { description } = req.body;
    const postDetails = await Post.findById({ _id: postId });
    if (postDetails?.userId?._id.toString() !== loggedInUser._id.toString()) {
      return res.status(403).send(`UnAuthorized Task`);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      { description: description },
    );

    return res.status(200).send(updatedPost);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const createPostContoller = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { description } = req.body;
    //console.log(description);

    if (!description) {
      throw new Error("Description is Required");
    }
    const postImageLocalPath = req?.file?.path;
    let postAvatar;
    if (postImageLocalPath) {
      postAvatar = await uploadOnCloudinary(postImageLocalPath);
    }

    const userPost = new Post({
      userId: loggedInUser._id,
      description: description,
      imageUrl: postAvatar?.url,
    });

    await userPost.save();

    //console.log(userPost);

    return res.status(200).json({ message: "Post Created Successfully" });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

updatePostContoller.like = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { postId } = req.body;

    // console.log(postId, loggedInUser);
    const isAlreadyLiked = await Post.exists({
      _id: postId,
      "likes.userId": loggedInUser._id,
    });

    if (isAlreadyLiked) {
      return res.status(200).send("You Liked the post");
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: { userId: loggedInUser._id } },
      },
      { new: true, runValidators: true },
    );

    // console.log(updatedPost);

    if (!updatedPost) {
      throw new Error("Post not found");
    }
    return res.status(200).send(updatedPost);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

updatePostContoller.dislike = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { postId } = req.body;
    //console.log(postId, loggedInUser);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: { userId: loggedInUser._id } },
      },
      { new: true },
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }
    return res.status(200).send(updatedPost);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

//Modify this to soft delete in future
//* await Post.findByIdAndUpdate(postId, { isDeleted: true });
const deletePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const loggedInUser = req.user;
    if (loggedInUser._id.toString() !== userId.toString()) {
      return res.status(403).send("UnAuthorized User");
    }
    await Post.findByIdAndDelete({ _id: postId });
    return res.status(200).json({ message: "Successfully deleted the post" });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const createComment = async (req, res) => {
  try {
    const user = req.user;
    const { content } = req.body;
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post id not provided");
    }
    if (!content || content.trim() === "") {
      throw new Error("Please type message");
    }

    const sanitizedComment = content.trim();

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("No post found with the post id");
    }

    post.comments.push({ content: sanitizedComment, authorId: user?._id });
    await post.populate({
      path: "comments.authorId",
      select: "firstName lastName profileImageUrl _id isVerified",
    });
    await post.save();

    return res.status(200).json({ message: "Comment Successfull", post: post });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req?.user?._id;
    if (!postId) {
      throw new Error("Post id not provided");
    }
    if (!commentId) {
      throw new Error("Comment id not provided");
    }
    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Comment text cannot be empty" });
    }

    const sanitizedComment = content.trim();

    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        comments: {
          $elemMatch: {
            _id: commentId,
            authorId: userId,
          },
        },
      },
      {
        $set: { "comments.$.content": sanitizedComment },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you do not have permission to edit it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
    });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const userId = req?.user?._id;

    if (!postId) {
      throw new Error("Post id not provided");
    }

    if (!commentId) {
      throw new Error("Comment id not provided");
    }

    const post = await Post.findOne({
      _id: postId,
      comments: {
        $elemMatch: {
          _id: commentId,
          authorId: userId,
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you do not have permission to delete it",
      });
    }

    const filteredComments = post.comments.filter((comment) => {
      return comment._id.toString() !== commentId.toString();
    });

    post.comments = filteredComments;
    await post.save();
    return res
      .status(200)
      .json({ message: "Comment deleted succesfully", updatedPost: post });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

export {
  getUserPosts,
  createPostContoller,
  editPostController,
  updatePostContoller,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
};
