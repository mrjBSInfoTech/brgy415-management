import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function PrivateRoute() {
  if (!isAuthenticated("private")) {
    return <Navigate to="/private/login" replace />;
  }

  return <Outlet />;
}