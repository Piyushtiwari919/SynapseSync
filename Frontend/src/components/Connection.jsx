import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../../store/connectionSlice.js";
import ConnectedUserCard from "./ConnectedUserCard.jsx";
import EmptyState from "./EmptyState.jsx";
import { useState } from "react";
import ErrorState from "./ErrorState.jsx";

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
    return <ErrorState onRetry={getConnections} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          Finding your people...
        </p>
      </div>
    );
  }

  const filteredConnections = connections.filter((c) =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return connections.length === 0 || !connections ? (
    <EmptyState />
  ) : (
    <div className="min-h-dvh bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Connections
            </h1>
            <p className="text-gray-500 mt-1">
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* The Grid */}
        {filteredConnections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <p className="text-gray-500">
              No connections found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-cyan-600 font-medium mt-2 hover:underline"
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
