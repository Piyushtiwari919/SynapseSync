import { WifiOff, RefreshCw } from "lucide-react";

const ChatError = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-75 p-6 text-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative flex items-center justify-center w-20 h-20 bg-[#18181b] border border-red-500/20 rounded-full shadow-lg">
          <WifiOff size={32} className="text-red-500" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2 tracking-tight">
        Connection Lost
      </h2>
      <p className="text-sm text-zinc-400 max-w-xs mx-auto mb-8 leading-relaxed">
        We're having trouble reaching the server. Please check your internet
        connection and try again.
      </p>

      <button
        onClick={onRetry}
        className="group flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition-all active:scale-95 border border-zinc-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw
          size={18}
          className={`transition-transform duration-500 group-hover:rotate-180`}
        />
        <span>Try Again</span>
      </button>
    </div>
  );
};

export default ChatError;
