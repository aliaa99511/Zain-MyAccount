import { z } from "zod";
import type {
    SecurityQuestionsLabels,
} from "./securityQuestions.types";

type SecurityQuestionsSchemaConfig = {
    questionCount: number;
    answerMaxLength: number;
    labels: SecurityQuestionsLabels;
};

export const createSecurityQuestionsSchema = ({
    questionCount,
    answerMaxLength,
    labels,
}: SecurityQuestionsSchemaConfig) => {
    return z
        .record(z.string(), z.string())
        .superRefine((data, ctx) => {
            const selectedQuestions: string[] = [];

            for (let i = 1; i <= questionCount; i++) {
                const questionName = `question${i}`;
                const answerName = `answer${i}`;

                const question = data[questionName] ?? "";
                const answer = (data[answerName] ?? "").trim();

                if (!question) {
                    ctx.addIssue({
                        code: "custom",
                        path: [questionName],
                        message: labels.questionRequired,
                    });
                }

                if (!answer) {
                    ctx.addIssue({
                        code: "custom",
                        path: [answerName],
                        message: labels.answerRequired,
                    });
                } else if (answer.length > answerMaxLength) {
                    ctx.addIssue({
                        code: "custom",
                        path: [answerName],
                        message: labels.answerMaxLength,
                    });
                } else if (!/^[\p{L}\p{N} ]+$/u.test(answer)) {
                    ctx.addIssue({
                        code: "custom",
                        path: [answerName],
                        message: labels.noSpecialCharacters,
                    });
                }

                if (question) {
                    if (selectedQuestions.includes(question)) {
                        ctx.addIssue({
                            code: "custom",
                            path: [questionName],
                            message: labels.differentQuestionRequired,
                        });
                    }

                    selectedQuestions.push(question);
                }
            }
        });
};