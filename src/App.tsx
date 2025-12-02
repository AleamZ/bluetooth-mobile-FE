import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./router/main.route";

function App() {
  return (
    <>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
