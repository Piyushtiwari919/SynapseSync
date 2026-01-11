import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../../store/connectionSlice.js";
import ConnectedUserCard from "./ConnectedUserCard.jsx";
import { Search } from "lucide-react";
import EmptyState from "./EmptyConnectionState.jsx";
import { useState } from "react";
import ErrorState from "./ErrorState.jsx";
import UserRequestSkeleton from "./UserRequestSkeleton.jsx";

const Connection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const getConnections = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/connections`,
        { withCredentials: true }
      );

      dispatch(addConnections(response?.data));
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (error) {
    return <ErrorState onRetry={getConnections} isConnection={true} />;
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-800 rounded-full mb-8 mx-auto md:mx-0 animate-pulse"></div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {/* Create an array of 4 items to map over */}
          {[...Array(4)].map((_, i) => (
            <UserRequestSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const filteredConnections = connections.filter((c) =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return connections.length === 0 || !connections ? (
    <EmptyState />
  ) : (
    <div className="min-h-dvh bg-neutral-700 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-50 tracking-tight">
              Connections
            </h1>
            <p className="text-gray-100 mt-1">
              You have {connections.length}{" "}
              {connections.length === 1 ? "friend" : "friends"} in your network
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-black"
            />
          </div>
        </div>

        {/* The Grid */}
        {filteredConnections.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {filteredConnections.map((connection) => (
              <ConnectedUserCard
                key={connection._id || connection.firstName}
                user={connection}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Result State */
          <div className="text-center py-20">
            <p className="text-gray-100">
              No connections found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-cyan-600 font-medium mt-2 hover:underline hover:cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connection;
