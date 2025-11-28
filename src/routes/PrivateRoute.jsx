// import { Outlet, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const PrivateRoute = () => {
//   const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;

import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  return <Outlet />; // Заглушка
};

export default PrivateRoute;
