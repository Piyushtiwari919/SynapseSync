const ChatSkeleton = () => {
  const skeletonCards = Array.from({ length: 4 });

  return (
    <div className="w-full h-dvh sm:h-[90vh] sm:border border-zinc-800 sm:rounded-2xl shadow-2xl flex flex-col bg-[#18181b] overflow-hidden">
      <div className="px-4 py-5 border-b border-zinc-800 bg-[#18181b] z-10">
        <div className="h-8 w-40 bg-zinc-800/80 rounded-lg mb-4 animate-pulse"></div>

        <div className="w-full h-12 bg-[#09090b] border border-zinc-800 rounded-xl animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-[#09090b]/40 flex flex-col gap-1">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="w-full p-3 sm:p-4 flex items-center gap-4"
          >
            <div className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-zinc-800 animate-pulse"></div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 sm:w-40 bg-zinc-800 rounded-md animate-pulse"></div>
                <div className="h-3 w-10 bg-zinc-800/50 rounded-md animate-pulse"></div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <div
                  className={`h-3 bg-zinc-800/60 rounded-md animate-pulse ${index % 2 === 0 ? "w-3/4" : "w-1/2"}`}
                ></div>
                {/* One unread message display */}
                {index === 0 && (
                  <div className="shrink-0 h-5.5 w-5.5 bg-zinc-700/50 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSkeleton;
