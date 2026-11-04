import { useContext } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { useParams } from "react-router";

import { LanguageContext } from "../../App";
import { complaints_sentences as sentences } from "../../configurations/language";
import { useGetComplaintByIdQuery } from "../../store";
import { complaintsStyles as styles } from "./complaintStyles";
import { ComplaintStatus } from "./ComplaintStatus";
import PageLoader from "../../shared/Loading/PageLoader";

function ComplaintDetails(): React.ReactElement {
    const context = useContext(LanguageContext);
    const language = context?.language === "Ar" ? "Ar" : "En";

    const { complaintId = "" } = useParams();

    const {
        data,
        isLoading,
        isError,
    } = useGetComplaintByIdQuery(complaintId, {
        skip: !complaintId,
    });

    const complaint = data?.result;

    if (isLoading) {
        return <PageLoader />;
    }

    if (isError || !complaint || data?.succeeded === false) {
        return (
            <Alert severity="error">
                {data?.[`message${language}`] ||
                    sentences.ErrorLoading[language]}
            </Alert>
        );
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            {/* Complaint Header */}
            <Typography
                variant="h2"
                sx={{ fontWeight: 700, mb: 3 }}
            >
                {sentences.ComplaintId[language]}{" "}
                <Box
                    component="span"
                    sx={styles.complaintLink}
                >
                    #{complaint.complaintId}
                </Box>
            </Typography>

            {/* Complaint Information Card */}
            <Card
                variant="outlined"
                sx={{
                    padding: "1rem",
                    borderRadius: 2,
                    boxShadow: "none",
                }}
            >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 3 } }}>
                    <Stack spacing={1}>
                        {/* Description */}
                        <Box>
                            <Typography
                                variant="body2"
                                sx={styles.detailLabel}
                            >
                                {sentences.Description[language]}
                            </Typography>

                            <Box sx={styles.detailsDescription}>
                                {complaint.description}
                            </Box>
                        </Box>

                        {/* Complaint Details */}
                        <Box sx={styles.detailsGrid}>
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={styles.detailLabel}
                                >
                                    {sentences.SubmissionDate[language]}
                                </Typography>

                                <Typography sx={styles.detailValue}>
                                    {complaint.creationDate}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={styles.detailLabel}
                                >
                                    {sentences.SubmissionTime[language]}
                                </Typography>

                                <Typography sx={styles.detailValue}>
                                    {complaint.creationTime}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={styles.detailLabel}
                                >
                                    {sentences.FollowUpNumber[language]}
                                </Typography>

                                <Typography sx={styles.detailValue}>
                                    {complaint.followUpNumber}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={styles.detailLabel}
                                >
                                    {sentences.Status[language]}
                                </Typography>

                                <ComplaintStatus
                                    status={complaint.status}
                                    language={language}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Paper>
    );
}

export default ComplaintDetails;