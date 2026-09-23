import { DialogActions, DialogContent, DialogTitle } from "@mui/material";

import type { CustomDialogConfig } from "../types";

interface CustomDialogProps {
  config: CustomDialogConfig;
}

export const CustomDialog = ({ config }: CustomDialogProps) => {
  const { title, content, actions } = config;

  return (
    <>
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent>{content}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </>
  );
};
