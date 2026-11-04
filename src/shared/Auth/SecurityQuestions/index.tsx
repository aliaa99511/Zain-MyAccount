
import React, { useContext, useEffect, useMemo } from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    Controller,
    useForm,
    useWatch,
    type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { security_questions_sentences as sentences } from "../../../configurations/language";
import { securityQuestionsStyles as defaultStyles } from "./securityQuestionsStyles";
import { createSecurityQuestionsSchema } from "./securityQuestionsSchema";
import { useForm as useRecoveryForm } from "react-hook-form";
import type {
    ChallengeQuestion,
    RecoveryAnswer,
    SecurityAnswer,
    SecurityQuestionSet,
    SecurityQuestionsLabels,
    SecurityQuestionsProps,
    SecurityQuestionsValues,
} from "./securityQuestions.types";
import { LanguageContext } from "../../../App";

type RecoveryFormValues = {
    answers: Record<string, string>;
    captchaAnswer: string;
};

const getQuestionValue = (
    questionSetId: string,
    questionId: string,
) => `${questionSetId}:${questionId}`;

const SecurityQuestions: React.FC<SecurityQuestionsProps> = (props) => {
    const {
        questionCount = 3,
        answerMaxLength = 32,
        labels: customLabels,
        questionsResponse,
        isLoading,
        isError,
        onRetry,
        onError,
        styles = defaultStyles,
        showHeader = true,
        recoveryQuestions = [],
        captchaImage = "",
        onRefreshCaptcha,
    } = props;

    const isContainedCaptha = props.isContainedCaptha;
    const theme = useTheme();
    const context = useContext(LanguageContext);
    const language = context?.language ?? "En";

    const questionSets = useMemo<SecurityQuestionSet[]>(() => {
        return [...(questionsResponse?.result ?? [])].sort((a, b) =>
            a.questionSetId.localeCompare(b.questionSetId),
        );
    }, [questionsResponse]);

    const labels = useMemo<SecurityQuestionsLabels>(() => {
        const isArabic = language === "Ar";

        return {
            title: sentences.SecurityQuestions[language],
            description: sentences.SecurityQuestionsDescription[language],
            questionLabel: sentences.Question[language],
            answerLabel: sentences.Answer[language],
            selectQuestion: sentences.SelectSecurityQuestion[language],
            enterAnswer: sentences.EnterYourAnswer[language],
            proceed: sentences.ProceedToNext[language],
            loading: isArabic ? "جارٍ تحميل الأسئلة..." : "Loading questions...",
            retry: isArabic ? "إعادة المحاولة" : "Retry",
            loadError: isArabic
                ? "تعذر تحميل أسئلة الأمان. حاول مرة أخرى."
                : "Could not load security questions. Please try again.",
            insufficientQuestions: isArabic
                ? "لم يتم إرجاع مجموعات أسئلة كافية من الخادم."
                : "The server did not return enough question sets.",
            questionRequired: sentences.QuestionRequired[language],
            answerRequired: sentences.AnswerRequired[language],
            answerMaxLength: sentences.AnswerMaxLength[language],
            noSpecialCharacters: sentences.NoSpecialCharacters[language],
            differentQuestionRequired:
                sentences.DifferentQuestionRequired[language],
            ...customLabels,
        };
    }, [language, customLabels]);

    const schema = useMemo(
        () =>
            createSecurityQuestionsSchema({
                questionCount,
                answerMaxLength,
                labels,
            }),
        [questionCount, answerMaxLength, labels],
    );

    const defaultValues = useMemo<SecurityQuestionsValues>(() => {
        const values: SecurityQuestionsValues = {};

        for (let i = 1; i <= questionCount; i++) {
            values[`question${i}`] = "";
            values[`answer${i}`] = "";
        }

        return values;
    }, [questionCount]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SecurityQuestionsValues>({
        resolver: zodResolver(schema) as Resolver<SecurityQuestionsValues>,
        mode: "onChange",
        defaultValues,
    });

    const values = useWatch({ control }) ?? defaultValues;

    const getQuestionLabel = (
        questions: ChallengeQuestion[],
    ): string => {
        const preferredLocale = language === "Ar" ? "ar" : "en_US";

        return (
            questions.find(
                (item) =>
                    item.locale.toLowerCase() ===
                    preferredLocale.toLowerCase(),
            )?.question ??
            questions[0]?.question ??
            ""
        );
    };

    const getAvailableOptions = (
        questionNumber: number,
        currentValue: string,
    ) => {
        const questionSet = questionSets[questionNumber - 1];

        if (!questionSet) return [];

        const questionsById = new Map<string, ChallengeQuestion[]>();

        questionSet.questions.forEach((question) => {
            const existing = questionsById.get(question.questionId) ?? [];
            questionsById.set(question.questionId, [...existing, question]);
        });

        const selectedValues = Array.from(
            { length: questionCount },
            (_, index) => values[`question${index + 1}`] ?? "",
        );

        return Array.from(questionsById.entries())
            .map(([questionId, translations]) => ({
                value: getQuestionValue(
                    questionSet.questionSetId,
                    questionId,
                ),
                label: getQuestionLabel(translations),
            }))
            .filter(
                (option) =>
                    option.value === currentValue ||
                    !selectedValues.includes(option.value),
            );
    };

    const submitHandler = (data: SecurityQuestionsValues) => {
        const answers: SecurityAnswer[] = [];

        for (let i = 1; i <= questionCount; i++) {
            const selection = data[`question${i}`] ?? "";
            const answer = data[`answer${i}`] ?? "";
            const [questionSetId, questionId] = selection.split(":");

            const questionSet = questionSets.find(
                (set) => set.questionSetId === questionSetId,
            );

            const translations =
                questionSet?.questions.filter(
                    (item) => item.questionId === questionId,
                ) ?? [];

            answers.push({
                questionSetId,
                questionId,
                question: getQuestionLabel(translations),
                answer: answer.trim(),
            });
        }

        if (props.isContainedCaptha) {
            return;
        }

        props.onSubmit(answers);
    };

    const renderQuestion = (questionNumber: number) => {
        const questionName = `question${questionNumber}`;
        const answerName = `answer${questionNumber}`;

        const questionSet = questionSets[questionNumber - 1];

        const questionError = errors[questionName]?.message;
        const answerError = errors[answerName]?.message;

        return (
            <Box key={questionNumber} sx={styles.questionContainer}>
                <InputLabel
                    id={`${questionName}-label`}
                    sx={styles.questionLabel(theme, language)}
                >
                    {labels.questionLabel} {questionNumber}
                    <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                        *
                    </Box>
                </InputLabel>

                <FormControl
                    fullWidth
                    error={Boolean(questionError)}
                    sx={styles.selectControl}
                >
                    <Controller
                        name={questionName}
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                id={questionName}
                                labelId={`${questionName}-label`}
                                displayEmpty
                                input={<OutlinedInput />}
                                disabled={!questionSet || isLoading}
                                renderValue={(value) => {
                                    if (!value) {
                                        return (
                                            <Typography color="text.secondary">
                                                {labels.selectQuestion}
                                            </Typography>
                                        );
                                    }

                                    const option = getAvailableOptions(
                                        questionNumber,
                                        field.value,
                                    ).find((item) => item.value === value);

                                    const selectedQuestion =
                                        questionSet?.questions.find(
                                            (item) =>
                                                getQuestionValue(
                                                    questionSet.questionSetId,
                                                    item.questionId,
                                                ) === value,
                                        );

                                    return (
                                        option?.label ??
                                        (selectedQuestion
                                            ? getQuestionLabel([selectedQuestion])
                                            : String(value))
                                    );
                                }}
                            >
                                <MenuItem value="" disabled>
                                    {labels.selectQuestion}
                                </MenuItem>

                                {getAvailableOptions(
                                    questionNumber,
                                    field.value,
                                ).map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        sx={styles.selectMenuItem}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />

                    {questionError && (
                        <FormHelperText sx={styles.helperText}>
                            {String(questionError)}
                        </FormHelperText>
                    )}
                </FormControl>

                <InputLabel
                    htmlFor={answerName}
                    sx={styles.questionLabel(theme, language)}
                >
                    {labels.answerLabel}
                    <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                        *
                    </Box>
                </InputLabel>

                <FormControl
                    fullWidth
                    error={Boolean(answerError)}
                    sx={styles.answerControl}
                >
                    <Controller
                        name={answerName}
                        control={control}
                        render={({ field }) => (
                            <OutlinedInput
                                {...field}
                                id={answerName}
                                placeholder={labels.enterAnswer}
                                inputProps={{
                                    maxLength: answerMaxLength,
                                    "aria-label":
                                        `${labels.answerLabel} ${questionNumber}`,
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Box sx={styles.answerCounter(theme)}>
                                            <Box
                                                sx={styles.answerCounterValue(theme)}
                                            >
                                                {field.value.length}
                                            </Box>
                                            /{answerMaxLength}
                                        </Box>
                                    </InputAdornment>
                                }
                            />
                        )}
                    />

                    {answerError && (
                        <FormHelperText sx={styles.helperText}>
                            {String(answerError)}
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>
        );
    };

    const {
        control: recoveryControl,
        register: registerRecovery,
        handleSubmit: handleRecoverySubmit,
        reset: resetRecovery,
        formState: {
            errors: recoveryErrors,
            isSubmitting: isSubmittingRecovery,
        },
    } = useRecoveryForm<RecoveryFormValues>({
        defaultValues: {
            answers: {},
            captchaAnswer: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        resetRecovery({
            answers: Object.fromEntries(
                recoveryQuestions.map((_, index) => [
                    String(index),
                    "",
                ]),
            ),
            captchaAnswer: "",
        });
    }, [recoveryQuestions, resetRecovery]);

    if (isContainedCaptha) {
        const submitRecovery = async (data: RecoveryFormValues) => {
            const captchaAnswer = data.captchaAnswer?.trim() ?? "";

            if (!captchaAnswer) {
                console.error("CAPTCHA is empty in form data");
                return;
            }

            const answers: RecoveryAnswer[] = recoveryQuestions.map(
                (question, index) => ({
                    questionSetId: question.questionSetId,
                    answer: data.answers[String(index)]?.trim() ?? "",
                }),
            );

            await props.onSubmit(answers, captchaAnswer);
        };

        if (isLoading && recoveryQuestions.length === 0) {
            return <Typography>{labels.loading}</Typography>;
        }

        if (isError) {
            return (
                <Alert
                    sx={{
                        color: "error.main",
                    }}
                    severity="error"
                    action={
                        <Button color="inherit" onClick={onRetry}>
                            {labels.retry}
                        </Button>
                    }
                >
                    {labels.loadError}
                </Alert>
            );
        }

        if (recoveryQuestions.length === 0) {
            return (
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" onClick={onRetry}>
                            {labels.retry}
                        </Button>
                    }
                    sx={{
                        color: "error.main",
                    }}
                >
                    {labels.loadError}
                </Alert>
            );
        }

        return (
            <Box sx={styles.container}>
                {showHeader && (
                    <Box sx={styles.header}>
                        <Typography variant="h1" sx={styles.title(theme)}>
                            {labels.title}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={styles.description(theme, language)}
                        >
                            {labels.description}
                        </Typography>
                    </Box>
                )}

                <Box
                    component="form"
                    onSubmit={handleRecoverySubmit(submitRecovery, onError)}
                    noValidate
                    sx={styles.form}
                >
                    <Box sx={styles.questionsContainer}>
                        {recoveryQuestions.map((question, index) => {
                            const answerFieldName = `answers.${index}` as const;

                            return (
                                <Box
                                    key={question.questionSetId}
                                    sx={styles.questionContainer}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={styles.questionLabel(theme, language)}
                                    >
                                        {question.text}
                                        <Box
                                            component="span"
                                            sx={{ color: "error.main", ml: 0.5 }}
                                        >
                                            *
                                        </Box>
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        required
                                        disabled={isLoading || isSubmittingRecovery}
                                        placeholder={labels.enterAnswer}
                                        error={Boolean(
                                            recoveryErrors.answers?.[index]?.message
                                        )}
                                        helperText={
                                            recoveryErrors.answers?.[index]?.message
                                        }
                                        slotProps={{
                                            htmlInput: {
                                                maxLength: answerMaxLength,
                                            },
                                        }}
                                        {...registerRecovery(answerFieldName, {
                                            required: labels.answerRequired,
                                            maxLength: {
                                                value: answerMaxLength,
                                                message: labels.answerMaxLength,
                                            },
                                            validate: (value) =>
                                                Boolean(value?.trim()) ||
                                                labels.answerRequired,
                                        })}
                                    />
                                </Box>
                            );
                        })}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        {captchaImage ? (
                            <Box
                                component="img"
                                src={
                                    captchaImage.startsWith("data:")
                                        ? captchaImage
                                        : `data:image/png;base64,${captchaImage}`
                                }
                                alt="CAPTCHA"
                                sx={{
                                    display: "block",
                                    maxWidth: "100%",
                                    width: "10rem",
                                    height: "4.188rem",
                                    objectFit: "contain",
                                    mb: 1,
                                }}
                            />
                        ) : (
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                {sentences.CaptchaImageUnavailable[language]}
                            </Typography>
                        )}

                        <Button
                            type="button"
                            onClick={() => void onRefreshCaptcha?.()}
                            disabled={isLoading || isSubmittingRecovery}
                            variant="text"
                            sx={styles.CaptchaButton}
                        >
                            {language === "Ar" ? "إنشاء صورة جديدة" : "Generate new image"}
                        </Button>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={styles.questionLabel(theme, language)}
                            >
                                {sentences.CaptchaLabel[language]}
                            </Typography>

                            <Controller
                                name="captchaAnswer"
                                control={recoveryControl}
                                rules={{
                                    required: sentences.CaptchaRequired[language],
                                    validate: (value) =>
                                        Boolean(value?.trim()) ||
                                        sentences.CaptchaRequired[language],
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        required
                                        value={field.value ?? ""}
                                        error={Boolean(error)}
                                        helperText={error?.message}
                                        disabled={isLoading || isSubmittingRecovery}
                                        onChange={(event) => {
                                            field.onChange(event.target.value);
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </Box>

                    <Box sx={styles.submitContainer}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading || isSubmittingRecovery}
                            sx={styles.submitButton(theme)}
                        >
                            {labels.proceed}
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (isLoading) {
        return <Typography>{labels.loading}</Typography>;
    }

    if (isError) {
        return (
            <Alert
                severity="error"
                sx={{
                    color: "error.main",
                }}
                action={
                    <Button color="inherit" onClick={onRetry}>
                        {labels.retry}
                    </Button>
                }
            >
                {labels.loadError}
            </Alert>
        );
    }

    if (questionSets.length < questionCount) {
        return (
            <Alert severity="error"
                sx={{
                    color: "error.main",
                }}
            >
                {labels.insufficientQuestions}
            </Alert>
        );
    }

    return (
        <Box sx={styles.container}>
            {showHeader && (
                <Box sx={styles.header}>
                    <Typography variant="h1" sx={styles.title(theme)}>
                        {labels.title}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={styles.description(theme, language)}
                    >
                        {labels.description}
                    </Typography>
                </Box>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit(submitHandler, onError)}
                noValidate
                sx={styles.form}
            >
                <Box sx={styles.questionsContainer}>
                    {Array.from(
                        { length: questionCount },
                        (_, index) => renderQuestion(index + 1),
                    )}
                </Box>

                <Box sx={styles.submitContainer}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={styles.submitButton(theme)}
                    >
                        {labels.proceed}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default SecurityQuestions;
