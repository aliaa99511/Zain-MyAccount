import { createContext } from "react";

type LoginMethod = "password" | "otp";

interface LoginContextType {
  identifier: string;
  setIdentifier: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  selectedMethod: LoginMethod | null;
  setSelectedMethod: (value: LoginMethod | null) => void;
}

export const LoginContext = createContext<LoginContextType | null>(null);
