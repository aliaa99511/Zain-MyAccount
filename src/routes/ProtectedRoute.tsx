import { Navigate, Outlet, useLocation } from "react-router";
// import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute() {
  // const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isAuthenticated = true;
  // if (isLoading) {
  //   return <div>Checking session...</div>;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
