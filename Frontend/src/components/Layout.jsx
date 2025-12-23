import { Outlet } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer/>
    </>
  );
};

export default Layout;