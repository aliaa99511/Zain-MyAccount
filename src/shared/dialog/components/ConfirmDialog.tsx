import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type { ConfirmDialogConfig } from "../types";

interface ConfirmDialogProps {
  config: ConfirmDialogConfig;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export const ConfirmDialog = ({
  config,
  onConfirm,
  onClose,
  loading,
}: ConfirmDialogProps) => {
  const {
    title,
    description,
    confirmText = "Confirm",
    cancelText,
    confirmColor = "primary",
  } = config;

  return (
    <>
      <DialogTitle sx={{mb:2, p:0}} variant="h3">{title}</DialogTitle>

      {description && (
        <DialogContent  sx={{mb:2, p:0}}>
          {typeof description === "string" ? (
            <Typography sx={{color: "#525252"}}>{description}</Typography>
          ) : (
            description
          )}
        </DialogContent>
      )}

      <DialogActions sx={{p:0}}>
        {cancelText && <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>}

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
          sx={{flexGrow: 1}}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </>
  );
};
