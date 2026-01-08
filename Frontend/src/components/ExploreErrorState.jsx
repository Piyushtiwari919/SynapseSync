import { RefreshCw, WifiOff, Activity } from "lucide-react";

const ExploreErrorState = ({ onRetry, isRetrying }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-8 group cursor-default">
        <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl transform translate-x-1 translate-y-1"></div>
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl transform -translate-x-1 -translate-y-1"></div>
        <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-full shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-rose-500/10 to-transparent animate-pulse"></div>
          <WifiOff size={42} className="text-rose-400 relative z-10" />
          <Activity
            size={20}
            className="absolute bottom-4 right-4 text-gray-600 opacity-50"
          />
        </div>
      </div>
      <div className="max-w-md space-y-3 mb-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-200">
          The signal got lost in space
        </h3>
        <p className="text-gray-400 leading-relaxed">
          We couldn't fetch the new profiles just yet. The community is still
          there, we just need to re-establish the connection.
        </p>
      </div>
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className={`
          relative flex items-center gap-3 px-8 py-3.5 rounded-full font-medium transition-all duration-300
          ${
            isRetrying
              ? "bg-gray-800 text-gray-500 cursor-wait border border-gray-700"
              : "bg-gray-100 text-gray-900 hover:bg-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
          }
        `}
      >
        <RefreshCw
          size={18}
          className={`${
            isRetrying ? "animate-spin text-rose-500" : "text-gray-900"
          }`}
        />

        <span>{isRetrying ? "Reconnecting..." : "Try Again"}</span>
      </button>
      {!isRetrying && (
        <p className="mt-6 text-xs text-gray-600">
          Check your internet connection if the problem persists.
        </p>
      )}
    </div>
  );
};

export default ExploreErrorState;
