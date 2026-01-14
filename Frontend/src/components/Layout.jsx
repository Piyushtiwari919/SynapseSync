import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../store/userSlice.js";
import { addConnections } from "../../store/connectionSlice.js";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const connectedUsers = useSelector((store) => store.connections);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/view`,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      console.error(error);
    }
  };

  const getConnections = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/connections`,
        { withCredentials: true }
      );
      dispatch(addConnections(response?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
    if (!connectedUsers) {
      getConnections();
    }
  }, []);

  useEffect(() => {
    // Logic: If user IS logged in AND they are sitting on the home page "/"
    // Then: Bounce them to "/feed" immediately.
    if (userData && location.pathname === "/") {
      navigate("/feed");
    }

    if (userData && location.pathname === "/register") {
      navigate("/feed");
    }

    // Also: If user is logged in, don't let them see "/login"
    if (userData && location.pathname === "/login") {
      navigate("/feed");
    }
  }, [userData, location.pathname, navigate]);
  return (
    <div
      className={`flex flex-col min-h-screen ${
        userData ? "pb-16 md:pb-0" : ""
      }`}
    >
      <NavBar />

      <div className="grow w-full">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
