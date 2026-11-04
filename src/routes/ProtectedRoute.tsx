/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector, useStore } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { selectIsChecking } from "../store/slices/sessionSlice";
import { useEffect, useRef } from "react";
import { ensureSession } from "../store/apis/base_api";
import FullPageSpinner from "../shared/icons/FullPageSpinner";
import { useAuth } from "../auth/useAuth";
import { useDialog } from "../shared/dialog/hooks/useDialog";
import { Typography } from "@mui/material";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const store = useStore<any>();
  const reason = useSelector((s: { session: any }) => s.session.endedReason);
  const isCheckingSession = useSelector(selectIsChecking);
  const hasShownDialog = useRef(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {confirm} = useDialog();
  // const isAuthenticated = true;

  useEffect(() => {
    ensureSession({ dispatch, getState: store.getState }).catch(() => {});
  }, [dispatch, store]);

  useEffect(() => {
    if (
      isCheckingSession ||
      !isAuthenticated ||
      reason !== "idle_timeout" ||
      hasShownDialog.current
    ) {
      return;
    }
    hasShownDialog.current = true;
    async function openDialog() {
      const res = await confirm({
        title: "",
        description: <Typography>Your session has expired. Please sign in again to continue.</Typography>,
        confirmText: "Login",
      })
      if (res) {
        navigate("/login");
      }

    }
    void  openDialog();
  }, [reason, isCheckingSession, isAuthenticated, confirm, navigate]);

  if (isCheckingSession) {
    return <FullPageSpinner />;
  }

  

  if (!isCheckingSession && (!isAuthenticated || reason === "unknown_session")) {
    return <Navigate to="/login" replace state={{  from: location, reason }} />;
  }

  return <Outlet />;
}
