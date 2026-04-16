import { useEffect, useState } from "react";
import api from "../utils/axiosClient.js";
import { useSelector } from "react-redux";
import { Search, X, MessageSquareOff } from "lucide-react";

import ChatCard from "./ChatCard.jsx";
import ChatSkeleton from "./ChatSkeleton.jsx";
import ChatError from "./ChatError.jsx";

const Chat = () => {
  const [userChats, setUserChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("");

  const user = useSelector((store) => store.user);

  const filteredChats = userChats.filter((chat) => {
    // Instantly remove chats with no messages
    if (!chat.messages || chat.messages.length === 0) return false;

    // Find the target user in the participants array
    const targetUser = chat.participants?.find(
      (p) => p._id.toString() !== user?._id?.toString(),
    );

    if (!targetUser) return false;

    // Apply the search filter
    return targetUser.firstName?.toLowerCase().includes(userName.toLowerCase());
  });

  const getUserChats = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const response = await api.get("/chats");
      console.log(response);
      setUserChats(response.data || []);
    } catch (error) {
      setError(true);
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserChats();
  }, []);

  // --- UI RENDER ---

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <ChatError onRetry={getUserChats} />
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#09090b] flex justify-center w-full">
        <div className="w-full max-w-3xl px-4 py-6">
          <ChatSkeleton />
        </div>
      </div>
    );
  }

  // Main Interface
  return (
    <div className="min-h-dvh bg-[#09090b] flex flex-col items-center w-full">
      <div className="w-full max-w-3xl h-dvh sm:h-[90vh] sm:mt-6 sm:border border-zinc-800 sm:rounded-2xl shadow-2xl flex flex-col bg-[#18181b] overflow-hidden">
        <div className="px-4 py-5 border-b border-zinc-800 bg-[#18181b] z-10">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4 tracking-tight">
            Messages
          </h1>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-zinc-500 group-focus-within:text-cyan-500 transition-colors"
              />
            </div>

            <input
              type="text"
              className="w-full bg-[#09090b] border border-zinc-800 text-zinc-100 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-zinc-500"
              placeholder="Search conversations..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            {userName && (
              <button
                onClick={() => setUserName("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#09090b]/40">
          {filteredChats.length > 0 ? (
            <div className="flex flex-col">
              {filteredChats.map((chat) => (
                <ChatCard chat={chat} key={chat._id} />
              ))}
            </div>
          ) : (
            /* --- EMPTY STATE --- */
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 pt-10 pb-20">
              <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                <MessageSquareOff size={24} className="text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-zinc-300 mb-1">
                {userName ? "No matches found" : "No messages yet"}
              </h3>
              <p className="text-sm text-zinc-500 text-center max-w-62.5">
                {userName
                  ? `We couldn't find anyone named "${userName}".`
                  : "When you start a conversation, it will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
