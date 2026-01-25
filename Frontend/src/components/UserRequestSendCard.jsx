import axios from "axios";
import { UserMinus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeRequestSend } from "../../store/requestSlice";
import { useState } from "react";

const UserRequestSendCard = ({ user }) => {
  const dispatch = useDispatch();

  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMesssage] = useState("");

  const { firstName, lastName, about, profileImageUrl, _id } =
    user?.toUserId || {};

  const handleRequestWithdraw = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/request/withdraw/${_id}`,
        {},
        { withCredentials: true },
      );
      setToastMesssage("Request Withdrawn");
      setToast(true);
      setTimeout(() => {
        setToast(false);
        setToastMesssage("");
      }, 3000);
      dispatch(removeRequestSend(_id));
    } catch (error) {
      setToastMesssage("Something Went Wrong");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.error(error);
    }
  };

  if (!_id) return null;

  return (
    <>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-md ${
              toastMessage.includes("Wrong")
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-zinc-800/90 border-zinc-700 text-zinc-100"
            }`}
          >
            {toastMessage.includes("Wrong") ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="w-full sm:w-65 bg-[#18181b] hover:bg-[#202024] border border-zinc-800 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative">
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/80 border border-zinc-700/50 rounded-full text-[10px] font-medium text-zinc-400">
            <Clock size={12} className="animate-pulse text-zinc-500" />
            <span>Pending</span>
          </div>
        </div>

        <Link to={`/profile/${_id}`} className="relative mt-2">
          <div className="absolute inset-0 bg-zinc-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

          <img
            src={profileImageUrl || "https://placehold.co/200"}
            alt={firstName}
            className="relative w-20 h-20 rounded-full object-cover border-4 border-[#18181b] group-hover:border-zinc-700 transition-colors z-10"
          />
        </Link>

        <div className="text-center w-full mb-1">
          <Link to={`/profile/${_id}`} className="block">
            <h2 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors truncate px-1">
              {firstName} {lastName}
            </h2>
          </Link>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2 min-h-[2.5em] px-1">
            {about || "No bio available"}
          </p>
        </div>

        <div className="w-full mt-auto">
          <button
            onClick={handleRequestWithdraw}
            className="w-full py-2.5 rounded-full border border-zinc-700 text-zinc-400 font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 group/btn"
          >
            <UserMinus
              size={16}
              className="group-hover/btn:scale-110 transition-transform"
            />
            <span>Withdraw</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserRequestSendCard;
