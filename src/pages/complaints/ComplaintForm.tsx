
import { useContext, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Paper,
    Snackbar,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneNumberUtil } from "google-libphonenumber";
import { z } from "zod";

import { LanguageContext } from "../../App";
import { complaints_sentences as sentences } from "../../configurations/language";
import { MuiPhone } from "../../shared/MuiPhone";

import {
    useCreateComplaintMutation,
    useLazyCheckComplaintEligibilityQuery,
} from "../../store";

import type { CreateComplaintRequest } from "./Types";
import { complaintsStyles as styles } from "./complaintStyles";

const phoneUtil = PhoneNumberUtil.getInstance();

type ComplaintFormValues = CreateComplaintRequest;

function ComplaintForm(): React.ReactElement {
    const context = useContext(LanguageContext);
    const language = context?.language === "Ar" ? "Ar" : "En";
    const isArabic = language === "Ar";

    const theme = useTheme();
    const navigate = useNavigate();

    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const errorMessage: string | null = null;
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [failedMessage, setFailedMessage] = useState<string | null>(null);

    const handleClose = () => {
        setOpenAlert(false);
    };

    const [checkEligibility, { isFetching: isCheckingEligibility }] = useLazyCheckComplaintEligibilityQuery();
    const [createComplaint, { isLoading: isCreatingComplaint }] = useCreateComplaintMutation();

    const complaintSchema = useMemo(
        () =>
            z.object({
                followUpNumber: z
                    .string()
                    .trim()
                    .min(1, sentences.FollowUpRequired[language])
                    .superRefine((value, ctx) => {
                        if (!value.trim()) return;

                        try {
                            const parsedNumber = phoneUtil.parseAndKeepRawInput(
                                value,
                                "SD"
                            );

                            if (!phoneUtil.isValidNumberForRegion(parsedNumber, "SD")) {
                                ctx.addIssue({
                                    code: "custom",
                                    message: sentences.InvalidPhone[language],
                                });
                            }
                        } catch {
                            ctx.addIssue({
                                code: "custom",
                                message: sentences.InvalidPhone[language],
                            });
                        }
                    }),

                description: z
                    .string()
                    .trim()
                    .min(1, sentences.DescriptionRequired[language])
                    .max(300, sentences.DescriptionMaxLength[language]),
            }),
        [language]
    );

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ComplaintFormValues>({
        resolver: zodResolver(complaintSchema),
        mode: "onChange",
        defaultValues: {
            followUpNumber: "",
            description: "",
        },
    });

    const description = watch("description") ?? "";
    const isBusy = isCheckingEligibility || isCreatingComplaint;

    const getApiMessage = (error: unknown): string | null => {
        if (
            typeof error === "object" &&
            error !== null &&
            "data" in error
        ) {
            const data = error.data as {
                messageEn?: string | null;
                messageAr?: string | null;
            };

            return (
                (isArabic ? data.messageAr : data.messageEn) ??
                null
            );
        }

        return null;
    };

    const onSubmit: SubmitHandler<ComplaintFormValues> = async (values) => {
        setFailedMessage(null);
        setSuccessMessage(null);

        try {
            const eligibility = await checkEligibility().unwrap();

            if (!eligibility.succeeded || !eligibility.result) {
                setFailedMessage(
                    eligibility[`message${language}`] ||
                    sentences.EligibilityError[language]
                );
                setOpenAlert(true);
                return;
            }

            const response = await createComplaint({
                followUpNumber: values.followUpNumber.trim(),
                description: values.description.trim(),
            }).unwrap();

            if (!response.succeeded) {
                setFailedMessage(
                    response[`message${language}`] ||
                    sentences.GenericError[language]
                );
                setOpenAlert(true);
                return;
            }

            setSuccessMessage(
                response[`message${language}`] ||
                sentences.CreateSuccess[language]
            );
            setOpenAlert(true);
            reset();
        } catch (error) {
            setFailedMessage(
                getApiMessage(error) || sentences.GenericError[language]
            );
            setOpenAlert(true);
        }
    };

    return (
        <>
            <Paper >
                {/* <Paper sx={styles.formPaper}> */}
                <Box sx={styles.header}>
                    <Box>
                        <Typography variant='h2'>{sentences.CreateTitle[language]}</Typography>
                        <Typography variant="body1">{sentences.CreateDescription[language]}</Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        sx={{
                            ...styles.ButtonBase,
                            ...styles.navigateButton
                        }}
                        onClick={() => navigate("/complaints")}
                    >
                        {sentences.History[language]}
                    </Button>


                </Box>

                <Typography
                    component="form"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 2, mt: 3 }}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {errorMessage && (
                        <Alert severity="error" sx={{ color: "error.main" }}>
                            {errorMessage}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" sx={{ color: "success.main" }}>
                            {successMessage}
                        </Alert>
                    )}

                    <Box>
                        <InputLabel htmlFor="followUpNumber">{sentences.FollowUpNumber[language]}<span>*</span></InputLabel>
                        <Controller
                            name="followUpNumber"
                            control={control}
                            render={({ field }) => (
                                <MuiPhone
                                    defaultCountry="sd"
                                    value={field.value ?? ""}
                                    withCountries={false}
                                    onChange={(value) => field.onChange(value ?? "")}
                                />
                            )}
                        />

                        {errors.followUpNumber && (
                            <FormHelperText error>
                                {errors.followUpNumber.message}
                            </FormHelperText>
                        )}
                    </Box>

                    <Box>
                        <InputLabel htmlFor="description">{sentences.Description[language]}<span>*</span></InputLabel>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <OutlinedInput
                                    {...field}
                                    id="description"
                                    multiline
                                    minRows={3}
                                    inputProps={{ maxLength: 300 }}
                                    placeholder={sentences.DescriptionPlaceholder[language]}
                                    error={!!errors.description}
                                    sx={{ width: "100%", py: 0 }}
                                />
                            )}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            {errors.description ? (
                                <FormHelperText error>
                                    {errors.description.message}
                                </FormHelperText>
                            ) : (
                                <Box />
                            )}

                            <Typography variant="caption" color="text.secondary">
                                {description.length}/300
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        loading={isBusy}
                        sx={styles.submitButton(theme)}
                    >
                        {isBusy
                            ? sentences.Submitting[language]
                            : sentences.Submit[language]}
                    </Button>
                </Typography>
            </Paper>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={openAlert}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={successMessage ? "success" : "error"}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {successMessage || failedMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ComplaintForm;
