import { AlertTriangle } from "lucide-react";
import { useDispatch } from "react-redux";
import { removePosts } from "../../store/postSlice.js";
import api from "../utils/axiosClient.js";

const DeletePost = ({ showDelete, setShowDelete, feed }) => {
  const dispatch = useDispatch();
  const handlePostDelete = async (e) => {

    try {
      e.preventDefault();
      const response = await api.delete(
        `/post/delete`,
        {
          data: {
            postId: feed?._id,
            userId: feed?.userId?._id,
          },
        },
      );
      setShowDelete(false);
      dispatch(removePosts(feed?._id));
    } catch (error) {
      console.log(error);
    }
  };

  if (!showDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full bg-red-600/80"></div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white leading-none">
                Delete Post?
              </h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                This action cannot be undone. This post will be permanently
                removed from your profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 justify-end">
            <button
              onClick={() => setShowDelete(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handlePostDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 transition-all active:scale-95 hover:cursor-pointer"
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
