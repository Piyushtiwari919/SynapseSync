import axios from "axios";
import { UserCheck, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { removeRequest } from "../../store/requestSlice.js";
import { addProfileView } from "../../store/stateSlice.js";
import useProfileView from "../hooks/useProfileView.jsx";
import { Link, useNavigate } from "react-router-dom";

const UserRequestCard = ({ user }) => {
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMesssage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { firstName, profileImageUrl, about, _id } = user?.fromUserId || {};
  const handleOnAccept = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/request/review/accepted/${_id}`,
        {},
        { withCredentials: true }
      );
      setToastMesssage("Connection accepted Successfull");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);

      dispatch(removeRequest(_id));
    } catch (error) {
      setToastMesssage("Something Went Wrong");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.error(error);
    }
  };

  const handleOnReject = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/request/review/rejected/${_id}`,
        {},
        { withCredentials: true }
      );
      setToast(true);
      setToastMesssage("User Rejected Successfull");
      setTimeout(() => {
        setToast(false);
      }, 3000);
      dispatch(removeRequest(_id));
    } catch (error) {
      setToastMesssage("Something Went Wrong");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.error(error);
    }
  };

  const handleProfileView = async () => {
    try {
      const response = await useProfileView(_id);
      if (response && response?.data) {
        dispatch(addProfileView(response.data));
        navigate(`/profile/${_id}`);
      }
    } catch (error) {
      setToast(true);
      setToastMesssage("Something Went Wrong");
      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.error(error);
    }
  };
  return (
    <>
      {toast && (
        <div className="sm:mt-10 toast toast-top toast-center">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <Link to={`/profile/${user?._id}`}>
        <div
          className="relative group flex flex-col items-center w-[47%] md:w-64 bg-[#1e1e22] rounded-3xl p-4 border border-white/5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 hover:cursor-pointer"
          onClick={handleProfileView}
        >
          {/* Toast */}
          <div className="relative mb-3 mt-2">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

            <img
              src={profileImageUrl || "https://via.placeholder.com/150"}
              alt={firstName}
              className="relative h-20 w-20 md:h-24 md:w-24 object-cover rounded-full border-[3px] border-[#1e1e22] outline-2 outline-gray-700 group-hover:outline-cyan-500/50 transition-all duration-300"
            />
          </div>
          <div className="text-center w-full mb-4 grow flex flex-col justify-center">
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide truncate">
              {firstName || "Unknown"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 line-clamp-3 leading-relaxed h-10">
              {about || "Wants to join your network."}
            </p>
          </div>
          <div className="w-full flex items-center gap-2 mt-auto">
            <button
              onClick={handleOnReject}
              className="h-10 w-10 md:h-11 md:w-11 flex items-center justify-center rounded-full bg-[#2a2a30] text-gray-400 hover:bg-red-500/10 hover:text-red-500 hover:border hover:border-red-500/50 transition-all duration-200 active:scale-90 cursor-pointer"
              title="Ignore"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleOnAccept}
              className="flex-1 h-10 md:h-11 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all duration-200 active:scale-95 hover:shadow-cyan-500/25 cursor-pointer"
            >
              <UserCheck size={18} />
              <span>Accept</span>
            </button>
          </div>
        </div>
      </Link>
    </>
  );
};

export default UserRequestCard;
