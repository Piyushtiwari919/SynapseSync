import axios from "axios";
import { useState } from "react";
import { addUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Calendar,
  FileText,
  Camera,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react"; // Icons for human-friendly design

const Register = () => {
  // --- 1. LOGIC SECTION (UNTOUCHED) ---
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "",
    about: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlePasswordVisibility = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    // console.log(e.target.files);
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUserRegister = async (e) => {
    try {
      e.preventDefault();
      if (
        !userData.firstName ||
        !userData.emailId ||
        !userData.age ||
        !userData.password ||
        !userData.gender
      ) {
        setError("All fields are Required");
        setToast(true);
        setTimeout(() => {
          setToast(false);
        }, 3000);
        return;
      }
      const formData = new FormData();
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("emailId", userData.emailId);
      formData.append("password", userData.password);
      formData.append("age", userData.age);
      formData.append("gender", userData.gender);
      formData.append("about", userData.about);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      // *Debugging (Your logic preserved)
      // console.log("--- FORM DATA CONTENTS ---");
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      // console.log("--------------------------");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data));
      setError("");
      navigate("/feed");
    } catch (error) {
      const finalErrorMsg = error?.response?.data.slice(6);
      setError(finalErrorMsg || "Something Went Wrong");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.log(error);
    }
  };

  // --- 2. DESIGN SECTION (SENIOR UPGRADE) ---
  return (
    <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Back Link */}
      <Link
        to="/login"
        className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors z-20 flex items-center gap-2"
      >
        <ArrowLeft size={20} />{" "}
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      <div className="w-full max-w-4xl bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row">
        {/* --- LEFT SIDE: THE PITCH (Hidden on mobile) --- */}
        <div className="hidden md:flex flex-col justify-between w-1/3 bg-zinc-900/50 p-8 border-r border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Join SynapseSync
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Create your identity.
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Join a community where real connections happen. Customize your
              profile to show the world who you truly are.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-cyan-500">
                <User size={16} />
              </div>
              <span>Build your network</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-purple-500">
                <FileText size={16} />
              </div>
              <span>Share your thoughts</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <div className="flex-1 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-6 md:hidden">
            Create Account
          </h2>

          <form encType="multipart/form-data" className="space-y-5">
            {/* 1. AVATAR UPLOAD (Centerpiece) */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full p-1 bg-linear-to-tr from-cyan-500 to-purple-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 relative">
                    <img
                      src={
                        preview ||
                        "https://placehold.co/150/18181b/ffffff?text=Avatar"
                      }
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                {/* The clickable trigger */}
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  title="Upload Photo"
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 2. NAMES ROW (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold text-zinc-400 ml-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={userData.firstName}
                  onChange={handleInput}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-600"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold text-zinc-400 ml-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={userData.lastName}
                  onChange={handleInput}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-600"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* 3. EMAIL & PASSWORD */}
            <div className="space-y-1">
              <label
                className="text-xs font-semibold text-zinc-400 ml-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3.5 text-zinc-500"
                  size={18}
                />
                <input
                  type="text"
                  id="email"
                  name="emailId"
                  value={userData.emailId}
                  onChange={handleInput}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-zinc-500"
                  size={18}
                />
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleInput}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl pl-10 pr-12 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={handlePasswordVisibility}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* 4. AGE & GENDER ROW (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 ml-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleInput}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                  placeholder="24"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 ml-1">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleInput}
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                  >
                    <option value="" className="bg-zinc-900">
                      Select...
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. ABOUT */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 ml-1">
                About (Bio)
              </label>
              <textarea
                name="about"
                value={userData.about}
                onChange={handleInput}
                rows="3"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all resize-none"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            {/* 6. ERROR & ACTION */}
            {toast && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleUserRegister}
              className="w-full bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Complete Registration <ArrowRight size={18} />
            </button>

            <p className="text-center text-zinc-500 text-sm mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
