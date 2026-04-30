import { useSelector } from "react-redux";
import { Edit, MoreHorizontal, Trash2, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../utils/axiosClient.js";

const CommentCard = ({ comment, postId, authorId, onDeleteSuccess }) => {
  const user = useSelector((store) => store.user);
  
  // --- STATE ---
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState(comment?.content || "");
  
  // Display content state (allows optimistic UI updates without waiting for parent refetch)
  const [displayContent, setDisplayContent] = useState(comment?.content);
  const [isDeleted, setIsDeleted] = useState(false); // Instantly hides comment on delete

  // Action States
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // --- DERIVED BOOLEANS ---
  const isCommentAuthor = comment?.authorId?._id === user?._id;
  const isPostAuthor = authorId === comment?.authorId?._id;

  // --- HANDLERS ---
  const handleEditSave = async () => {
    if (!commentText || commentText.trim() === "") {
      setError("Comment cannot be empty.");
      return;
    }
    
    // If nothing changed, just cancel edit mode safely
    if (commentText.trim() === displayContent) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      
      await api.patch(`/post/comment/${postId}/${comment?._id}`, {
        content: commentText.trim(),
      });
      
      setDisplayContent(commentText.trim()); // Optimistic update
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update comment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setCommentText(displayContent); // Reset text to original
    setIsEditing(false);
    setError("");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError("");
      
      const res = await api.delete(`/post/comment/${postId}/${comment?._id}`);
      
      setIsDeleted(true); // Visually remove immediately

      if (onDeleteSuccess) onDeleteSuccess(comment?._id);
    } catch (err) {
      console.error(err);
      setError("Failed to delete comment.");
      setIsDeleting(false);
    }
  };

  // If deleted, don't render anything
  if (isDeleted) return null;

  return (
    <div className="group flex gap-3 sm:gap-4 mb-4 relative transition-opacity duration-300">
      
      {/* 1. AVATAR */}
      <div className="shrink-0 mt-1">
        <img
          src={comment?.authorId?.profileImageUrl || "https://placehold.co/100"}
          alt={comment?.authorId?.firstName}
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover border border-zinc-800 bg-zinc-900"
        />
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex-1 min-w-0">
        
        {/* Header: Name + Badges */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-zinc-100">
            {comment?.authorId?.firstName} {comment?.authorId?.lastName}
          </span>
          
          {/* Post Author Badge */}
          {isPostAuthor && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Author
            </span>
          )}
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs mb-2 bg-red-500/10 w-fit px-2 py-1 rounded">
            <AlertCircle size={12} />
            {error}
          </div>
        )}

        {/* Body: Edit Mode vs View Mode */}
        {!isEditing ? (
          <div className="relative">
            <p className="text-sm text-zinc-300 leading-relaxed wrap-break-word bg-zinc-800/30 px-3 py-2 rounded-2xl rounded-tl-sm border border-zinc-800/50 w-fit max-w-full">
              {displayContent}
            </p>
          </div>
        ) : (
          /* Edit Mode UI */
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-2 w-full max-w-lg mt-1 shadow-inner">
            <textarea
              autoFocus
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (error) setError(""); // Clear error on typing
              }}
              className="w-full bg-transparent text-sm text-zinc-100 focus:outline-none resize-none min-h-15"
              placeholder="Write a comment..."
            />
            <div className="flex items-center justify-end gap-2 mt-2 border-t border-zinc-800 pt-2">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSaving || !commentText.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. CONTEXT MENU (Only for comment author) */}
      {isCommentAuthor && !isEditing && (
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            disabled={isDeleting}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              showMenu
                ? "bg-zinc-800 text-white"
                : "text-zinc-200 hover:text-white hover:bg-zinc-800 group-hover:opacity-100 focus:opacity-100"
            }`}
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <MoreHorizontal size={16} />}
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              {/* Invisible Backdrop to close menu when clicking outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)} 
              />
              
              <div className="absolute right-0 top-8 w-40 bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left group"
                >
                  <Edit size={14} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                  <span>Edit</span>
                </button>

                <div className="h-px bg-zinc-800/50 mx-2"></div>
                
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left group"
                >
                  <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;