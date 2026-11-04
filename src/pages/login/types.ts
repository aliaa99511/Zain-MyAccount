
export type LoginStep = "phone" | "password";

export interface PhoneLoginStepProps {
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    rememberMe: boolean;
    setRememberMe: (value: boolean) => void;
    onContinue: () => void;
    onCreateAccount: () => void;
    failedMessage: string | null;
    initialMessage: string | null;
    isLoading: boolean;
}

export interface PasswordStepProps {
    password: string;
    setPassword: (value: string) => void;
    passwordError: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onResetPassword: () => void;
}
