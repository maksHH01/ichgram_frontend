import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { selectAuth } from "../../redux/auth/auth-selectors";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) =>
    selectAuth(state)
  );

  if (loading) return <p>Loading...</p>;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default PublicRoute;
