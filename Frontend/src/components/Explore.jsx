import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeedUsers } from "../../store/exploreSlice.js";
import ExploreErrorState from "./ExploreErrorState.jsx";
import ExploreUserCard from "./ExploreUserCard.jsx";
import api from "../utils/axiosClient.js";

const Explore = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const feedUser = useSelector((store) => store.explore);

  const fetchPeople = async () => {
    try {
      const response = await api.get(
        `/explore`,
      );

      dispatch(addFeedUsers(response.data));
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  if (error) {
    return <ExploreErrorState onRetry={fetchPeople} isRetrying={isLoading} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin max-md:mt-23 mt-18"></div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          Finding people...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-400 mb-2">
          Explore People
        </h1>
        <p className="text-gray-400">Discover people who share your passion.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {feedUser.map((user) => {
          return <ExploreUserCard key={user._id} user={user} />;
        })}
      </div>
    </div>
  );
};

export default Explore;
