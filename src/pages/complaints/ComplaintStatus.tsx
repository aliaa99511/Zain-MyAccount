import { Chip } from "@mui/material";
import { complaints_sentences as sentences } from "../../configurations/language";

interface ComplaintStatusProps {
    status: string;
    language: "En" | "Ar";
}

export function ComplaintStatus({
    status,
    language,
}: ComplaintStatusProps) {
    const isCompleted = status === "Completed";

    const label = isCompleted
        ? sentences.Completed[language]
        : status === "InProgress"
            ? sentences.InProgress[language]
            : status;

    return (
        <Chip
            label={label}
            color={isCompleted ? "success" : "warning"}
            variant="filled"
            size="small"
        />
    );
}