import { DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import type { CustomDialogConfig } from "../types";

interface CustomDialogProps {
  config: CustomDialogConfig;
  onClose: () => void;
}

export const CustomDialog = ({ config, onClose }: CustomDialogProps) => {
  const { title, content, actions,  } = config;

  return (
    <>
      {title && <DialogTitle variant="h3" sx={{py: 0, px: 1, mb: 1}}>{title} </DialogTitle>}

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{p:1}}>{content}</DialogContent>

      {actions && <DialogActions sx={{p:0, mt: 1}}>{actions}</DialogActions>}
    </>
  );
};
