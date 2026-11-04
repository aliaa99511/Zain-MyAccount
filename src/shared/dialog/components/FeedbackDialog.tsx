import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type { FeedbackDialogConfig } from "../types";
import SuccessAchievement from "../../icons/SuccessAchievement";
import FailedCancel from "../../icons/FailedCancel";

interface FeedbackDialogProps {
  config: FeedbackDialogConfig;
  onClose: () => void;
}

export const FeedbackDialog = ({ config, onClose }: FeedbackDialogProps) => {
  const { title, description, variant, buttonText} = config;
  const isSuccess = variant === "success";

  return (
    <Box
      sx={{
        bgcolor: "#FAFAFA",
        borderRadius: "16px",
        textAlign: "center",
        px: { xs: 2, sm: 3 },
        py: 2.5,
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            color: isSuccess ? "#20652A" : "#C00070",
            display: "flex",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          {isSuccess ? (
            <SuccessAchievement sx={{fontSize: "80px", strokeWidth: 1.5}} />
          ) : (
            <FailedCancel sx={{fontSize: "80px", strokeWidth: 1.5}} />
          )}
        </Box>

        <DialogTitle
          variant="h3"
          sx={{
            p: 0,
          }}
        >
          {title}
        </DialogTitle>

        {description && (
          <Typography
            variant="body1"
            color="textSecondary"
          >
            {description}
          </Typography>
        )}
      </DialogContent>

      {buttonText && 
      ( <DialogActions
        sx={{
          justifyContent: "center",
          p: 0,
          pt: 2,
        }}
      >
        <Button variant="contained" onClick={onClose}>
          {buttonText}
        </Button>
      </DialogActions>) }
    </Box>
  );
};
