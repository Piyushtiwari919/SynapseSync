import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Layout.jsx";
import Login from "./Login.jsx";

const Body = () => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login/>} />
      </Route>
    )
  );

  return <RouterProvider router={appRouter} />;
};

export default Body;
