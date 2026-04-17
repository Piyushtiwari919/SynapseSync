import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../../store/userSlice.js";
import { Mail, Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"; // Added icons for UX
import api from "../utils/axiosClient.js";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordVisibility = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/login`, { emailId, password });
      //console.log(res);
      dispatch(addUser(res?.data?.user));

      setError("");
      navigate("/feed");
    } catch (error) {
      setError(error?.response?.data || "Something went Wrong");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 text-zinc-400 hover:text-white flex items-center gap-2 transition-colors z-20"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <img
            src="/SS-logo.png"
            alt="Logo"
            className="h-10 w-10 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="space-y-2">
            <label
              htmlFor="email-input"
              className="text-sm font-medium text-zinc-300 ml-1"
            >
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  size={18}
                  className="text-zinc-500 group-focus-within:text-cyan-400 transition-colors"
                />
              </div>
              <input
                type="text"
                id="email-input"
                className="w-full bg-[#09090b] border border-zinc-800 text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block pl-10 p-3 placeholder:text-zinc-600 transition-all outline-none"
                placeholder="name@example.com"
                value={emailId}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label
                htmlFor="password-input"
                className="text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  size={18}
                  className="text-zinc-500 group-focus-within:text-cyan-400 transition-colors"
                />
              </div>
              <input
                type={isVisible ? "text" : "password"}
                id="password-input"
                className="w-full bg-[#09090b] border border-zinc-800 text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block pl-10 p-3 placeholder:text-zinc-600 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                required
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
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-linear-to-r cursor-pointer from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20 mt-2"
          >
            Sign In
          </button>
          <div className="text-center mt-4 text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors hover:underline"
            >
              Create one now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
