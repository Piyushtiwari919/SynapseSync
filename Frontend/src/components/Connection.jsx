import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../../store/connectionSlice.js";
import ConnectedUserCard from "./ConnectedUserCard.jsx";
import { Search, Users, Sparkles } from "lucide-react"; // Added Sparkles for 'human' touch
import EmptyState from "./EmptyConnectionState.jsx";
import ErrorState from "./ErrorState.jsx";
import ConnectionShimmerCard from "./ConnectionShimmerCard.jsx";
import api from "../utils/axiosClient.js";

const Connection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const getConnections = async () => {
    try {
      const response = await api.get(`/user/connections`,
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
      <div className="w-full min-h-[calc(100vh-4rem)] bg-[#09090b] p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-32 sm:w-48 bg-zinc-800/50 rounded-lg mb-6 sm:mb-8 animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <ConnectionShimmerCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredConnections = connections.filter((c) =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  // If we found only 1 person (either total or after search), we center them.
  // Otherwise, we use the grid.
  const isSingleItem = filteredConnections.length === 1;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900 via-[#0a0a0a] to-black text-zinc-100 p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl"></div>

            <h1 className="relative text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              My Network
              <span className="text-sm font-medium text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-900/50">
                {connections.length} Connections
              </span>
            </h1>
            <p className="relative text-zinc-400 mt-2 text-sm max-w-md leading-relaxed">
              Your professional circle. Keep interactions meaningful and stay
              updated with their latest activities.
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-zinc-900 rounded-xl flex items-center border border-zinc-800 focus-within:border-cyan-500/50 transition-colors">
              <Search className="ml-3 text-zinc-500" size={18} />
              <input
                type="text"
                id="search-input"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-3 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {connections.length === 0 || !connections ? (
          <div className="flex justify-center py-20">
            <EmptyState />
          </div>
        ) : filteredConnections.length > 0 ? (
          // If 'isSingleItem' is true -> use 'flex justify-center' (Centers the one card)
          // If 'isSingleItem' is false -> use 'grid' (Standard responsive layout)
          <div
            className={
              isSingleItem
                ? "flex justify-center w-full animate-in fade-in zoom-in duration-500"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
            }
          >
            {filteredConnections.map((connection) => (
              <div
                key={connection._id || connection.firstName}
                className="w-full flex justify-center"
              >
                <ConnectedUserCard user={connection} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-zinc-900/50 p-6 rounded-full border border-zinc-800/50 mb-4 shadow-inner">
              <Sparkles size={32} className="text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-white">No matches found</h3>
            <p className="text-zinc-500 mt-2">
              "{searchTerm}" isn't in your list. Try a different name?
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-medium hover:underline transition-all"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connection;
