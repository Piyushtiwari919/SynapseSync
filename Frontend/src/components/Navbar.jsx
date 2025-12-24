import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  return (
    <div className="navbar bg-info-content shadow-sm flex justify-between">
      <div className="flex justify-center">
        <img src="/SS-logo.png" className="h-10 m-0 p-0" />
        <a className="btn btn-ghost text-xl m-0 p-2">SynapseSync</a>
      </div>
      <div className="flex gap-2">
        {user ? (
          <div className="dropdown dropdown-end mx-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user-image" src={user?.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                  {/** Render new for first time user register only */}
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="mx-4">
            <Link to="/login">
              <button className="bg-cyan-500 p-2 rounded-md cursor-pointer">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;