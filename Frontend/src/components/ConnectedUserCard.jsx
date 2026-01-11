import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProfileView } from "../../store/stateSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useProfileView from "../hooks/useProfileView.jsx";

const ConnectedUserCard = ({ user }) => {
  // const user = useSelector((store)=> store.user);
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { firstName, about, profileImageUrl, _id } = user;

  const handleProfileView = async () => {
    try {
      const response = await useProfileView(_id);
      if (response && response.data) {
          dispatch(addProfileView(response.data));
          navigate(`/profile/${_id}`);
      }
    } catch (error) {
      setToast(true);
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
          <div className="alert alert-success error">
            <span>Something Went Wrong</span>
          </div>
        </div>
      )}
      <div
        className="relative group flex flex-col items-center w-[47%] md:w-64 bg-[#1e1e22] rounded-3xl p-4 border border-white/5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 hover:cursor-pointer"
        onClick={handleProfileView}
      >
        {toast && (
          <div className="sm:mt-10 toast toast-top toast-center">
            <div className="alert alert-success error">
              <span>Something Went Wrong</span>
            </div>
          </div>
        )}
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
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed min-h-8">
            {about || "Connected with you"}
          </p>
        </div>
        <div className="max-h-2"></div>
      </div>
    </>
  );
};

export default ConnectedUserCard;
