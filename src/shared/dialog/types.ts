/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

export type DialogWidth = "xs" | "sm" | "md" | "lg" | "xl";

export type DialogColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

export type FeedbackVariant = "success" | "error" | "warning" | "info";

/**
 * Common configuration shared by all dialogs.
 */
export interface BaseDialogConfig {
  title?: string;
  width?: DialogWidth;
  fullWidth?: boolean;
  /**
   * Whether clicking the backdrop closes the dialog.
   *
   * Default: true
   */
  closeOnBackdrop?: boolean;
  /**
   * Whether pressing Escape closes the dialog.
   *
   * Default: true
   */
  closeOnEscape?: boolean;
  /**
   * Optional custom class name.
   */
  className?: string;
}
/**
 * Confirmation dialog.
 *
 * IMPORTANT:
 * There is deliberately no business callback here.
 *
 * The dialog returns true/false through the Promise returned
 * by useDialog().confirm().
 */
export interface ConfirmDialogConfig extends BaseDialogConfig {
  type: "confirm";
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: DialogColor;
}
/**
 * Simple informational dialog.
 */
export interface AlertDialogConfig extends BaseDialogConfig {
  type: "alert";
  title: string;
  description?: ReactNode;
  buttonText?: string;
}
/**
 * Success / error / warning / info dialog.
 */
export interface FeedbackDialogConfig extends BaseDialogConfig {
  type: "feedback";
  variant: FeedbackVariant;
  title: string;
  description?: ReactNode;
  buttonText?: string;
  /**
   * Automatically close after the specified milliseconds.
   */
  autoClose?: number;
}
/**
 * Context supplied to a FormDialog render function.
 */
export interface FormRenderContext<T extends object> {
  values: T;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  loading: boolean;
}

/**
 * Generic form dialog.
 *
 * The dialog owns the form state.
 *
 * The caller receives the final form values through:
 *
 * const values = await form(...)
 */
export interface FormDialogConfig<
  T extends object = Record<string, unknown>,
> extends BaseDialogConfig {
  type: "form";
  title: string;
  initialValues: T;
  render: (context: FormRenderContext<T>) => ReactNode;
  submitText?: string;
  cancelText?: string;
  /**
   * Called when submit is pressed.
   *
   * If this throws/rejects, the dialog remains open.
   */
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * OTP dialog.
 */
export interface OtpDialogConfig extends BaseDialogConfig {
  type: "otp";
  title: string;
  description?: ReactNode;
  length?: number;
  submitText?: string;
  cancelText?: string;
  /**
   * Called when the OTP is submitted.
   *
   * If this throws/rejects, the dialog remains open.
   */
  onSubmit: (otp: string) => void | Promise<void>;
}

/**
 * Fully custom dialog.
 *
 * Useful when a dialog doesn't fit the standard patterns.
 */
export interface CustomDialogConfig extends BaseDialogConfig {
  type: "custom";
  content: ReactNode;
  actions?: ReactNode;
}

/**
 * Every supported dialog type.
 */
export type DialogConfig =
  | ConfirmDialogConfig
  | AlertDialogConfig
  | FeedbackDialogConfig
  | OtpDialogConfig
  | CustomDialogConfig
  | FormDialogConfig<any>;

export type ConfirmOptions = Omit<ConfirmDialogConfig, "type">;

export type AlertOptions = Omit<AlertDialogConfig, "type">;

export type FeedbackOptions = Omit<FeedbackDialogConfig, "type">;
/**
 * Runtime information used internally by DialogProvider.
 */
export interface DialogInstance {
  config: DialogConfig;

  /**
   * Promise resolver.
   *
   * For example:
   *
   * confirm() -> boolean
   * form() -> submitted values
   */
  resolve?: (value: unknown) => void;
}
