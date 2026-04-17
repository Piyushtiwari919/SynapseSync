import { useEffect, useState } from "react";
import { addUser } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Save,
  User,
  AlignLeft,
  Calendar,
  ChevronDown,
  ArrowLeft,
  X,
  CheckCircle,
} from "lucide-react";
import api from "../utils/axiosClient.js";

const EditProfile = () => {
  // --- LOGIC (UNTOUCHED) ---
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    about: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        about: user.about || "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUserRegister = async (e) => {
    try {
      e.preventDefault();
      if (!userData.firstName) {
        setError("FirstName is required");
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        return;
      } else if (!userData.age) {
        setError("Age is required");
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        return;
      } else if (!userData.gender) {
        setError("Gender is required");
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        return;
      }

      const formData = new FormData();
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("age", userData.age);
      formData.append("gender", userData.gender);
      formData.append("about", userData.about);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await api.post(
        `/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setError("");
      dispatch(addUser(response.data));
      setToast(true);
      setSuccessMessage("Profile Updated Successfully");
      setTimeout(() => setToast(false), 3000);
    } catch (error) {
      const finalErrorMsg = error?.response?.data.slice(6);
      setError(finalErrorMsg || "Something Went Wrong");
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      console.log(error);
    }
  };

  // --- DESIGN (SENIOR UPGRADE) ---
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 md:p-8 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl shadow-xl backdrop-blur-md">
              <X size={18} />{" "}
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          {successMessage && !error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl shadow-xl backdrop-blur-md">
              <CheckCircle size={18} />{" "}
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-[#121214]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Edit Profile</h1>
              <p className="text-xs text-zinc-500">
                Update your personal details
              </p>
            </div>
          </div>
          <button
            onClick={handleUserRegister}
            className="hidden md:flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-transform active:scale-95 cursor-pointer"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* --- LEFT: VISUAL IDENTITY (Avatar) --- */}
          <div className="md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center bg-white/1">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-linear-to-br from-cyan-500 to-purple-600 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#121214] bg-zinc-800">
                <img
                  src={
                    preview ||
                    user?.profileImageUrl ||
                    "https://placehold.co/150?text=User"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-all duration-300"
                />
                {/* Overlay Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera size={24} className="text-white drop-shadow-lg" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-1 drop-shadow-md">
                    Change
                  </span>
                </div>
              </div>

              {/* Hidden File Input Triggered by Label */}
              <label
                htmlFor="avatar"
                className="absolute inset-0 cursor-pointer rounded-full"
              ></label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleImage}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-white font-bold text-lg">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-zinc-500 text-sm">
                @{userData.firstName?.toLowerCase()}
              </p>
            </div>
          </div>

          {/* --- RIGHT: DATA FORM --- */}
          <div className="flex-1 p-6 md:p-10 space-y-6">
            {/* Names Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                  First Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-3.5 text-zinc-500"
                  />
                  <input
                    type="text"
                    name="firstName"
                    id="firstname"
                    value={userData.firstName}
                    onChange={handleInput}
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-700"
                    placeholder="First Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastname"
                  value={userData.lastName}
                  onChange={handleInput}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                  Age
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-3.5 text-zinc-500"
                  />
                  <input
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleInput}
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="24"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleInput}
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="" className="bg-zinc-900 text-zinc-500">
                      Select Gender
                    </option>
                    <option value="male" className="bg-zinc-900">
                      Male
                    </option>
                    <option value="female" className="bg-zinc-900">
                      Female
                    </option>
                    <option value="other" className="bg-zinc-900">
                      Other
                    </option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                About
              </label>
              <div className="relative">
                <AlignLeft
                  size={16}
                  className="absolute left-3 top-3.5 text-zinc-500"
                />
                <textarea
                  name="about"
                  value={userData.about}
                  onChange={handleInput}
                  rows={4}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
                  placeholder="Tell us a little about yourself..."
                />
              </div>
            </div>

            {/* Mobile Save Button (Visible only on small screens) */}
            <button
              onClick={handleUserRegister}
              className="w-full md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform hover:cursor-pointer"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
