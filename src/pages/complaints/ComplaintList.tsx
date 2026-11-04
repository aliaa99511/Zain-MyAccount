
import { useContext, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router";
import { LanguageContext } from "../../App";
import { complaints_sentences as sentences } from "../../configurations/language";
import { useGetComplaintsQuery } from "../../store";
import { complaintsStyles as styles } from "./complaintStyles";
import type { ComplaintsFilterParams } from "./Types";
import { ComplaintsTable } from "./ComplaintsTable";
import { ComplaintsFilterDialog } from "./ComplaintsFilterDialog";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PageLoader from "../../shared/Loading/PageLoader";

const PAGE_SIZE = 10;

function ComplaintsList(): React.ReactElement {
    const context = useContext(LanguageContext);
    const language = context?.language === "Ar" ? "Ar" : "En";
    const isArabic = language === "Ar";

    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState("");
    const [statusInput, setStatusInput] = useState("");
    const [dateFromInput, setDateFromInput] = useState("");
    const [dateToInput, setDateToInput] = useState("");
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    const [filters, setFilters] = useState<ComplaintsFilterParams>({
        PageIndex: 1,
        PageSize: PAGE_SIZE,
    });

    const queryParams = useMemo(() => filters,
        [filters]
    );

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetComplaintsQuery(queryParams);

    const complaints = data?.result?.items ?? [];
    const totalPages = data?.result?.pages ?? 0;
    const total = data?.result?.total ?? 0;

    const applyFilters = () => {
        setFilters({
            Search: searchInput.trim() || undefined,
            Status: statusInput ? Number(statusInput) : undefined,
            DateFrom: dateFromInput
                ? new Date(`${dateFromInput}T00:00:00`).toISOString()
                : undefined,
            DateTo: dateToInput
                ? new Date(`${dateToInput}T23:59:59`).toISOString()
                : undefined,
            PageIndex: 1,
            PageSize: PAGE_SIZE,
        });

        setFilterDialogOpen(false);
    };

    const clearFilters = () => {
        setStatusInput("");
        setDateFromInput("");
        setDateToInput("");

        setFilters({
            Search: searchInput.trim() || undefined,
            PageIndex: 1,
            PageSize: PAGE_SIZE,
        });
    };

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        page: number
    ) => {
        setFilters((previous) => ({
            ...previous,
            PageIndex: page,
        }));
    };

    if (isLoading) {
        return <PageLoader />;
    }

    if (isError || data?.succeeded === false) {
        return (
            <Alert severity="error" sx={{ color: "error.main" }}>
                {data?.[`message${language}`] ||
                    sentences.ErrorLoading[language]}
                <Button onClick={() => refetch()} sx={{ ml: 1 }}>
                    {isArabic ? "إعادة المحاولة" : "Retry"}
                </Button>
            </Alert>
        );
    }

    return (
        <>
            <Paper sx={{ p: { xs: 1, sm: 2 } }}>
                <Box sx={styles.header}>
                    <Box>
                        <Typography variant="h2">{sentences.ListTitle[language]}</Typography>
                        <Typography variant="body1">{sentences.ListDescription[language]}</Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        sx={{
                            ...styles.ButtonBase,
                            ...styles.navigateButton
                        }}
                        onClick={() => navigate("/create-complaints")}
                    >
                        {sentences.SubmitNew[language]}
                    </Button>
                </Box>
                <Paper
                    elevation={0}
                    sx={{
                        mt: 2,
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            sx={styles.inputSearch}
                            placeholder={sentences.SearchPlaceholder[language]}
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") applyFilters();
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon
                                                sx={{
                                                    color: "#B8B8B8",
                                                    fontSize: 20,
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Button
                            variant="outlined"
                            startIcon={<FilterAltOutlinedIcon />}
                            onClick={() => setFilterDialogOpen(true)}
                            sx={{
                                ...styles.ButtonBase,
                                ...styles.filterButton,
                            }}
                        >
                            {isArabic ? "تصفية" : "Filter by"}
                        </Button>
                    </Box>
                    <ComplaintsTable
                        complaints={complaints}
                        language={language}
                        isFetching={isFetching}
                        pageIndex={filters.PageIndex}
                        totalPages={totalPages}
                        total={total}
                        onPageChange={handlePageChange}
                    />

                </Paper>
            </Paper>
            <ComplaintsFilterDialog
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                language={language}
                status={statusInput}
                dateFrom={dateFromInput}
                dateTo={dateToInput}
                onStatusChange={setStatusInput}
                onDateFromChange={setDateFromInput}
                onDateToChange={setDateToInput}
                onApply={() => {
                    applyFilters();
                    setFilterDialogOpen(false);
                }}
                onClear={clearFilters}
            />
        </>
    );
}

export default ComplaintsList;
