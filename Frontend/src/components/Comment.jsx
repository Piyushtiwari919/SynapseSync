import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/axiosClient.js";
import { Send, Loader2, AlertCircle } from "lucide-react";

const Comment = ({ postId, onCommentPosted }) => {
  const user = useSelector((store) => store.user);
  const [commentInput, setCommentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePostComment = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on 'Enter' key press

    if (commentInput.trim() === "") return;

    try {
      setIsLoading(true);
      setError(""); // Clear any previous errors

      const response = await api.post(`/post/comment/${postId}`, {
        content: commentInput.trim(),
      });

      console.log(response);

      setCommentInput("");

      // Notify parent component to update the UI with the new comment
      if (onCommentPosted) {
        console.log("notified");
        onCommentPosted(response.data?.post);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      setError("Failed to post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-2 mb-4 animate-in fade-in duration-300">
      {/* Error Message Display */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs mb-2 ml-12 bg-red-500/10 w-fit px-2 py-1 rounded">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      <div className="flex items-start gap-3 w-full">
        {/* 1. USER AVATAR */}
        <div className="shrink-0 mt-0.5">
          <img
            src={user?.profileImageUrl || "https://placehold.co/100"}
            alt="Your profile"
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover border border-zinc-800 bg-zinc-900"
          />
        </div>

        {/* 2. COMMENT FORM */}
        <form
          onSubmit={handlePostComment}
          className="relative flex-1 flex items-center"
        >
          <input
            type="text"
            id="commentText"
            value={commentInput}
            onChange={(e) => {
              setCommentInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="Write a comment..."
            disabled={isLoading}
            autoComplete="off"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all focus:border-cyan-500 disabled:opacity-50 placeholder:text-zinc-500 shadow-inner"
          />

          <button
            type="submit"
            disabled={isLoading || !commentInput.trim()}
            className="absolute right-1.5 p-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-full transition-all flex items-center justify-center shadow-md active:scale-95"
            title="Post comment"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} className="ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comment;
