import axios from "axios";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Image, Send, Loader2, X } from "lucide-react";

const CreatePostWidget = ({ onPostCreated }) => {
  const user = useSelector((store) => store.user);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearForm = () => {
    setDescription("");
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!description.trim() && !image) return;

    try {
      setIsPosting(true);
      const formData = new FormData();
      formData.append("description", description);
      if (image) formData.append("postImage", image);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      clearForm();
      if (onPostCreated) onPostCreated(); // Refresh feed after post
    } catch (error) {
      console.error("Post failed", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex gap-4">
        {/* Avatar */}
        <Link to={`/profile/${user?._id}`} className="shrink-0">
          <img
            src={user?.profileImageUrl || "https://placehold.co/100"}
            alt="Me"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-800 hover:ring-cyan-500/50 transition-all"
          />
        </Link>

        {/* Input Area */}
        <div className="flex-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-base resize-none focus:outline-none min-h-12.5 py-2"
            rows={preview ? 2 : 1}
          />

          {/* Image Preview (If selected) */}
          {preview && (
            <div className="relative mt-2 mb-4 rounded-xl overflow-hidden group">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-75 object-cover"
              />
              <button
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Actions Toolbar */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50">
            {/* Media Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-full transition-colors"
                title="Add Image"
              >
                <Image size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImage}
              />
            </div>

            {/* Post Button */}
            <button
              onClick={handlePost}
              disabled={isPosting || (!description.trim() && !image)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                isPosting || (!description.trim() && !image)
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
              }`}
            >
              {isPosting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostWidget;
