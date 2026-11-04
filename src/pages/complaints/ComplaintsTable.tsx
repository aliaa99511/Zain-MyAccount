import {
    Box,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { complaints_sentences as sentences } from "../../configurations/language";
import { complaintsStyles as styles } from "./complaintStyles";
import type { Complaint } from "./Types";
import { ComplaintStatus } from "./ComplaintStatus";
import PageLoader from "../../shared/Loading/PageLoader";

interface ComplaintsTableProps {
    complaints: Complaint[];
    language: "En" | "Ar";
    isFetching: boolean;
    pageIndex: number;
    totalPages: number;
    total: number;
    onPageChange: (
        event: React.ChangeEvent<unknown>,
        page: number
    ) => void;
}

export function ComplaintsTable({
    complaints,
    language,
    isFetching,
    pageIndex,
    totalPages,
    onPageChange,
}: ComplaintsTableProps) {
    const isArabic = language === "Ar";

    if (isFetching) {
        return <PageLoader />;
    }

    return (
        <Box sx={{ position: "relative" }}>
            <TableContainer sx={styles.tableContainer}>
                <Table sx={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{sentences.ComplaintId[language]}</TableCell>
                            <TableCell>{sentences.FollowUpNumber[language]}</TableCell>
                            <TableCell>{sentences.Description[language]}</TableCell>
                            <TableCell>{sentences.CreationDate[language]}</TableCell>
                            <TableCell>{sentences.CreationTime[language]}</TableCell>
                            <TableCell>{sentences.Status[language]}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {complaints.map((complaint) => (
                            <TableRow key={complaint.complaintId} hover>
                                <TableCell>
                                    <RouterLink
                                        to={`/complaints/${complaint.complaintId}`}
                                        style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={styles.complaintLink}
                                        >
                                            #{complaint.complaintId}
                                        </Box>
                                    </RouterLink>
                                </TableCell>

                                <TableCell>{complaint.followUpNumber}</TableCell>

                                <TableCell>
                                    {complaint.description.length > 60
                                        ? `${complaint.description.slice(0, 60)}...`
                                        : complaint.description}
                                </TableCell>

                                <TableCell>{complaint.creationDate}</TableCell>
                                <TableCell>{complaint.creationTime}</TableCell>

                                <TableCell>
                                    <ComplaintStatus
                                        status={complaint.status}
                                        language={language}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}

                        {complaints.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    {sentences.NoComplaints[language]}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                    mt: 3,
                }}
            >
                {/* Left: Pagination */}
                <Pagination
                    count={totalPages}
                    page={pageIndex}
                    onChange={onPageChange}
                    color="primary"
                    shape="rounded"
                    dir="ltr"
                    sx={styles.pagination}
                />

                {/* Right: Results Count */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: "auto" }}
                >
                    {isArabic
                        ? `عرض ${complaints.length} نتائج`
                        : `Showing ${complaints.length} results`}
                </Typography>
            </Box>
            {/* <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                    mt: 3,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {isArabic
                        ? `عرض ${complaints.length} من ${total} شكوى`
                        : `Showing ${complaints.length} results`}
                </Typography>

                {totalPages > 1 && (
                    <Pagination
                        count={totalPages}
                        page={pageIndex}
                        onChange={onPageChange}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                        dir="ltr"
                    />
                )}
            </Box> */}
        </Box>
    );
}