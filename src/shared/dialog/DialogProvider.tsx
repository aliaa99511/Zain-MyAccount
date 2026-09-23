/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { DialogRenderer } from "./DialogRenderer";

import type {
  AlertOptions,
  ConfirmOptions,
  DialogConfig,
  DialogInstance,
  FeedbackOptions,
} from "./types";

export interface DialogContextValue {
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
  confirm: (config: ConfirmOptions) => Promise<boolean>;
  alert: (config: AlertOptions) => Promise<void>;
  feedback: (config: FeedbackOptions) => Promise<void>;

  success: (title: string, description?: ReactNode) => Promise<void>;
  error: (title: string, description?: ReactNode) => Promise<void>;
  warning: (title: string, description?: ReactNode) => Promise<void>;
  info: (title: string, description?: ReactNode) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DialogContext = createContext<DialogContextValue | undefined>(
  undefined,
);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialog, setDialog] = useState<DialogInstance | null>(null);

  /**
   * Prevent resolving the same Promise twice.
   */
  const resolvedRef = useRef(false);

  const openDialog = useCallback((config: DialogConfig) => {
    resolvedRef.current = false;
    setDialog({
      config,
    });
  }, []);

  const closeDialog = useCallback(() => {
    if (dialog?.resolve) {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        dialog.resolve(undefined);
      }
    }
    setDialog(null);
  }, [dialog]);

  const confirm = useCallback((config: ConfirmOptions): Promise<boolean> => {
    return new Promise<any>((resolve) => {
      resolvedRef.current = false;

      setDialog({
        config: {
          ...config,
          type: "confirm",
        },

        resolve,
      });
    });
  }, []);

  const alert = useCallback((config: AlertOptions): Promise<void> => {
    return new Promise<any>((resolve) => {
      resolvedRef.current = false;

      setDialog({
        config: {
          ...config,
          type: "alert",
        },

        resolve,
      });
    });
  }, []);

  const feedback = useCallback((config: FeedbackOptions): Promise<void> => {
    return new Promise<any>((resolve) => {
      resolvedRef.current = false;

      setDialog({
        config: {
          ...config,
          type: "feedback",
        },

        resolve,
      });
    });
  }, []);

  const success = useCallback(
    (title: string, description?: ReactNode) => {
      return feedback({
        variant: "success",
        title,
        description,
      });
    },

    [feedback],
  );

  const error = useCallback(
    (title: string, description?: ReactNode) => {
      return feedback({
        variant: "error",
        title,
        description,
      });
    },

    [feedback],
  );

  const warning = useCallback(
    (title: string, description?: ReactNode) => {
      return feedback({
        variant: "warning",
        title,
        description,
      });
    },

    [feedback],
  );

  const info = useCallback(
    (title: string, description?: ReactNode) => {
      return feedback({
        variant: "info",
        title,
        description,
      });
    },

    [feedback],
  );

  const handleConfirm = useCallback(() => {
    if (!dialog?.resolve) {
      setDialog(null);
      return;
    }

    if (resolvedRef.current) {
      return;
    }

    resolvedRef.current = true;

    dialog.resolve(true);

    setDialog(null);
  }, [dialog]);

  const value = useMemo<DialogContextValue>(
    () => ({
      openDialog,
      closeDialog,
      confirm,
      alert,
      feedback,
      success,
      error,
      warning,
      info,
    }),
    [
      openDialog,
      closeDialog,
      confirm,
      alert,
      feedback,
      success,
      error,
      warning,
      info,
    ],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}

      {dialog && (
        <DialogRenderer
          config={dialog.config}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          onResolve={(value) => {
            if (!dialog.resolve) {
              setDialog(null);
              return;
            }
            if (resolvedRef.current) {
              return;
            }
            resolvedRef.current = true;
            dialog.resolve(value);
            setDialog(null);
          }}
        />
      )}
    </DialogContext.Provider>
  );
};
