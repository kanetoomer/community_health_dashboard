import Landing from "./pages/Landing";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {
  const url = "http://localhost:5174/";
  return (
    <>
      <Routes>
        <Route path="*" element={<Landing url={url} />} />
        <Route path="/register" element={<Register url={url} />} />
        <Route path="/sign-in" element={<SignIn url={url} />} />
      </Routes>
    </>
  );
}

export default App;
