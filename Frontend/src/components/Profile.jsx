import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) return;

  return (
    <div className="min-h-dvh bg-emerald-50">
      <div className="flex items-center my-4">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1767153434535-89b4a3db366d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="w-dvw h-30 md:h-50 rounded-md object-cover"
          />
        </div>
        <div className="inline-block z-50 absolute max-sm:top-35 md:top-58">
          <img
            src={user.profileImageUrl}
            className="max-sm:w-20 max-sm:h-20 h-30 w-30 rounded-full mx-2 object-cover"
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mt-3 ml-2 md:mt-15 lg:mt-20 mr-2">
          <i className="fa-brands fa-battle-net text-black inline-block"></i>
          <h2 className="text-3xl text-black font-bold inline-block ml-2">
            {user.firstName}
          </h2>
          {user.isVerified ? (
            <i className="fa-brands fa-galactic-senate text-black"></i>
          ) : (
            ""
          )}
          <div className="ml-8">
            <Link to="/profile/edit" title="Edit Profile">
              <i className="fa-solid fa-pen-fancy text-black"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl p-1 shadow-xl max-w-sm mx-2 mt-4 mb-2">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg py-6 text-white grid grid-cols-2 divide-x divide-white/20">
          <div className="text-center px-4">
            <h2 className="font-bold text-2xl drop-shadow-md">400</h2>
            <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-wider">
              Connections
            </p>
          </div>

          <div className="text-center px-4">
            <h2 className="font-bold text-2xl drop-shadow-md">10</h2>
            <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-wider">
              Posts
            </p>
          </div>
        </div>
      </div>
      <div className="text-black">
        <div className="mt-4">
            <h2 className="p-2 text-2xl font-bold bg-gray-300 inline-block rounded-xl mx-4">Posts</h2>
            <div>
                {/* posts*/}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
