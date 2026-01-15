import React from "react";

const FeedCardSkeleton = () => {
  return (
    <div className="w-full bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden mb-6 shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 w-full">
          <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
          <div className="flex flex-col gap-2 w-full max-w-37.5">
            <div className="h-4 w-full bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-3 w-2/3 bg-zinc-800 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3 w-full bg-zinc-800/80 rounded-md animate-pulse" />
        <div className="h-3 w-11/12 bg-zinc-800/80 rounded-md animate-pulse" />
        <div className="h-3 w-4/5 bg-zinc-800/80 rounded-md animate-pulse" />
      </div>
      <div className="w-full h-64 bg-zinc-900 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800/50" />
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
      </div>
    </div>
  );
};

export default FeedCardSkeleton;
