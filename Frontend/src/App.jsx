import { Provider } from "react-redux";
import appStore from "../store/appStore.js";
import Body from "./components/Body.jsx";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <Body />
      </Provider>
    </>
  );
}

export default App;
