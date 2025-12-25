import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../../store/userSlice.js";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleLogout = async ()=>{
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`,{},{withCredentials:true});
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="navbar bg-info-content shadow-sm flex justify-between">
      <div className="flex justify-center">
        <img src="/SS-logo.png" className="h-10 m-0 p-0" />
        <Link
          to="/feed"
          className="btn btn-ghost text-xl m-0 p-2 cursor-pointer"
        >
          SynapseSync
        </Link>
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
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                  {/** Render new for first time user register only */}
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
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
