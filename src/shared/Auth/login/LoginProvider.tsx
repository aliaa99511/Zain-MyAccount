import { useState, type ReactNode } from "react";
import { LoginContext } from "./LoginContext";

type LoginMethod = "password" | "otp";

export function LoginProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [identifier, setIdentifier] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedMethod, setSelectedMethod] =
    useState<LoginMethod | null>(null);

  return (
    <LoginContext.Provider
      value={{
        identifier,
        setIdentifier,
        rememberMe,
        setRememberMe,
        selectedMethod,
        setSelectedMethod,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}