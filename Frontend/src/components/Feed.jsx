import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard.jsx";
import { Link, useNavigate } from "react-router-dom";
import { addFeed } from "../../store/feedSlice.js";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store)=> store.user);
  const feedForUser = useSelector((store) => store.feed.userPrefrencePosts);
  const moreFeed = useSelector((store) => store.feed.extraPosts);
  const getFeed = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed`, {
        withCredentials: true,
      });
      console.log(res);
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feedForUser) return;
  return (
    <div className="min-h-screen">
      {user && !user.isVerified && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Verify your email</p>
          <p>
            You can browse the feed, but you need to verify your email to post.
          </p>
          <div>
            {/* <Link to="/email/verify" className="text-red-500">Resend Link</Link> */}
          </div>
        </div>
      )}
      {feedForUser.length < 50 ? (
        <>
          {feedForUser.map((feed) => (
            <FeedCard feed={feed} />
          ))}
          {moreFeed.map((feed) => (
            <FeedCard feed={feed} />
          ))}
        </>
      ) : (
        feedForUser.map((feed) => <FeedCard feed={feed} />)
      )}
    </div>
  );
};

export default Feed;
