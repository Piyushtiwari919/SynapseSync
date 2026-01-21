import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AlreadyVerified = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    if (countdown === 0) {
      navigate("/feed");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#121214] border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/5 shadow-xl shadow-green-900/20 animate-bounce-slow">
            <CheckCircle2 size={40} className="text-green-400 drop-shadow-md" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            You're Already Verified!
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-[80%]">
            Your email is confirmed and your account is fully active. You can
            start posting and exploring immediately.
          </p>

          <Link
            to="/"
            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg mb-4"
          >
            <span>Go to Feed</span>
            <ArrowRight size={18} />
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Redirecting home in {countdown}s</span>
          </div>
        </div>

        <div className="h-1 w-full bg-linear-to-r from-transparent via-green-500/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default AlreadyVerified;
