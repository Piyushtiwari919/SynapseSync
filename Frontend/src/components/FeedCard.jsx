import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  Send,
  Edit,
  BadgeX,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DeletePost from "./DeletePost.jsx";
import api from "../utils/axiosClient.js";
import Comment from "./Comment.jsx";
import CommentCard from "./CommentCard.jsx";
import { useEffect } from "react";
import { addComments, removeComment } from "../../store/commentSlice.js";
import VerifyToComment from "./VerifyToComment.jsx";

const FeedCard = ({ feed, isLoggedInUser }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(4);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const postComments = useSelector((store) => store.comments);

  const [liked, setLiked] = useState(
    feed?.likes?.some((like) => like.userId === user?._id) || false,
  );
  const [likeCount, setLikeCount] = useState(feed?.likes?.length || 0);

  const toggleLike = async () => {
    const previousState = liked;
    const previousCount = likeCount;

    setLiked(!previousState);
    setLikeCount(previousState ? previousCount - 1 : previousCount + 1);

    try {
      const endpoint = previousState
        ? "/post/update/dislike"
        : "/post/update/like";
      await api.patch(`${endpoint}`, { postId: feed?._id });
    } catch (error) {
      setLiked(previousState);
      setLikeCount(previousCount);
      console.error("Like failed:", error);
    }
  };

  const toggleCommentVisibility = () => {
    setShowComment(!showComment);
    dispatch(addComments(feed?.comments));
  };

  const onCommentPosted = (data) => {
    dispatch(addComments(data.comments));
  };

  const onDeleteSuccess = (commentId) => {
    dispatch(dispatch(removeComment(commentId)));
  };

  useEffect(() => {
    if (!showComment) {
      setVisibleCommentsCount(4);
    }
  }, [showComment]);

  return (
    <div className="w-full relative bg-[#121214] border border-zinc-800 rounded-2xl mb-6 shadow-lg transition-all hover:border-zinc-700 group flex flex-col">
      {showDelete && (
        <DeletePost
          setShowDelete={setShowDelete}
          showDelete={showDelete}
          feed={feed}
        />
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 relative z-10">
        {!isLoggedInUser && feed?.userId?._id !== user?._id ? (
          <div className="flex items-center gap-3">
            <Link
              to={`/profile/${feed?.userId?._id}`}
              className="relative cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 ring-2 ring-transparent group-hover:ring-cyan-500/50 transition-all overflow-hidden">
                <img
                  src={
                    feed?.userId?.profileImageUrl || "https://placehold.co/100"
                  }
                  alt={feed?.userId?.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/profile/${feed?.userId?._id}`}
                className="text-sm font-bold text-zinc-100 hover:text-cyan-400 transition-colors"
              >
                {feed?.userId?.firstName} {feed?.userId?.lastName}
              </Link>
              <span className="text-xs text-zinc-500 font-medium">
                {feed?.createdAt
                  ? new Date(feed.createdAt).toDateString()
                  : "Just now"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to={`/profile`} className="relative cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-zinc-800 ring-2 ring-transparent group-hover:ring-cyan-500/50 transition-all overflow-hidden">
                <img
                  src={
                    feed?.userId?.profileImageUrl || "https://placehold.co/100"
                  }
                  alt={feed?.userId?.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/profile`}
                className="text-sm font-bold text-zinc-100 hover:text-cyan-400 transition-colors"
              >
                {feed?.userId?.firstName} {feed?.userId?.lastName}
              </Link>
              <span className="text-xs text-zinc-500 font-medium">
                {feed?.createdAt
                  ? new Date(feed.createdAt).toDateString()
                  : "Just now"}
              </span>
            </div>
          </div>
        )}

        {isLoggedInUser && (
          <div className="relative">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full transition-all duration-200 hover:cursor-pointer ${
                showInfo
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <MoreHorizontal size={20} />
            </button>
            {showInfo && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setShowInfo(false);
                    setShowDelete(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left group hover:cursor-pointer"
                    onClick={() => navigate(`/edit/post/${feed?._id}`)}
                  >
                    <Edit
                      size={16}
                      className="text-zinc-500 group-hover:text-cyan-400 transition-colors"
                    />
                    <span>Edit Post</span>
                  </button>
                  <div className="h-px bg-zinc-800/50 mx-2"></div>
                  <button
                    className="w-full flex items-center gap-3 px-4 hover:cursor-pointer py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    onClick={() => setShowDelete(!showDelete)}
                  >
                    <BadgeX size={16} />
                    <span>Delete Post</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* POST CONTENT */}
      {feed.description && (
        <div className="px-4 pb-3">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {feed.description}
          </p>
        </div>
      )}
      {feed.imageUrl && (
        <div className="w-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={feed?.imageUrl}
            alt="Post content"
            className="w-full h-auto max-h-150 object-contain"
          />
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 group/like">
              <button
                onClick={toggleLike}
                title="like"
                className={`p-2 rounded-full transition-all active:scale-90 hover:cursor-pointer ${
                  liked
                    ? "text-red-500 bg-red-500/10"
                    : "text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                }`}
              >
                <Heart
                  size={22}
                  fill={liked ? "currentColor" : "none"}
                  className={liked ? "animate-pulse" : ""}
                />
              </button>
              {likeCount > 0 && (
                <span
                  className={`text-sm font-medium ${liked ? "text-red-400" : "text-zinc-500 group-hover/like:text-zinc-300"}`}
                >
                  {likeCount}
                </span>
              )}
            </div>

            <button
              className={`flex items-center gap-2 transition-colors group/comment hover:cursor-pointer ${showComment ? "text-cyan-400" : "text-zinc-400 hover:text-cyan-400"}`}
              onClick={toggleCommentVisibility}
              title="comment"
            >
              <div
                className={`p-2 rounded-full transition-colors ${showComment ? "bg-cyan-500/10" : "group-hover/comment:bg-cyan-500/10"}`}
              >
                <MessageCircle
                  size={22}
                  className={showComment ? "fill-cyan-500/20" : ""}
                />
              </div>
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors group/share hover:cursor-pointer">
              <div className="p-2 rounded-full group-hover/share:bg-green-500/10 transition-colors">
                <Send size={22} />
              </div>
            </button>
          </div>

          <button className="text-zinc-400 hover:text-yellow-400 transition-colors p-2 hover:bg-yellow-400/10 rounded-full">
            <Bookmark size={22} />
          </button>
        </div>

        {likeCount > 0 && (
          <div className="mt-2 px-1 text-xs text-zinc-500 font-medium">
            Liked by <span className="text-zinc-300">{likeCount} people</span>
          </div>
        )}

        {showComment && (
          <div className="mt-4 pt-4 border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-300 relative z-0">
            {user?.isVerified ? (
              <Comment postId={feed._id} onCommentPosted={onCommentPosted} />
            ) : (
              <VerifyToComment />
            )}

            <div className="mt-6 flex flex-col space-y-1">
              {postComments?.length > 0 ? (
                <>
                  {/* 1. SLICE THE ARRAY: Only render up to visibleCommentsCount */}
                  {postComments &&
                    postComments
                      .slice(0, visibleCommentsCount)
                      .map((comment) => (
                        <CommentCard
                          key={comment._id}
                          comment={comment}
                          postId={feed._id}
                          authorId={feed?.userId?._id}
                          onDeleteSuccess={onDeleteSuccess}
                        />
                      ))}

                  {visibleCommentsCount < postComments?.length && (
                    <button
                      onClick={() =>
                        setVisibleCommentsCount((prev) => prev + 4)
                      }
                      className="mt-2 py-2 text-sm font-semibold text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:cursor-pointer rounded-lg transition-colors flex items-center justify-center w-full"
                    >
                      View {postComments?.length - visibleCommentsCount} more
                      comments
                    </button>
                  )}
                </>
              ) : (
                /* EMPTY STATE */
                <div className="text-center py-6 pb-4">
                  <p className="text-sm text-zinc-500">No comments yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedCard;
