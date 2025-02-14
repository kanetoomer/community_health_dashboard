import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const url = "http://localhost:5173/";

  return (
    <>
      <div>
        <Routes>
          <Route path="*" element={<Dashboard url={url} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
