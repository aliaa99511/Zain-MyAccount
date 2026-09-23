import { createBrowserRouter, Navigate } from "react-router";
import Layout from "../layout";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useDialog } from "../shared/dialog/hooks/useDialog";

// eslint-disable-next-line react-refresh/only-export-components
function LoginPage(): React.ReactElement {
  return <div>Login Page</div>;
}
// eslint-disable-next-line react-refresh/only-export-components
function DashboardPage(): React.ReactElement {
  return <Typography color="primary">Dashboard Page</Typography>;
}
// eslint-disable-next-line react-refresh/only-export-components
function ProfilePage(): React.ReactElement {
  const { confirm } = useDialog();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Are you sure you want to Logout?",
      description: "Are you sure you want to logout from your account?",
      confirmText: "Logout",
      cancelText: "Cancel",
    });
    if (!confirmed) {
      return;
    }
    // await logout();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
// eslint-disable-next-line react-refresh/only-export-components
function SettingsPage(): React.ReactElement {
  return <div>Settings Page</div>;
}
// eslint-disable-next-line react-refresh/only-export-components
function RegisterPage(): React.ReactElement {
  return <div>Register Page</div>;
}

const router = createBrowserRouter([
  // -------------------------
  // Public routes
  // -------------------------
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // -------------------------
  // Protected routes
  // -------------------------
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  // -------------------------
  // Fallback
  // -------------------------
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
