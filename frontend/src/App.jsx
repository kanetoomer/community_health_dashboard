import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import SignIn from "./pages/SignIn.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  const url = "https://community-health-dashboard-backend.onrender.com";
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing url={url} />} />
        <Route path="/sign-in" element={<SignIn url={url} />} />
        <Route path="/register" element={<Register url={url} />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard url={url} />
            </PrivateRoute>
          }
        />
        {/* Catch-all route for 404s */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  );
}

export default App;
