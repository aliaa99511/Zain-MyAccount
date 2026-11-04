
export type ChallengeQuestion = {
    locale: string;
    question: string;
    questionId: string;
};

export type SecurityQuestionSet = {
    questionSetId: string;
    questions: ChallengeQuestion[];
};

export type SecurityAnswer = {
    questionSetId: string;
    questionId: string;
    question: string;
    answer: string;
};

export type SecurityQuestionField = {
    question: string;
    answer: string;
};

export type SecurityQuestionsValues = Record<
    string,
    string
>;

export type SecurityQuestionsLabels = {
    title: string;
    description: string;
    questionLabel: string;
    answerLabel: string;
    selectQuestion: string;
    enterAnswer: string;
    proceed: string;
    loading: string;
    retry: string;
    loadError: string;
    insufficientQuestions: string;
    questionRequired: string;
    answerRequired: string;
    answerMaxLength: string;
    noSpecialCharacters: string;
    differentQuestionRequired: string;
};

export type RecoveryQuestion = {
    questionSetId: string;
    text: string;
};

export type RecoveryAnswer = {
    questionSetId: string;
    answer: string;
};

export type ChallengeQuestionsResponse = {
    result: SecurityQuestionSet[];
};

export type SecurityQuestionsBaseProps = {
    questionCount?: number;
    answerMaxLength?: number;
    labels?: Partial<SecurityQuestionsLabels>;
    questionsResponse?: {
        result?: SecurityQuestionSet[] | null;
    };
    isLoading: boolean;
    isError: boolean;
    onRetry?: () => void;
    onError?: (errors: unknown) => void;
    styles?: typeof import("./securityQuestionsStyles").securityQuestionsStyles;
    showHeader?: boolean;
    recoveryQuestions?: RecoveryQuestion[];
    captchaImage?: string;
    onRefreshCaptcha?: () => void | Promise<void>;
};

export type SecurityQuestionsProps = | (SecurityQuestionsBaseProps & {
    isContainedCaptha: true;
    onSubmit: (
        answers: RecoveryAnswer[],
        captchaAnswer?: string
    ) => void | Promise<void>;
})
    | (SecurityQuestionsBaseProps & {
        isContainedCaptha?: false;
        onSubmit: (
            answers: SecurityAnswer[]
        ) => void | Promise<void>;
    });