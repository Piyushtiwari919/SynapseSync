import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../../store/userSlice.js";
import { LogOut, User, Users, Bell, Home, PlusSquare } from "lucide-react";
import { removeConnection } from "../../store/connectionSlice.js";
import { removeFeed } from "../../store/feedSlice.js";
import { removeFeedUsers } from "../../store/exploreSlice.js";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to check which page is active
  const user = useSelector((store) => store.user);

  // --- LOGIC: HELPER FUNCTIONS ---

  const closeMenu = () => {
    const elem = document.activeElement;
    if (elem) elem.blur();
  };

  const handleLogout = async () => {
    try {
      closeMenu();
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      dispatch(removeConnection());
      dispatch(removeFeed());
      dispatch(removeFeedUsers());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Helper to check if a route is active (for styling)
  const isActive = (path) => location.pathname === path;

  // --- SUB-COMPONENT: NAV ITEM (Desktop) ---
  const NavItem = ({ to, icon: Icon, label, hasBadge }) => (
    <Link
      to={to}
      className={`relative flex flex-col items-center justify-center px-4 h-full transition-colors ${
        isActive(to) ? "text-white" : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <div className="relative">
        <Icon
          size={24}
          className={isActive(to) ? "fill-current text-white" : ""}
          strokeWidth={isActive(to) ? 2.5 : 2}
        />
        {/* Red Dot Badge */}
        {hasBadge && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </div>
      {/* Active Indicator Line */}
      {isActive(to) && (
        <span className="absolute bottom-0 w-full h-0.5 bg-cyan-500 rounded-t-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
      )}
    </Link>
  );

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800">
        <div className="navbar max-w-7xl mx-auto px-4 h-16">
          {/* --- LEFT: LOGO --- */}
          <div className="flex-none flex items-center gap-3">
            <Link
              to={user ? "/feed" : "/"}
              className="flex items-center gap-2 group"
            >
              <img
                src="/SS-logo.png"
                className="h-8 w-auto transition-transform group-hover:scale-105"
                alt="Logo"
              />
              <span className="hidden sm:block text-xl font-bold tracking-tight text-zinc-100 group-hover:text-cyan-400 transition-colors">
                SynapseSync
              </span>
            </Link>
          </div>

          {/* --- CENTER: DESKTOP NAVIGATION (Hidden on Mobile) --- */}
          {user && (
            <div className="hidden md:flex flex-1 justify-center h-full gap-6 lg:gap-10">
              <NavItem to="/feed" icon={Home} label="Home" />
              <NavItem to="/connections" icon={Users} label="My Network" />
              <NavItem
                to="/requests"
                icon={Bell}
                label="Notifications"
                hasBadge={true}
              />
            </div>
          )}

          {/* --- RIGHT: PROFILE / ACTIONS --- */}
          <div className="flex-none ml-auto gap-4">
            {user ? (
              <div className="dropdown dropdown-end">
                {/* Avatar Trigger */}
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-cyan-500/50 transition-all"
                >
                  <div className="w-9 rounded-full">
                    <img
                      alt="user-image"
                      src={
                        user?.profileImageUrl ||
                        "https://via.placeholder.com/150"
                      }
                    />
                  </div>
                </div>

                {/* Simplified Dropdown (Only "Me" items) */}
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-[#18181b] border border-zinc-700 rounded-xl z-1 mt-3 w-56 p-2 shadow-2xl"
                >
                  <li className="mb-1">
                    <Link
                      to="/profile"
                      title="Profile"
                      onClick={closeMenu}
                      className="py-3 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <User size={16} /> Profile
                    </Link>
                  </li>
                  <div className="divider my-1 border-zinc-700"></div>
                  <li>
                    <a
                      onClick={handleLogout}
                      className="py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut size={16} /> Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : location.pathname === "/register" ||
              location.pathname === "/" ? (
              <Link to="/login">
                <button className="btn bg-cyan-600 hover:bg-cyan-700 text-white border-none font-bold min-h-9 h-9 px-6 rounded-full">
                  Login
                </button>
              </Link>
            ) : (
              <Link to="/register">
                <button className="btn bg-cyan-600 hover:bg-cyan-700 text-white border-none font-bold min-h-9 h-9 px-6 rounded-full">
                  Signup
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR (Mobile Only) */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-lg border-t border-zinc-800 pb-safe-area-inset-bottom">
          <div className="flex justify-around items-center h-16 px-2">
            <Link
              to="/feed"
              title="feed"
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive("/feed") ? "text-white" : "text-zinc-500"
              }`}
            >
              <Home
                size={24}
                className={isActive("/feed") ? "fill-current" : ""}
              />
              <span className="text-[10px] mt-1 font-medium">Home</span>
            </Link>

            <Link
              to="/connections"
              title="connections"
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive("/connections") ? "text-white" : "text-zinc-500"
              }`}
            >
              <Users
                size={24}
                className={isActive("/connections") ? "fill-current" : ""}
              />
              <span className="text-[10px] mt-1 font-medium">Network</span>
            </Link>

            {/* Middle Action Button (Create Post) */}
            {user?.isVerified ? (
              <Link
                to="/post/create"
                title="post"
                className="text-cyan-400 hover:text-cyan-300 transition-colors -mt-5"
              >
                <div className="bg-zinc-800 p-3 rounded-full border border-zinc-700 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <PlusSquare size={24} />
                </div>
              </Link>
            ) : (
              <Link
                to="/verify/email"
                title="post"
                className="text-cyan-400 hover:text-cyan-300 transition-colors -mt-5"
              >
                <div className="bg-zinc-800 p-3 rounded-full border border-zinc-700 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <PlusSquare size={24} />
                </div>
              </Link>
            )}

            <Link
              to="/requests"
              title="requests"
              className={`relative flex flex-col items-center p-2 transition-colors ${
                isActive("/requests") ? "text-white" : "text-zinc-500"
              }`}
            >
              <div className="relative">
                <Bell
                  size={24}
                  className={isActive("/requests") ? "fill-current" : ""}
                />
                {/* Mobile Badge */}
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#09090b]"></span>
              </div>
              <span className="text-[10px] mt-1 font-medium">Requests</span>
            </Link>

            <Link
              to="/profile"
              title="Profile"
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive("/profile") ? "text-white" : "text-zinc-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full overflow-hidden border-2 ${
                  isActive("/profile") ? "border-white" : "border-transparent"
                }`}
              >
                <img
                  src={user?.profileImageUrl}
                  alt="me"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] mt-1 font-medium">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
