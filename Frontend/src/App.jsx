import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import appStore from "../store/appStore.js";
import Body from "./components/Body.jsx";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <Body />
      </Provider>
      <Analytics />
    </>
  );
}

export default App;
