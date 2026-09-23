import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import type { FeedbackDialogConfig } from "../types";

interface FeedbackDialogProps {
  config: FeedbackDialogConfig;
  onClose: () => void;
}

export const FeedbackDialog = ({ config, onClose }: FeedbackDialogProps) => {
  const { title, description, variant, buttonText = "OK" } = config;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>

      {description && (
        <DialogContent>
          <Alert severity={variant}>{description}</Alert>
        </DialogContent>
      )}

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {buttonText}
        </Button>
      </DialogActions>
    </>
  );
};
