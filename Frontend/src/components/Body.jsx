import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Layout.jsx";

const Body = () => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route />
      </Route>
    )
  );

  return <RouterProvider router={appRouter} />;
};

export default Body;
