import { WifiOff, RefreshCw } from "lucide-react";

const ErrorState = ({ onRetry }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <WifiOff size={48} className="text-red-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Something went wrong
      </h2>

      <p className="text-gray-500 max-w-md mb-8">
        We couldn't load your connections right now. It might be a temporary
        issue with our servers or your internet connection.
      </p>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-all active:scale-95"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
