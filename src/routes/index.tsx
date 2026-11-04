import { createBrowserRouter, Navigate } from "react-router";
import React from "react";
import Typography from "@mui/material/Typography";

import Layout from "../layout";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layout/AuthLayout";

import ContactUs from "../pages/contact_us";
import CreateAccount from "../pages/create_account";
import FAQs from "../pages/faq";
import Login from "../pages/login";
import LoginMethodSelection from "../pages/login/LoginMethodSelection";
import LoginMethodGuard from "../pages/login/LoginMethodGuard";
import LoginWithPassword from "../pages/login/LoginWithPassword";
import LoginWithOTP from "../pages/login/LoginWithOTP";
import ForgetPassword from "../pages/forget_password";
import ChangePassword from "../pages/change_password";
import ModifySecurityQuestions from "../pages/modify_security_questions";
import ComplaintsList from "../pages/complaints/ComplaintList";
import ComplaintForm from "../pages/complaints/ComplaintForm";
import ComplaintDetails from "../pages/complaints/ComplaintDetails";

import PrivacyPolicy from "../pages/privacy_policy";
import TermsConditions from "../pages/terms_conditions";

// eslint-disable-next-line react-refresh/only-export-components
function DashboardPage(): React.ReactElement {
  return <Typography color="primary">Dashboard Page</Typography>;
}

// eslint-disable-next-line react-refresh/only-export-components
function ProfilePage(): React.ReactElement {
  return <>My Profile</>;
}

// eslint-disable-next-line react-refresh/only-export-components
function SettingsPage(): React.ReactElement {
  return <div>Settings Page</div>;
}

const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
        children: [
          {
            index: true,
            element: <LoginMethodSelection />,
          },
          {
            element: <LoginMethodGuard />,
            children: [
              {
                path: "password",
                element: <LoginWithPassword />,
              },
              {
                path: "otp",
                element: <LoginWithOTP />,
              },
            ],
          },
        ],
      },
      {
        path: "forget_password",
        element: <ForgetPassword />,
      },
      {
        path: "change_password",
        element: <ChangePassword />,
      },
      {
        path: "create_account",
        element: <CreateAccount />,
      },
      {
        path: "modify_security_questions",
        element: <ModifySecurityQuestions />,
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/contact-us",
            element: <ContactUs />,
          },
          {
            path: "/faq",
            element: <FAQs />,
          },

          // Complaints
          {
            path: "/complaints",
            element: <ComplaintsList />,
          },
          {
            path: "/create-complaints",
            element: <ComplaintForm />,
          },
          {
            path: "/complaints/:complaintId",
            element: <ComplaintDetails />,
          },
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
          {
            path: "/privacy_policy",
            element: <PrivacyPolicy />,
          },
          {
            path: "/terms_conditions",
            element: <TermsConditions />,
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;