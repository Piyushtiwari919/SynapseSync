import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

const VerifyToComment = () => {
  return (
    // 1. Responsive Container: flex-col on mobile, flex-row on desktop
    <div className="w-full mt-2 mb-4 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#18181b] border border-zinc-800 rounded-2xl shadow-sm animate-in fade-in duration-300">
      {/* 2. Left Side: Icon & Copy */}
      <div className="flex items-center gap-3 text-zinc-300">
        {/* Soft icon background matches the cyan branding */}
        <div className="p-2 bg-cyan-500/10 rounded-full text-cyan-500 shrink-0">
          <MailCheck size={20} />
        </div>
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-zinc-100">Almost there!</span>{" "}
          Verify your email address to join the conversation.
        </p>
      </div>

      {/* 3. Right Side: The Action Button (Properly formatted Link) */}
      <Link
        to="/verify/email"
        className="shrink-0 w-full sm:w-auto px-5 py-2.5 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-bold rounded-xl transition-all border border-zinc-700 active:scale-95"
      >
        Verify Email
      </Link>
    </div>
  );
};

export default VerifyToComment;
