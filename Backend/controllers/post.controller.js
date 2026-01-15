import Post from "../models/post.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const updatePostContoller = {};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    console.log(userId);
    if (!userId) {
      throw new Error("UserId is required");
    }

    const userPosts = await Post.find({ userId: userId })
      .sort({ createdAt: -1 }) //Sorted by new posts first
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName profileImageUrl")
      .lean();

    return res.status(200).send(userPosts);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const createPostContoller = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { description } = req.body;
    console.log(description);

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

    console.log(userPost);

    return res.status(200).send("Post Created Successfully");
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

updatePostContoller.like = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { postId } = req.body;

    console.log(postId, loggedInUser);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: { userId: loggedInUser._id } },
      },
      { new: true, runValidators: true }
    );

    console.log(updatedPost);

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
    console.log(postId, loggedInUser);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: { userId: loggedInUser._id } },
      },
      { new: true }
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }
    return res.status(200).send(updatedPost);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

export { getUserPosts, createPostContoller, updatePostContoller };
