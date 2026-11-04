import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { useEffect } from "react";

import { complaints_sentences as sentences } from "../../configurations/language";
import { useDialog } from "../../shared/dialog/hooks/useDialog";
import type { CustomDialogConfig } from "../../shared/dialog/types";

const STATUS_FILTER = {
    InProgress: 1,
    Completed: 2,
} as const;

interface ComplaintsFilterDialogProps {
    open: boolean;
    onClose: () => void;
    language: "En" | "Ar";
    status: string;
    dateFrom: string;
    dateTo: string;
    onStatusChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
}

export function ComplaintsFilterDialog({
    open,
    language,
    status,
    dateFrom,
    dateTo,
    onStatusChange,
    onDateFromChange,
    onDateToChange,
    onApply,
    onClear,
}: ComplaintsFilterDialogProps) {
    const isArabic = language === "Ar";
    const { customDialog, closeDialog } = useDialog();

    const content = (
        <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {sentences.Status[language]}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={status === ""}
                            onChange={() => onStatusChange("")}
                            size="small"
                        />
                    }
                    label={sentences.All[language]}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={status === String(STATUS_FILTER.InProgress)}
                            onChange={() =>
                                onStatusChange(
                                    status === String(STATUS_FILTER.InProgress)
                                        ? ""
                                        : String(STATUS_FILTER.InProgress)
                                )
                            }
                            size="small"
                        />
                    }
                    label={sentences.InProgress[language]}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={status === String(STATUS_FILTER.Completed)}
                            onChange={() =>
                                onStatusChange(
                                    status === String(STATUS_FILTER.Completed)
                                        ? ""
                                        : String(STATUS_FILTER.Completed)
                                )
                            }
                            size="small"
                        />
                    }
                    label={sentences.Completed[language]}
                />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                {isArabic ? "التاريخ" : "Date"}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label={sentences.DateFrom[language]}
                    value={dateFrom}
                    onChange={(event) => onDateFromChange(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label={sentences.DateTo[language]}
                    value={dateTo}
                    onChange={(event) => onDateToChange(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </Box>
        </Box>
    );

    const actions = (
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            <Button
                fullWidth
                variant="contained"
                onClick={() => {
                    onApply();
                    closeDialog();
                }}
            >
                {isArabic ? "تطبيق الفلاتر" : "Apply Filters"}
            </Button>

            <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                    onClear();
                    closeDialog();
                }}
            >
                {sentences.ClearFilters[language]}
            </Button>
        </Box>
    );

    useEffect(() => {
        if (!open) return;

        const config: CustomDialogConfig = {
            type: "custom",
            title: isArabic ? "تصفية حسب" : "Filter by",
            content,
            actions,
            width: "xs",
            fullWidth: true,
            closeOnBackdrop: true,
        };

        void customDialog(config);
    }, [open]);

    return null;
}