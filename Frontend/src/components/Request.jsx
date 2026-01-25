import { useState } from "react";
import { ArrowDownLeft, Send, Sparkles } from "lucide-react";
import RequestRecieved from "./RequestRecieved.jsx";
import RequestSend from "./RequestSend.jsx";

const Request = () => {
  const [activeTab, setActiveTab] = useState("requestRecieved");

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pt-8 px-4 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-cyan-900/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end gap-6 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              Connections <Sparkles size={16} className="text-cyan-500" />
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage your network invitations.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center shadow-sm">
            <button
              onClick={() => setActiveTab("requestRecieved")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === "requestRecieved"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <ArrowDownLeft size={16} />
              Received
            </button>

            <button
              onClick={() => setActiveTab("requestSend")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === "requestSend"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Send <Send size={14} />
            </button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col gap-4">
            {activeTab === "requestRecieved" ? (
              <RequestRecieved />
            ) : (
              <RequestSend />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;