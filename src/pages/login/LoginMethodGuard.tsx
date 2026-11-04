import { Navigate, Outlet } from "react-router";
import { useLogin } from "../../shared/Auth/login/useLogin";

export default function LoginMethodGuard() {
  const { selectedMethod } = useLogin();

  if (!selectedMethod) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}