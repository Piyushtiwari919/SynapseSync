import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard.jsx";
import { useNavigate } from "react-router-dom";
import { addFeed } from "../../store/feedSlice.js";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedForUser = useSelector((store) => store.feed.userPrefrencePosts);
  const moreFeed = useSelector((store) => store.feed.extraPosts);
  const getFeed = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed`, {
        withCredentials: true,
      });
      console.log(res);
      dispatch(addFeed( res?.data));
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };
  
  useEffect(() => {
    getFeed();
  }, []);
  
  if(!feedForUser) return;
  return (
    <div className="min-h-lvh">
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
