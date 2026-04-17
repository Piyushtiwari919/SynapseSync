import { useState, useEffect } from "react";
import {
  Mail,
  ShieldCheck,
  Loader2,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import AlreadyVerified from "./AlreadyVerified.jsx";
import api from "../utils/axiosClient.js";

const EmailVerify = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [timer, setTimer] = useState(0);
  const user = useSelector((store) => store.user);
  const canResend = timer === 0;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  const handleSendOtp = async () => {
    if (!canResend || isLoading) return;

    try {
      setIsLoading(true);
      setError("");
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/otp/send`,
        {},
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsOtpSent(true);
      setTimer(60);
      setToast({ type: "success", msg: "OTP code sent to your email." });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again.",
      );
      setToast({ type: "error", msg: "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await api.post(
        `/otp/verify`,
        { otp },
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setToast({ type: "success", msg: "Email Verified! Redirecting..." });

      setTimeout(() => {
        navigate("/feed");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Invalid code. Please check and try again.");
      setToast({ type: "error", msg: "Verification failed" });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.isVerified) {
    return <AlreadyVerified />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px]"></div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="absolute top-8 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-full border shadow-xl backdrop-blur-md flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-medium">{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-[#121214] border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative z-10 transition-all duration-500">
        <div className="bg-zinc-900/50 p-8 flex flex-col items-center justify-center border-b border-white/5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
              isOtpSent
                ? "bg-green-500/10 text-green-400"
                : "bg-cyan-500/10 text-cyan-400"
            }`}
          >
            {isOtpSent ? <ShieldCheck size={32} /> : <Mail size={32} />}
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isOtpSent ? "Enter Security Code" : "Verify Your Email"}
          </h1>

          <p className="text-zinc-500 text-sm mt-2 text-center max-w-[85%] leading-relaxed">
            {isOtpSent
              ? "We have sent a 6-digit code to your email. Please enter it below to verify."
              : "To protect your account, we need to verify your email address."}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {!isOtpSent && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {isOtpSent && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              {/* OTP Input */}
              <div className="relative group">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    // Only allow numbers
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setOtp(val);
                    setError("");
                  }}
                  maxLength={6}
                  placeholder="------"
                  className={`w-full bg-black/40 border text-center text-3xl tracking-[1em] font-mono text-white rounded-xl py-4 focus:outline-none focus:ring-1 transition-all placeholder-zinc-700 ${
                    error
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-zinc-700 focus:border-cyan-500 focus:ring-cyan-500/50"
                  }`}
                />
                {error && (
                  <div className="absolute -bottom-6 left-0 w-full flex justify-center items-center gap-1 text-xs text-red-400 font-medium animate-pulse">
                    <AlertCircle size={12} /> {error}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>

                <button
                  onClick={handleSendOtp}
                  disabled={!canResend || isLoading}
                  className={`w-full py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-lg ${
                    !canResend
                      ? "text-zinc-600 cursor-not-allowed"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : !canResend ? (
                    // Countdown
                    <span>Resend code in {timer}s</span>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      <span>Resend Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/30 p-4 border-t border-white/5 text-center">
          <Link
            to="/feed"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
