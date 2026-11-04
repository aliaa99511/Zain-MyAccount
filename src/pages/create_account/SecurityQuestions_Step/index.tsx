
import React from "react";
import SecurityQuestions from "../../../shared/Auth/SecurityQuestions";
import type { SecurityAnswer } from "../../../shared/Auth/SecurityQuestions/securityQuestions.types";
import { useGetChallengeQuestionsQuery } from "../../../store";

type SecurityQuestionsStepProps = {
    onNext: (answers: SecurityAnswer[]) => void;
};

const SecurityQuestionsStep: React.FC<SecurityQuestionsStepProps> = ({
    onNext,
}) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useGetChallengeQuestionsQuery();

    const handleSubmit = (answers: SecurityAnswer[]) => {
        onNext(answers);
    };

    return (
        <SecurityQuestions
            questionCount={3}
            answerMaxLength={32}
            questionsResponse={response}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onSubmit={handleSubmit}
        />
    );
};

export default SecurityQuestionsStep;
