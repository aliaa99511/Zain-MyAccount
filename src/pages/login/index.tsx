import { Outlet } from "react-router";
import { LoginProvider } from "../../shared/Auth/login/LoginProvider";

export default function Login() {
  return (
    <LoginProvider>
      <Outlet />
    </LoginProvider>
  );
}