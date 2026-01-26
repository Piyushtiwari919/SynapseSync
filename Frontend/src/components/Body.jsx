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
import Request from "./Request.jsx";
import Explore from "./Explore.jsx";
import ViewProfile from "./ViewProfile.jsx";
import CreatePost from "./CreatePost.jsx";
import EmailVerify from "./EmailVerification.jsx";
import EditPost from "./EditPost.jsx";

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
        <Route path="/requests" element={<Request />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post/create" element={<CreatePost />} />
        <Route path="/profile/:userId" element={<ViewProfile />} />
        <Route path="/verify/email" element={<EmailVerify />} />
        <Route path="/edit/post/:postId" element={<EditPost />} />
      </Route>,
    )
  );

  return <RouterProvider router={appRouter} />;
};

export default Body;
