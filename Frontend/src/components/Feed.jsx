import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Compass,
  TrendingUp,
  CheckCircle2,
  Mail,
  ArrowRight,
} from "lucide-react";

// Components
import FeedCard from "./FeedCard.jsx";
import FeedCardSkeleton from "./FeedCardSkeleton.jsx";
import CreatePostWidget from "./CreatePostWidget.jsx";
import { addFeed } from "../../store/feedSlice.js";

const Feed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Redux Data
  const user = useSelector((store) => store.user);
  const feedForUser = useSelector((store) => store.feed.userPrefrencePosts);
  const moreFeed = useSelector((store) => store.feed.extraPosts);

  // Fetch Logic
  const getFeed = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] pt-6 px-4">
        <div className="w-full max-w-xl mx-auto space-y-6">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <FeedCardSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-cyan-900/10 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="relative max-w-400 mx-auto flex justify-center">
        <div className="hidden lg:flex flex-col gap-6 fixed left-8 top-24 w-16 z-20">
          <Link to={`/profile`} className="block group relative">
            <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={user?.profileImageUrl || "https://placehold.co/100"}
              className="w-12 h-12 rounded-full border-2 border-zinc-800 group-hover:border-cyan-400 transition-all object-cover"
            />
          </Link>
          <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/5 rounded-full py-4 flex flex-col items-center gap-6 shadow-2xl">
            {user?.isVerified && (
              <Link className="cursor-pointer" to="/post/create" title="post">
                <button className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20 hover:cursor-pointer">
                  <Plus size={24} />
                </button>
              </Link>
            )}
            {!user?.isVerified && (
              <Link className="cursor-pointer" to="/verify/email" title="post">
                <button className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20 hover:cursor-pointer">
                  <Plus size={24} />
                </button>
              </Link>
            )}
            <div className="w-8 h-px bg-white/10"></div>
            <Link
              className="hover:cursor-pointer"
              to="/explore"
              title="explore"
            >
              <button className="text-zinc-400 hover:text-white transition-colors hover:cursor-pointer">
                <Compass size={24} />
              </button>
            </Link>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <TrendingUp size={24} />
            </button>
          </div>
        </div>
        <div className="w-full max-w-3xl px-4 pt-8 relative z-10">
          {user && !user.isVerified && (
            <div className="mb-10 bg-[#121214] border border-zinc-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex gap-4 items-center">
                <div className="shrink-0 opacity-50 grayscale">
                  <img
                    src={user?.profileImageUrl || "https://placehold.co/100"}
                    alt="Me"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-800"
                  />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col justify-center h-10">
                    <p className="text-zinc-500 text-sm font-medium">
                      Verify your email to start sharing your thoughts...
                    </p>
                  </div>

                  <Link
                    to="/verify/email"
                    className="group shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 hover:border-zinc-600 px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Mail
                      size={16}
                      className="text-cyan-500 group-hover:scale-110 transition-transform"
                    />
                    <span>Verify Account</span>
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-800">
                <div className="w-1/3 h-full bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>
          )}

          {user?.isVerified && (
            <div className="mb-12 transform hover:scale-[1.01] transition-transform duration-300">
              <CreatePostWidget onPostCreated={getFeed} />
            </div>
          )}
          <div className="space-y-12">
            <div>
              {feedForUser?.length < 50 ? (
                <>
                  {feedForUser?.map((feed) => (
                    <FeedCard
                      feed={feed}
                      key={feed._id}
                      isProfilePost={false}
                    />
                  ))}
                  {moreFeed?.map((feed) => (
                    <FeedCard
                      feed={feed}
                      key={feed._id}
                      isProfilePost={false}
                    />
                  ))}
                </>
              ) : (
                feedForUser?.map((feed) => (
                  <FeedCard feed={feed} key={feed._id} isProfilePost={false} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
