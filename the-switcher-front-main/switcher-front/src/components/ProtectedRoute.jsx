import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const idPlayer = sessionStorage.getItem("idPlayer");

  if (!idPlayer) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
