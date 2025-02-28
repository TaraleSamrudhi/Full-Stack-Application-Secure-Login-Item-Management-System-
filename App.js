import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignup from "./components/LoginSignup";
import InputPage from "./components/InputPage";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import ProtectedRoute

const App = () => {
  return (
    <Routes>
      {/* ✅ Login Page - Always Accessible */}
      <Route path="/" element={<LoginSignup />} />

      {/* ✅ Input Page - Protected Route */}
      <Route
        path="/inputpage"
        element={
          <ProtectedRoute>
            <InputPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
