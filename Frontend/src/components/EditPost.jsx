import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { addPosts } from "../../store/postSlice.js";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  const existingPost = useSelector((store) =>
    store.posts?.find((post) => post._id === postId),
  );

  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializePost = async () => {
      if (existingPost) {
        setDescription(existingPost.description || "");
        setIsLoading(false);
        return;
      }
      try {
        if (!user?._id) return;

        const userId = user?._id;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/post/${userId}`,
          { withCredentials: true },
        );

        dispatch(addPosts(response?.data));

        const foundPost = response.data.find((post) => post._id === postId);

        if (foundPost) {
          setDescription(foundPost.description || "");
        } else {
          navigate("/feed");
        }
      } catch (err) {
        console.error("Failed to fetch posts on refresh", err);
        navigate("/feed");
      } finally {
        setIsLoading(false);
      }
    };

    initializePost();
  }, [postId, existingPost, user?._id, dispatch, navigate]);

  const handleUpdate = async () => {
    if (!description.trim()) return;

    try {
      setIsSubmitting(true);

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/post/edit/${postId}`,
        { description },
        { withCredentials: true },
      );

      navigate(-1);
    } catch (err) {
      console.error(err);
      setError("Could not update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
            <div className="h-6 w-32 bg-zinc-800 rounded-md animate-pulse"></div>
            <div className="h-8 w-8 bg-zinc-800 rounded-full animate-pulse"></div>
          </div>
          <div className="p-6 space-y-6">
            <div className="w-full h-48 bg-zinc-800/50 rounded-xl animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg opacity-50"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-zinc-800 rounded-md mb-3 animate-pulse"></div>
              <div className="w-full h-32 bg-zinc-800/30 border border-zinc-800 rounded-xl animate-pulse"></div>
            </div>
          </div>
          <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end gap-3">
            <div className="h-10 w-20 bg-zinc-800 rounded-xl animate-pulse"></div>
            <div className="h-10 w-32 bg-zinc-800 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!existingPost && !isLoading) return null;

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
          <h2 className="text-xl font-bold text-white">Edit Post</h2>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-800 hover:cursor-pointer rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {existingPost?.imageUrl && (
            <div className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <img
                src={existingPost.imageUrl}
                alt="Post preview"
                className="w-full max-h-58 object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                <ImageIcon size={14} className="text-zinc-400" />
                <span className="text-xs text-zinc-300 font-medium">
                  Image cannot be changed
                </span>
              </div>
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium text-zinc-400 mb-2"
              htmlFor="description"
            >
              Caption / Description
            </label>
            <textarea
              value={description}
              id="description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-[#09090b] border border-zinc-700 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 resize-none leading-relaxed"
              placeholder="Write a caption..."
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl hover:cursor-pointer text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={isSubmitting || !description.trim()}
            className="flex items-center gap-2 hover:cursor-pointer px-6 py-2.5 rounded-xl text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-900/20 hover:shadow-cyan-600/30"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
