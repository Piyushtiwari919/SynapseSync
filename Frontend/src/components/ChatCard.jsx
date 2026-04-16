import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatCard = ({ chat }) => {
  const user = useSelector((store) => store.user);

  if (!chat || !user || !chat.participants) return null;

  const targetUser = chat.participants.find(
    (p) => p._id.toString() !== user?._id.toString()
  );

  if (!targetUser) return null;

  const lastMessage =
    chat.messages?.length > 0 ? chat.messages[chat.messages.length - 1] : null;

  // Count unread messages
  const unseenCount =
    chat.messages?.filter(
      (msg) => !msg.seen && msg.senderId.toString() !== user._id.toString()
    ).length || 0;

  const formattedTime = lastMessage?.createdAt
    ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Link
      to={`/messages/${targetUser._id}`}
      className="group block w-full mb-2 bg-transparent hover:bg-[#18181b] border border-transparent hover:border-zinc-800/60 rounded-2xl p-3 sm:p-4 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={targetUser.profileImageUrl || "https://placehold.co/100"}
            alt={targetUser.firstName}
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border border-zinc-800 bg-zinc-900 group-hover:border-zinc-700 transition-colors"
          />
          {/* Online indicator dot could go here */}
        </div>

        <div className="flex-1 min-w-0">
          {/* Top Row: Name & Time */}
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 truncate pr-2">
              {targetUser.firstName} {targetUser.lastName || ""}
            </h3>
            {formattedTime && (
              <span
                className={`text-[11px] sm:text-xs shrink-0 ${unseenCount > 0 ? "text-cyan-400 font-bold" : "text-zinc-500"}`}
              >
                {formattedTime}
              </span>
            )}
          </div>

          {/* Bottom Row: Last Message & Badge */}
          <div className="flex justify-between items-center gap-3">
            <p
              className={`text-sm truncate ${unseenCount > 0 ? "text-zinc-200 font-semibold" : "text-zinc-400"}`}
            >
              {lastMessage?.senderId?.toString() === user?._id.toString() && (
                <span className="text-zinc-500 font-normal mr-1">You:</span>
              )}
              {lastMessage?.text || "Started a conversation"}
            </p>

            {/* UNREAD BADGE */}
            {unseenCount > 0 && (
              <div className="shrink-0 flex items-center justify-center min-w-5.5 h-5.5 px-1.5 bg-cyan-600 rounded-full shadow-lg shadow-cyan-900/40 animate-in zoom-in duration-300">
                <span className="text-[11px] font-bold text-white leading-none">
                  {unseenCount > 99 ? "99+" : unseenCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChatCard;
