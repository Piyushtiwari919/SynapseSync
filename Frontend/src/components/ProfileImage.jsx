const ProfileImage = ({ user, handleImageVisibility }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
        onClick={handleImageVisibility}
      />
      <div className="relative z-10 flex max-h-full max-w-5xl flex-col items-center justify-center">
        <button
          onClick={handleImageVisibility}
          className="group absolute -top-12 right-0 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white md:top-4 md:right-4 md:bg-black/50 md:backdrop-blur-md"
        >
          <span className="hidden sm:block">Close</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20">
            <i className="fa-solid fa-xmark text-lg"></i>
          </div>
        </button>
        <img
          src={user.profileImageUrl}
          alt="Profile"
          className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        />
      </div>
    </div>
  );
};

export default ProfileImage;
