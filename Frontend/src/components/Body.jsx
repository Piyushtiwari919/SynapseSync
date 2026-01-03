import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Layout.jsx";
import Login from "./Login.jsx";
import Profile from "./Profile.jsx";
import Feed from "./Feed.jsx";
import Home from "./Home.jsx";
import Error from "./Error.jsx";
import Register from "./Register.jsx";
import EditProfile from "./EditProfile.jsx";
import Connection from "./Connection.jsx";
// import ResendVerification from "./EmailVerification.jsx";

const Body = () => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<Error />}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/connections" element={<Connection />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        {/* <Route path="/email/verify" element={<ResendVerification />} /> */}
      </Route>
    )
  );

  return <RouterProvider router={appRouter} />;
};

export default Body;
