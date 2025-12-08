import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { selectAuthUser, selectToken } from "../../redux/auth/auth-selectors";

const PrivateRoute = () => {
  const user = useSelector((state) => selectAuthUser(state));
  const token = useSelector((state) => selectToken(state));
  const loading = useSelector((state) => state.auth.loading);

  if (!user && token && loading) {
    return <p>Loading...</p>;
  }

  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
