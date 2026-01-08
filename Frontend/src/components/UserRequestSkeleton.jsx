const UserRequestSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-[47%] md:w-64 bg-[#1e1e22] rounded-3xl p-4 border border-white/5 shadow-none animate-pulse">
      
      <div className="mb-3 mt-2">
        <div className="h-20 w-20 md:h-24 md:w-24 bg-gray-800 rounded-full"></div>
      </div>
      <div className="w-full flex flex-col items-center gap-2 mb-6">
        <div className="h-5 w-3/4 bg-gray-700 rounded-full"></div>
        <div className="h-3 w-full bg-gray-800 rounded-full"></div>
        <div className="h-3 w-2/3 bg-gray-800 rounded-full"></div>
      </div>
      <div className="w-full flex items-center gap-2 mt-auto">
        <div className="h-10 w-10 md:h-11 md:w-11 bg-gray-800 rounded-full"></div>
        <div className="flex-1 h-10 md:h-11 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
};

export default UserRequestSkeleton;