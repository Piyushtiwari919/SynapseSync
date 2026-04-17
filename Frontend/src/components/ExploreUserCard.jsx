import { UserPlus, Sparkles, Hourglass } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosClient.js";

const ExploreUserCard = ({ user }) => {
  const [requestState, setRequestState] = useState(false);
  const handleConnectClick = async () => {
    try {
      {
        /*Do new connection with user._id */
      }
      const response = await api.post(
        `/request/send/interested/${
          user._id
        }`,
        {},
      );
      // console.log(response);

      setRequestState(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Link to={`/profile/${user?._id}`}>
      <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-900/10 hover:-translate-y-1 flex flex-col h-full">
        <div className="h-24 w-full bg-linear-to-r from-cyan-900 via-gray-800 to-amber-900/50 opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div className="px-5 pb-6 flex flex-col items-center grow">
          <div className="relative -mt-12 mb-3">
            <div className="p-1 bg-gray-900 rounded-full">
              <img
                src={user.profileImageUrl || "https://via.placeholder.com/150"}
                alt={user.firstName}
                className="h-20 w-20 object-cover rounded-full border-2 border-gray-700 group-hover:border-cyan-500/50 transition-colors duration-300"
              />
            </div>
          </div>
          <div className="text-center w-full mb-4">
            <h2 className="text-xl font-bold text-gray-100 flex items-center justify-center gap-1">
              {user.firstName}
              <Sparkles size={14} className="text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 min-h-10">
              {user.about ||
                "Hey there! I'm using this app to connect with new people."}
            </p>
          </div>
          <div className="mt-auto w-full">
            {requestState ? (
              <button className="w-full py-2.5 px-4 bg-linear-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 group/btn cursor-pointer">
                <Hourglass
                  size={18}
                  className="group-hover/btn:rotate-12 transition-transform"
                />
                <span>Pending</span>
              </button>
            ) : (
              <button
                className="w-full py-2.5 px-4 bg-linear-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 group/btn cursor-pointer"
                disabled={requestState}
                onClick={handleConnectClick}
              >
                <UserPlus
                  size={18}
                  className="group-hover/btn:rotate-12 transition-transform"
                />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExploreUserCard;
