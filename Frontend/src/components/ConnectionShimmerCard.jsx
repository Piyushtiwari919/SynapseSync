const ConnectionShimmerCard = () => {
  return (
    <div className="w-full aspect-4/5 bg-[#18181b] border border-zinc-800/50 rounded-3xl p-4 flex flex-col items-center justify-between animate-pulse">
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-800 rounded-full shrink-0"></div>

        <div className="h-4 w-3/4 bg-zinc-800 rounded-full"></div>

        <div className="w-full flex flex-col items-center gap-1.5 mt-1">
          <div className="h-2 w-full bg-zinc-800/60 rounded-full"></div>
          <div className="h-2 w-2/3 bg-zinc-800/60 rounded-full"></div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="h-10 w-full bg-zinc-800 rounded-full"></div>
      </div>
    </div>
  );
};

export default ConnectionShimmerCard;
