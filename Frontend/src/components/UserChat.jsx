import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getSocketConnection, disconnectSocket } from "../utils/socket.js";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axiosClient.js";

import {
  Send,
  ArrowDown,
  AlertCircle,
  WifiOff,
  Loader2,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { getStatus } from "../utils/chat.utils.js";

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [logoutModal, setLogoutModal] = useState({ show: false, countdown: 5 });
  const [participants, setParticipants] = useState([]);

  const [toast, setToast] = useState({
    isActive: false,
    message: "",
    type: "info",
  });

  const navigate = useNavigate();
  const { targetUserId } = useParams();

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // Safe extraction of profile data
  const targetProfile = participants.filter((participant) => {
    return participant._id.toString() !== userId.toString();
  });

  const messagesEndRef = useRef(null);

  // --- HELPERS ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showToast = (message, type = "info") => {
    setToast({ isActive: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isActive: false }));
    }, 3000);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- LIFECYCLE & LOGIC ---
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim().length === 0) {
      showToast("Please enter a message.", "error");
      return;
    }

    const socket = getSocketConnection();
    socket.emit("sendMessage", {
      userName: user?.firstName,
      userId: userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const updateMessages = async () => {
    try {
      const res = await api.patch(`/chats/update/${targetUserId}`, {});
      //console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(false);

      if (!targetUserId) throw new Error("No target user ID");

      // Fetch Profile & Messages in parallel for better performance
      const [chatData] = await Promise.all([api.get(`/chat/${targetUserId}`)]);
      console.log(chatData);
      if (chatData?.data) setMessages(chatData.data.messages);
      if (chatData?.data) setParticipants(chatData.data.participants);
    } catch (err) {
      console.error(err);
      setError(true);
      showToast("Failed to load chat data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // COUNTDOWN TIMER EFFECT
  useEffect(() => {
    let timer;
    if (logoutModal.show && logoutModal.countdown > 0) {
      timer = setTimeout(() => {
        setLogoutModal((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    } else if (logoutModal.show && logoutModal.countdown === 0) {
      // Time is up, redirect automatically
      navigate("/login");
    }
    return () => clearTimeout(timer); // Cleanup on unmount or re-render
  }, [logoutModal.show, logoutModal.countdown, navigate]);

  const handleCancelRedirect = () => {
    setLogoutModal({ show: false, countdown: 5 });
    showToast(
      "Auto-redirect cancelled. Please log in to send messages.",
      "error",
    );
  };

  useEffect(() => {
    fetchData();

    updateMessages();

    let interval = setInterval(() => {
      const status = getStatus(targetUserId);
      setUserStatus(status?.data?.userStatus);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    const socket = getSocketConnection();

    socket.emit("joinChat", { targetUserId });

    socket.on("receivedMessage", ({ messages }) => {
      setMessages(messages);
    });

    socket.on("connect_error", async (err) => {
      console.log("Connection Failed:", err.message);

      if (err.message === "Authentication error: Invalid or expired token") {
        try {
          await api.post("/auth/refresh");
          socket.connect();
          showToast("Connection restored.", "success");
        } catch (refreshError) {
          showToast("Session expired. Please log in again.", "error");
          disconnectSocket();
          setError(true); // Disable the chat input

          // Trigger the Modal instead of immediate redirect
          setLogoutModal({ show: true, countdown: 5 });
        }
      } else {
        showToast("Chat disconnected. Trying to reconnect...", "error");
      }
    });

    return () => {
      socket.off("connect_error");
      socket.off("receivedMessage");
    };
  }, [userId, targetUserId, navigate]);

  // --- UI RENDER ---
  return (
    <div className="flex items-center justify-center min-h-dvh bg-[#09090b] sm:p-4 font-sans relative">
      {/* --- SESSION EXPIRED MODAL --- */}
      {logoutModal.show && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              {/* Alert Icon */}
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} />
              </div>

              <h3 className="text-xl font-bold text-zinc-100 mb-2">
                Session Expired
              </h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Your secure token has expired. You will be redirected to the
                login page in{" "}
                <span className="font-bold text-cyan-400 text-base">
                  {logoutModal.countdown}
                </span>{" "}
                seconds.
              </p>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancelRedirect}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/20"
                >
                  Log In Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TOAST NOTIFICATION */}
      {toast.isActive && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-md ${
              toast.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-zinc-800/90 border-zinc-700 text-zinc-100"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle2 size={16} className="text-cyan-500" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* CHAT CONTAINER */}
      <div className="flex flex-col w-full h-dvh sm:h-[85vh] sm:max-w-3xl bg-[#18181b] sm:border border-zinc-800 sm:rounded-2xl shadow-2xl overflow-hidden relative">
        {/* HEADER */}
        <header className="px-4 py-3 border-b border-zinc-800 bg-[#18181b] z-10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="sm:hidden p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <Link
              to={`/profile/${targetUserId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={
                  targetProfile[0]?.profileImageUrl ||
                  "https://placehold.co/100"
                }
                alt="Profile"
                className="rounded-full w-10 h-10 object-cover border border-zinc-700 bg-zinc-800"
              />
              <div>
                <h2 className="text-base font-bold text-zinc-100 tracking-tight leading-none mb-1">
                  {targetProfile[0]?.firstName || "Loading..."}
                </h2>
                <div className="flex items-center gap-1.5">
                  {!userStatus?.isOnline ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
                        OFFLINE
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
                        ONLINE
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* MESSAGE AREA */}
        <div className="relative flex-1 flex flex-col overflow-hidden bg-[#09090b]/40">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                <WifiOff size={40} className="text-red-500/50" />
                <p className="text-sm">Failed to load chat data.</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-3">
                  <Send size={24} className="text-zinc-500 ml-1" />
                </div>
                <p className="text-sm font-medium">
                  Say hello to {targetProfile?.firstName}!
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isMe =
                  message.senderId._id.toString() === userId?.toString();

                return (
                  <div
                    key={message._id}
                    className={`flex flex-col gap-1 w-full ${isMe ? "items-end" : "items-start"}`}
                  >
                    {/* Name & Time */}
                    <div
                      className={`flex items-baseline gap-2 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <span className="text-xs font-semibold text-zinc-400">
                        {isMe ? "You" : message?.senderId?.firstName}
                      </span>
                      <time className="text-[10px] font-medium text-zinc-600">
                        {formatTime(message.createdAt)}
                      </time>
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`w-fit max-w-[85%] sm:max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-cyan-600 text-white rounded-2xl rounded-tr-sm"
                          : "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })
            )}
            {/* Invisible anchor to scroll to */}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Floating Scroll-to-Bottom Button */}
          {!isLoading && !error && messages.length > 0 && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 p-2.5 bg-zinc-800/90 backdrop-blur-sm hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full shadow-lg transition-all z-20"
              title="Scroll to latest"
            >
              <ArrowDown size={18} className="text-cyan-500" />
            </button>
          )}
        </div>

        {/* FOOTER / INPUT */}
        <footer className="p-3 sm:p-4 bg-[#18181b] border-t border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              id="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target?.value)}
              placeholder="Type a message..."
              disabled={error || isLoading}
              autoComplete="off"
              className="w-full bg-zinc-900 text-zinc-100 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all border border-zinc-800 focus:border-cyan-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={error || isLoading || !newMessage.trim()}
              className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-full transition-all flex items-center justify-center shadow-md active:scale-95"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default UserChat;
