import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type { AlertDialogConfig } from "../types";

interface AlertDialogProps {
  config: AlertDialogConfig;
  onClose: () => void;
}

export const AlertDialog = ({ config, onClose }: AlertDialogProps) => {
  const { title, description, buttonText = "OK" } = config;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>

      {description && (
        <DialogContent>
          {typeof description === "string" ? (
            <Typography>{description}</Typography>
          ) : (
            description
          )}
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
