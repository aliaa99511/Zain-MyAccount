import React, { useContext, useMemo } from "react";
import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LanguageContext } from "../../../App";
import { create_account_sentences as sentences } from "../../../configurations/language";
import { password_sentences } from "../../../configurations/language";
import PasswordFormSection from "../../../shared/Auth/Password";
import type { PasswordFormValues } from "../../../shared/Auth/Password/PasswordFeilds";

type CreatePasswordProps = {
    onNext: (password: string) => void;
    phoneNumber: string;
    isCreatingAccount: boolean;
};

const CreatePassword: React.FC<CreatePasswordProps> = ({ onNext, phoneNumber, isCreatingAccount }) => {
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";

    const schema = useMemo(() =>
        z
            .object({
                currentPassword: z.string(),
                password: z.string().min(1, password_sentences.PasswordMinLength[language]),
                confirmPassword: z
                    .string()
                    .min(1, password_sentences.ConfirmPassword[language]),
            })
            .superRefine((data, ctx) => {
                const normalizedPhone = phoneNumber.replace(/\D/g, "");
                const normalizedPassword = data.password.replace(/\D/g, "");

                if (
                    normalizedPhone &&
                    normalizedPassword &&
                    data.password === phoneNumber
                ) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["password"],
                        message: password_sentences.PasswordNotPhone[language],
                    });
                }

                if (/(.)\1/u.test(data.password)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["password"],
                        message: password_sentences.PasswordNoRepeatedChars[language],
                    });
                }

                // Prevent an exact match with the phone number, including
                // when the phone number is stored with a country-code prefix.
                if (
                    normalizedPhone &&
                    normalizedPassword === normalizedPhone
                ) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["password"],
                        message: password_sentences.PasswordNotPhone[language],
                    });
                }

                if (data.password !== data.confirmPassword) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["confirmPassword"],
                        message: password_sentences.PasswordsDoNotMatch[language],
                    });
                }
            }),
        [language, phoneNumber]
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
    });

    const onSubmit: SubmitHandler<PasswordFormValues> = (data) => onNext(data.password);

    return (
        <PasswordFormSection
            title={sentences.CreatePasswordTitle[language]}
            description={sentences.CreatePasswordDescription[language]}
            buttonText={
                isCreatingAccount
                    ? language === "Ar"
                        ? "جارٍ إنشاء الحساب..."
                        : "Creating account..."
                    : sentences.CreateAccount[language]
            }
            onSubmit={handleSubmit(onSubmit)}
            disabled={isSubmitting || isCreatingAccount}
            fieldsProps={{ control, register, errors, phoneNumber }}
        />
    );
};

export default CreatePassword;