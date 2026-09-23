import { useState } from "react";

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import type { OtpDialogConfig } from "../types";

interface OtpDialogProps {
  config: OtpDialogConfig;
  onClose: () => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export const OtpDialog = ({
  config,
  onClose,
  setLoading,
  loading,
}: OtpDialogProps) => {
  const {
    title,
    description,
    length = 6,
    submitText = "Verify",
    cancelText = "Cancel",
    onSubmit,
  } = config;

  const [otp, setOtp] = useState("");

  const handleChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= length) {
      setOtp(numericValue);
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== length) {
      return;
    }
    try {
      setLoading(true);
      await onSubmit(otp);
      onClose();
    } catch (error) {
      console.error("OTP submission failed:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {description && <Typography sx={{ mb: 2 }}>{description}</Typography>}

        <TextField
          fullWidth
          autoFocus
          value={otp}
          onChange={(event) => handleChange(event.target.value)}
          slotProps={{
            input: {
              inputMode: "numeric",
              autoComplete: "one-time-code",
            },
            htmlInput: {
              maxLength: length,
            },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={otp.length !== length || loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {submitText}
        </Button>
      </DialogActions>
    </>
  );
};
