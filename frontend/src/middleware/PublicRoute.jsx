import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function PublicRoute() {
  const location = useLocation();
  const publicAuthPaths = ["/public/login", "/public/register", "/public/success"];

  if (publicAuthPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  if (!isAuthenticated("public")) {
    return <Navigate to="/public/login" replace />;
  }

  return <Outlet />;
}