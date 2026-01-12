import { Grid } from "lucide-react";
const UserPosts = () => {
  // Fetch posts logic here or receive via props
  return (
    <div className="min-h-50 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
      <div className="p-4 bg-zinc-800/50 rounded-full mb-3">
        <Grid size={24} className="text-zinc-600" />
      </div>
      <h3 className="text-zinc-400 font-medium">No posts yet</h3>
      <p className="text-zinc-600 text-sm mt-1">
        Share your first moment with the world.
      </p>
    </div>
  );
};

export default UserPosts;
