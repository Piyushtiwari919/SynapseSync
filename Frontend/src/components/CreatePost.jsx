import axios from "axios";
import { useState, useRef } from "react";
import { Image as ImageIcon, X, Send, Loader2, Smile } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const user = useSelector((store) => store.user); 
  const fileInputRef = useRef(null); 
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [success, setSuccess] = useState(false); 

  const handleImage = (e) => {
    const postImageFile = e.target.files[0];
    if (postImageFile) {
      setPostImage(postImageFile);
      setPreview(URL.createObjectURL(postImageFile));
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e) => {
    setDescription(e.target?.value);
    if (error) setError("");
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Please write something before posting.");
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("description", description);
      if (postImage) {
        formData.append("postImage", postImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setError("Post created successfully!");
      setToast(true);

      setDescription("");
      removeImage();

      setTimeout(() => {
        setToast(false);
        setSuccess(false);
        navigate("/feed");
      }, 3000);
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create post"
      );
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <div>
      <div className="flex justify-center items-center">
        <Loader2 size={24} />
        <p>Posting...</p>
      </div>
    </div>;
  }

  if (!user?.isVerified) {
    navigate("/verify/email");
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4">
      {/* Toast Notification (Floating) */}
      {toast && (
        <div className="fixed top-20 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div
            className={`px-4 py-2 rounded-full shadow-xl border backdrop-blur-md flex items-center gap-2 ${
              success
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Create Post</h2>
          <div className="text-xs text-zinc-500 font-medium px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
            Draft
          </div>
        </div>

        <div className="p-4 md:p-6">
          <form className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0">
                <img
                  src={user?.profileImageUrl || "https://placehold.co/100"}
                  alt="Me"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-800"
                />
              </div>

              <div className="flex-1">
                <textarea
                  value={description}
                  onChange={handleInputChange}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent border-none text-lg text-white placeholder-zinc-500 focus:ring-0 resize-none min-h-30 p-1 leading-relaxed"
                />
              </div>
            </div>

            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-black group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-100 object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-full transition-colors flex items-center gap-2 group"
                  title="Add Image"
                >
                  <ImageIcon size={20} />
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-cyan-400 hidden sm:block">
                    Photo
                  </span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImage}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <Smile size={20} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handlePost}
                disabled={isLoading || !description.trim()}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                  isLoading || !description.trim()
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <span>Post</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
