import { useDispatch, useSelector } from "react-redux";
import {
  addConnections,
  removeConnections,
  addProfileView,
  toggleImageVisibility,
} from "../../store/stateSlice.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity, useEffect, useState } from "react";
import useProfileView from "../hooks/useProfileView.jsx";
import UserPosts from "./UserPosts.jsx";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  UserPlus,
  MessageCircle,
  UserRoundCheck,
  X,
  Link as LinkIcon,
  Hourglass,
} from "lucide-react";
import { removeRequestRecieved } from "../../store/requestSlice.js";
import api from "../utils/axiosClient.js";
import ProfileImage from "./ProfileImage.jsx";

const ViewProfile = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMesssage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  const profileImageVisibility = useSelector(
    (store) => store.state.imageVisibility,
  );

  const loggedInUser = useSelector((store) => store.user);

  useEffect(() => {
    if (userId === loggedInUser?._id) {
      navigate("/profile");
    }
  }, []);

  const connectedUsers = useSelector((store) => store.connections);
  const requestRecieved = useSelector(
    (store) => store.requests?.requestsRecieved,
  );
  const requestSend = useSelector((store) => store.requets?.requestsSend);
  // console.log(requestRecieved);

  const handleImageVisibility = () => {
    dispatch(toggleImageVisibility());
  };

  const user = useSelector((store) => store.state?.visitedProfileValue);
  const connections = useSelector(
    (store) => store.state?.visitedProfileConnections,
  );

  const posts = useSelector((store) => store.posts);

  const isAlreadyConnected = connectedUsers?.some(
    (connection) => connection?._id === user?._id,
  );

  const isAlreadyRequestSend = requestSend?.some(
    (request) => request?.toUserId?._id === user._id,
  );

  const isRequestRecieved = requestRecieved?.some(
    (request) => request?.fromUserId?._id === user._id,
  );

  const handleConnectionAccept = async () => {
    try {
      const response = await api.post(
        `/request/review/accepted/${user?._id}`,
        {},
      );

      dispatch(removeRequestRecieved(_id));
      setToastMesssage("Connection accepted Successfull");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
    } catch (error) {
      setToastMesssage("Something Went Wrong");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.error(error);
    }
  };

  const handleRequestSend = async () => {
    try {
      const response = await api.post(`/request/send/interested/${userId}`, {});
      setToastMesssage("Connection Request Send");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
    } catch (error) {
      setToastMesssage("Something Went Wrong");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.error(error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await useProfileView(userId);
      const userConnections = await api.get(`/user/connections/${userId}`);
      //console.log(response);
      //console.log(userConnections);
      dispatch(addConnections(userConnections?.data));
      // addConnections()
      if (response && response.data) {
        dispatch(addProfileView(response?.data));
        setError(false);
      }
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();

    return () => {
      dispatch(removeConnections());
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-20 h-20 bg-zinc-800 rounded-full"></div>
          <div className="w-32 h-4 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center py-20 text-white">Profile not found.</div>
    );
  return (
    <>
      {toast && (
        <div className="sm:mt-10 toast toast-top toast-center">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <Activity mode={profileImageVisibility ? "visible" : "hidden"}>
        <ProfileImage
          user={user}
          handleImageVisibility={handleImageVisibility}
        />
      </Activity>

      <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans pb-20 overflow-x-hidden relative">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-purple-900/20 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-cyan-900/20 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="relative w-full h-87.5 lg:h-100 group">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#09090b]/20 to-[#09090b] z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1767153434535-89b4a3db366d?q=80&w=1171&auto=format&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 -mt-32">
          <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="relative shrink-0 -mt-16 md:-mt-20 mx-auto md:mx-0">
                <div className="group relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-cyan-500 to-purple-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img
                    src={user?.profileImageUrl}
                    onClick={handleImageVisibility}
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-[6px] border-[#121214] shadow-xl cursor-pointer transition-transform hover:scale-[1.02]"
                    alt="User"
                  />
                  {user?.isVerified && (
                    <div
                      className="absolute bottom-1 right-1 bg-black text-cyan-400 p-1.5 rounded-full border-4 border-[#121214]"
                      title="Verified Human"
                    >
                      <ShieldCheck
                        size={18}
                        fill="currentColor"
                        fillOpacity={0.2}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-zinc-400 font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
                      <span>@{user?.firstName?.toLowerCase()}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <span className="text-zinc-500">
                        {user?.role || "Member"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {!isAlreadyConnected &&
                    !isRequestRecieved &&
                    !isAlreadyRequestSend ? (
                      <button
                        onClick={handleRequestSend}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95 hover:cursor-pointer"
                      >
                        <UserPlus size={18} />
                        <span>Connect</span>
                      </button>
                    ) : (
                      ""
                    )}
                    {isRequestRecieved ? (
                      <button
                        onClick={handleConnectionAccept}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95 hover:cursor-pointer"
                      >
                        <UserRoundCheck size={18} />
                        <span>Accept</span>
                      </button>
                    ) : (
                      ""
                    )}
                    {isAlreadyRequestSend && (
                      <>
                        <Hourglass size={18} />
                        <span>Pending</span>
                      </>
                    )}
                    <Link to={`/messages/${user?._id}`}>
                      <button className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-700">
                        <MessageCircle size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="mt-6 max-w-2xl">
                  <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                    {user?.about ||
                      "👋 Hey there! I'm new to Synapse. Looking forward to connecting with amazing people."}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-white/5">
                    {user?.location && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                        <MapPin size={14} className="text-cyan-500" />{" "}
                        {user.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                      <Calendar size={14} className="text-purple-500" /> Joined
                      recently
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 max-w-xs md:max-w-sm mt-8 bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
              <Link to="">
                <div className="p-4 text-center hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="text-2xl font-bold text-white">
                    {connections?.length}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                    Connections
                  </div>
                </div>
              </Link>
              <div className="p-4 text-center border-l border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="text-2xl font-bold text-white">
                  {posts?.length}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                  Posts
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Posts
                <span className="text-xs font-normal text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">
                  {posts?.length}
                </span>
              </h2>
              <div className="text-sm text-zinc-500 flex gap-4">
                <span className="text-white font-medium cursor-pointer">
                  Latest
                </span>
              </div>
            </div>
            <UserPosts isLoggedInUser={false} userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProfile;
