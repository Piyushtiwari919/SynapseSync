import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleImageVisibility } from "../../store/stateSlice.js";
import { Activity } from "react";
import { Edit3, ShieldCheck, MapPin, Grid, Users } from "lucide-react";

import UserPosts from "./UserPosts.jsx";
import UserNetwork from "./UserNetwork.jsx";
import ProfileImage from "./ProfileImage.jsx";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const user = useSelector((store) => store.user);
  const profileImageVisibility = useSelector(
    (store) => store.state.imageVisibility
  );
  const dispatch = useDispatch();

  const stats = [
    { label: "Connections", value: "400" },
    { label: "Posts", value: "10" },
  ];

  if (!user) return;

  const handleImageVisibility = () => {
    dispatch(toggleImageVisibility());
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/30">
      <Activity mode={profileImageVisibility ? "visible" : "hidden"}>
        {/* 1. Backdrop: Deep dark overlay with blur for focus */}
        <ProfileImage
          user={user}
          handleImageVisibility={handleImageVisibility}
        />
      </Activity>
      <div className="max-w-5xl mx-auto pb-20">
        {/* --- Cover Image Area --- */}
        <div className="relative w-full h-48 md:h-72 lg:h-80 group overflow-hidden md:rounded-b-3xl">
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1767153434535-89b4a3db366d?q=80&w=1171&auto=format&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* --- Profile Header Info --- */}
        <div className="px-4 md:px-8">
          <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-6 gap-6 z-20">
            {/* Avatar with Ring */}
            <div className="relative group shrink-0">
              {/* Glowing effect behind avatar */}
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

              <img
                src={user.profileImageUrl}
                onClick={handleImageVisibility}
                alt={user.firstName}
                className="relative h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-[#09090b] shadow-2xl cursor-zoom-in hover:brightness-110 transition-all"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 border-4 border-[#09090b] rounded-full"></div>
            </div>

            {/* Name & Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full gap-4 mt-2 md:mt-0 md:mb-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  {user.firstName}
                  {user.isVerified && (
                    <ShieldCheck
                      size={24}
                      className="text-cyan-400"
                      fill="currentColor"
                      fillOpacity={0.2}
                    />
                  )}
                </h1>
                {/* Future Use */}
                <p className="text-zinc-400 font-medium mt-1 flex items-center gap-2">
                  <span className="text-zinc-500">@username</span> •
                  <span className="text-zinc-400">Software Engineer</span>
                </p>
                {/* */}
              </div>

              {/* Edit Button */}
              <Link
                to="/profile/edit"
                className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-full transition-all active:scale-95"
              >
                <Edit3
                  size={16}
                  className="text-zinc-300 group-hover:text-white"
                />
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
                  Edit Profile
                </span>
              </Link>
            </div>
          </div>

          {/* --- Bio Section --- */}
          <div className="max-w-2xl mb-10">
            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {user.about ||
                "Digital explorer and coffee enthusiast. Creating things that live on the internet."}
            </p>

            {/* Future Use */}
            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                <span>Joined March 2024</span>
              </div>
            </div>
            {/* */}
          </div>

          <div className="w-full border-y border-zinc-800 py-6 mb-8">
            <div className="grid grid-cols-2 divide-x divide-zinc-800">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`text-center md:text-left px-4 md:px-6 first:pl-0`}
                >
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 border-b border-zinc-800 mb-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 pb-4 border-b-2 font-medium cursor-pointer transition-colors ${
                activeTab === "posts"
                  ? "border-cyan-500 text-cyan-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Grid size={18} />
              <span>Posts</span>
            </button>
            <button
              onClick={() => setActiveTab("network")}
              className={`flex items-center gap-2 pb-4 border-b-2 font-medium cursor-pointer transition-colors ${
                activeTab === "network"
                  ? "border-cyan-500 text-cyan-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Users size={18} />
              <span>Network</span>
            </button>
          </div>
          <div className="min-h-75">
            {activeTab === "posts" ? <UserPosts /> : <UserNetwork />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
