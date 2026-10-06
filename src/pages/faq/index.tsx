
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Box,
    InputAdornment,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { LanguageContext } from "../../App";
import {
    useGetGroupInfoQuery,
    useGetFAQsBySegmentQuery,
    useGetGroupedQuery,
} from "../../store";
import type { FAQSegment } from "../../store/apis/faqs_api";
import FAQCategories from "./FAQCategories";
import FAQAccordion from "./FAQAccordion";
import { faqMatchesSearch } from "./faq_utils";
import FAQSkeleton from "./FAQSkeleton";
import { faqs_sentences } from "../../configurations/language/pages/FAQs";

// interface FAQsProps {
//     segment: FAQSegment;
// }

{/* <FAQs segment="B2C_Prepaid" /> */ }

let segment: FAQSegment = "B2C_Prepaid";

// function FAQs({ segment }: FAQsProps): React.ReactElement {
function FAQs(): React.ReactElement {
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language === "Ar" ? "Ar" : "En";
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // 1. Get category information for the segment.
    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetGroupInfoQuery(segment);

    // 2. Get all FAQ groups and questions for the segment.
    const {
        data: allFAQGroups = [],
        isLoading: isAllFAQsLoading,
        isError: isAllFAQsError,
    } = useGetFAQsBySegmentQuery(segment);

    // 3. Only request a category when one is selected.
    // When selectedCategory is null, this request is skipped.
    const {
        currentData: selectedFAQGroups = [],
        isFetching: isSelectedFAQsLoading,
        isError: isSelectedFAQsError,
    } = useGetGroupedQuery(selectedCategory ?? "", {
        skip: !selectedCategory,
    });

    // Reset selection and search when the segment changes.
    useEffect(() => {
        setSelectedCategory(null);
        setSearch("");
    }, [segment]);

    const sortedCategories = useMemo(
        () =>
            [...categories].sort(
                (a, b) => a.sortOrder - b.sortOrder
            ),
        [categories]
    );

    // Use the segment's complete response initially.
    // When a category is selected, use GetGrouped's response.
    const faqItems = useMemo(() => {
        const groups = selectedCategory ? selectedFAQGroups : allFAQGroups;

        return groups
            .flatMap((group) => group.items ?? [])
            .filter((item) => {
                // Search both languages, regardless of UI language.
                // This lets Arabic and English searches both work.
                return (
                    faqMatchesSearch(item.questionEn, item.answerEn, search) ||
                    faqMatchesSearch(item.questionAr, item.answerAr, search)
                );
            })
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [
        allFAQGroups,
        selectedFAQGroups,
        selectedCategory,
        search,
    ]);

    const handleCategoryClick = (code: string) => {
        // Clicking the selected category again returns to all FAQs.
        setSelectedCategory((current) =>
            current === code ? null : code
        );
    };

    const isInitialLoading = isCategoriesLoading || isAllFAQsLoading;

    const hasError =
        isCategoriesError ||
        isAllFAQsError ||
        (Boolean(selectedCategory) && isSelectedFAQsError);

    const isLoadingSelectedCategory = Boolean(selectedCategory) && isSelectedFAQsLoading;

    return (
        <Paper
            sx={{
                backgroundColor: { xs: "transparent", md: "background.paper" },
                overflow: { xs: "visible", md: "hidden" },
                boxShadow: "none",
                p: { xs: 0, md: 3 },
            }}
        >
            {/* Header and search */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "stretch", md: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h2">
                        {faqs_sentences.FAQs.title[language]}
                    </Typography>

                    <Typography variant="body1">
                        {faqs_sentences.FAQs.subTitle[language]}
                    </Typography>
                </Box>

                <TextField
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder={faqs_sentences.FAQs.searchPlaceholder[language]}
                    fullWidth
                    sx={{
                        maxWidth: { xs: "100%", md: "40rem" },
                    }}
                    slotProps={{
                        htmlInput: {
                            dir: language === "Ar" ? "rtl" : "ltr",
                        },
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            {/* Initial loading */}
            {isInitialLoading && <FAQSkeleton />}

            {/* API errors */}
            {hasError && (
                <Typography
                    color="error"
                    sx={{
                        py: 5,
                        textAlign: "center",
                    }}
                >
                    {faqs_sentences.FAQs.error[language]}
                </Typography>
            )}

            {/* Categories and questions */}
            {!isInitialLoading &&
                !isCategoriesError &&
                !isAllFAQsError && (
                    <>
                        <FAQCategories
                            categories={sortedCategories}
                            selectedCategory={selectedCategory}
                            language={language}
                            onCategoryClick={handleCategoryClick}
                        />

                        {isLoadingSelectedCategory ? (
                            <Stack spacing={2} sx={{ mt: 3 }}>
                                <Skeleton
                                    variant="rounded"
                                    height={60}
                                />
                                <Skeleton
                                    variant="rounded"
                                    height={60}
                                />
                            </Stack>
                        ) : !isSelectedFAQsError ? (
                            faqItems.length > 0 ? (
                                <FAQAccordion
                                    items={faqItems}
                                    language={language}
                                />
                            ) : (
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        py: 6,
                                        color: "text.secondary",
                                    }}
                                >
                                    {faqs_sentences.FAQs.noResults[language]}
                                </Typography>
                            )
                        ) : null}
                    </>
                )}
        </Paper>
    );
}

export default FAQs;