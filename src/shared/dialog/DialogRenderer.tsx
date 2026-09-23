/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { AlertDialog } from "./components/AlertDialog";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { CustomDialog } from "./components/CustomDialog";
import { FeedbackDialog } from "./components/FeedbackDialog";
import { FormDialog } from "./components/FormDialog";
import { OtpDialog } from "./components/OtpDialog";
import type { DialogConfig, DialogWidth, FormDialogConfig } from "./types";

interface DialogRendererProps {
  config: DialogConfig;
  onClose: () => void;
  onConfirm: () => void;
  onResolve: (value: unknown) => void;
}

export const DialogRenderer = ({
  config,
  onClose,
  onConfirm,
}: DialogRendererProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.type !== "feedback" || !config.autoClose) {
      return;
    }
    const timer = window.setTimeout(onClose, config.autoClose);
    return () => {
      window.clearTimeout(timer);
    };
  }, [config, onClose]);

  const {
    width = "sm",
    fullWidth = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
  } = config;

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  const handleDialogClose = (
    _event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (loading) {
      return;
    }

    if (reason === "backdropClick" && !closeOnBackdrop) {
      return;
    }

    if (reason === "escapeKeyDown" && !closeOnEscape) {
      return;
    }

    onClose();
  };

  const renderDialogContent = () => {
    switch (config.type) {
      case "confirm":
        return (
          <ConfirmDialog
            config={config}
            onConfirm={onConfirm}
            onClose={handleClose}
            loading={loading}
          />
        );

      case "alert":
        return <AlertDialog config={config} onClose={handleClose} />;

      case "feedback":
        return <FeedbackDialog config={config} onClose={handleClose} />;

      case "otp":
        return (
          <OtpDialog
            config={config}
            onClose={handleClose}
            loading={loading}
            setLoading={setLoading}
          />
        );

      case "form":
        return (
          <FormDialog
            config={config as FormDialogConfig<any>}
            onClose={handleClose}
            loading={loading}
            setLoading={setLoading}
          />
        );

      case "custom":
        return <CustomDialog config={config} />;

      default:
        return null;
    }
  };

  return (
    <Dialog
      open
      fullWidth={fullWidth}
      maxWidth={width as DialogWidth}
      onClose={handleDialogClose}
      // disableEscapeKeyDown={
      //   !closeOnEscape || loading
      // }
    >
      {renderDialogContent()}
    </Dialog>
  );
};
