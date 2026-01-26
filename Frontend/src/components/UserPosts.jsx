import axios from "axios";
import { Grid, Loader2, PlusSquare, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addPosts } from "../../store/postSlice";
import FeedCard from "./FeedCard.jsx";
const UserPosts = ({ userId, isLoggedInUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((store) => store.posts);
  const getPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/post/${userId}`,
        { withCredentials: true },
      );
      //console.log(response);
      dispatch(addPosts(response.data));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader2 size={18} className="animate-spin" />
      </div>
    );
  }

  if (!posts) {
    return (
      <div>
        <p>
          <button onClick={getPosts}>
            <RotateCcw size={28} />
          </button>
        </p>
      </div>
    );
  }

  if (posts.length === 0 && isLoggedInUser) {
    return (
      <div className="min-h-50 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
        <Link
          to="/post/create"
          title="post"
          className="text-cyan-400 hover:text-cyan-300 transition-colors -mt-5"
        >
          <div className="bg-zinc-800 p-3 rounded-full border border-zinc-700 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <PlusSquare size={24} />
          </div>
        </Link>
        <h3 className="text-zinc-400 font-medium">No posts yet</h3>
        <p className="text-zinc-600 text-sm mt-1">
          Share your first moment with the world.
        </p>
      </div>
    );
  }

  if (posts.length === 0 && !isLoggedInUser) {
    return (
      <div className="min-h-50 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
        <h3 className="text-zinc-400 font-medium">No posts yet</h3>
        <p className="text-zinc-600 text-sm mt-1">
          User haven't posted anything yet.
        </p>
      </div>
    );
  }
  return (
    <div>
      {posts.map((post) => {
        return <FeedCard feed={post} key={post._id} isLoggedInUser={isLoggedInUser}/>;
      })}
    </div>
  );
};

export default UserPosts;
