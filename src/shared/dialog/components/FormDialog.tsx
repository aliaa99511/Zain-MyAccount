import { useState } from "react";

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import type { FormDialogConfig, FormRenderContext } from "../types";

interface FormDialogProps<T extends object> {
  config: FormDialogConfig<T>;
  onClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FormDialog = <T extends object>({
  config,
  onClose,
  loading,
  setLoading,
}: FormDialogProps<T>) => {
  const {
    title,
    initialValues,
    render,
    submitText = "Submit",
    cancelText = "Cancel",
    onSubmit,
  } = config;

  const [values, setValuesState] = useState<T>(initialValues);

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const setValues = (nextValues: Partial<T>) => {
    setValuesState((previous) => ({
      ...previous,
      ...nextValues,
    }));
  };

  const reset = () => {
    setValuesState(initialValues);
  };

  const renderContext: FormRenderContext<T> = {
    values,
    setValue,
    setValues,
    reset,
    loading,
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error("Form submission failed:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{render(renderContext)}</DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {submitText}
        </Button>
      </DialogActions>
    </>
  );
};
