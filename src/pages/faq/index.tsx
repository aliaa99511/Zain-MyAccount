
import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

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
    useGetGroupsInfoQuery,
    useGetFAQsBySegmentQuery,
    useGetGroupedQuery,
} from "../../store";

import type {
    FAQItem,
    FAQSubGroup,
} from "../../store/apis/faqs_api";

import FAQCategories from "./FAQCategories";
import FAQAccordion from "./FAQAccordion";
import FAQSubcategoryFilters from "./FAQSubcategoryFilters";
import FAQSkeleton from "./FAQSkeleton";
import { faqMatchesSearch } from "./faq_utils";
import { faqs_sentences } from "../../configurations/language";

function FAQs(): React.ReactElement {
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language === "Ar" ? "Ar" : "En";
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubgroup, setSelectedSubgroup] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Initial page data: no segment is sent.
    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetGroupsInfoQuery();

    const {
        data: allFAQs = [],
        isLoading: isAllFAQsLoading,
        isError: isAllFAQsError,
        refetch: refetchAllFAQs,
    } = useGetFAQsBySegmentQuery();

    // Load selected category with its Prepaid/Postpaid/Other groups.
    const {
        currentData: selectedGroups = [],
        isFetching: isSelectedFAQsLoading,
        isError: isSelectedFAQsError,
    } = useGetGroupedQuery(selectedCategory ?? "", {
        skip: !selectedCategory,
    });

    const sortedCategories = useMemo(() => [...categories].sort(
        (a, b) => a.sortOrder - b.sortOrder
    ),
        [categories]
    );

    const subgroups = useMemo<FAQSubGroup[]>(() =>
        selectedGroups
            .flatMap((group) => group.faqSubGrouped ?? [])
            .sort((a, b) => a.sortOrder - b.sortOrder),
        [selectedGroups]
    );

    // Select the first subgroup (normally Prepaid) by default.
    useEffect(() => {
        if (!selectedCategory) {
            setSelectedSubgroup(null);
            return;
        }

        if (subgroups.length > 0) {
            setSelectedSubgroup(subgroups[0].code);
        } else {
            setSelectedSubgroup(null);
        }
    }, [selectedCategory, subgroups]);

    const selectedSubgroupData = useMemo(() =>
        subgroups.find(
            (subgroup) => subgroup.code === selectedSubgroup
        ),
        [subgroups, selectedSubgroup]
    );

    const visibleItems = useMemo<FAQItem[]>(() => {
        const items = selectedCategory
            ? selectedSubgroupData?.items ?? []
            : allFAQs; // no category selected → all FAQs from getFAQsBySegment

        return items
            .filter((item) =>
                language === "Ar"
                    ? faqMatchesSearch(item.questionAr, item.answerAr, search)
                    : faqMatchesSearch(item.questionEn, item.answerEn, search)
            )
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [allFAQs, selectedCategory, selectedSubgroupData, search, language]);


    const handleCategoryClick = (code: string) => {
        if (selectedCategory === code) {
            // Unselect: clear category state and go back to the full list
            setSelectedCategory(null);
            setSelectedSubgroup(null);
            refetchAllFAQs(); // calls FAQs/GetFAQsBySegmentAsync again
            return;
        }

        setSelectedCategory(code);
        setSelectedSubgroup(null);
    };

    const isInitialLoading = isCategoriesLoading || isAllFAQsLoading;
    const hasInitialError = isCategoriesError || isAllFAQsError;
    const hasSelectedCategoryError = Boolean(selectedCategory) && isSelectedFAQsError;
    // const isLoadingSelectedCategory = Boolean(selectedCategory) && isSelectedFAQsLoading;

    return (
        <Paper
            sx={{
                backgroundColor: {
                    xs: "transparent",
                    md: "background.paper",
                },
                overflow: { xs: "visible", md: "hidden" },
                boxShadow: "none",
                p: { xs: 0, md: 3 },
            }}
        >
            {/* Header and search */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        md: "center",
                    },
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
                    placeholder={
                        faqs_sentences.FAQs.searchPlaceholder[language]
                    }
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

            {isInitialLoading && <FAQSkeleton />}

            {hasInitialError && (
                <Typography
                    color="error"
                    sx={{ py: 5, textAlign: "center" }}
                >
                    {faqs_sentences.FAQs.error[language]}
                </Typography>
            )}

            {!isInitialLoading && !hasInitialError && (
                <>
                    <FAQCategories
                        categories={sortedCategories}
                        selectedCategory={selectedCategory}
                        language={language}
                        onCategoryClick={handleCategoryClick}
                    />

                    {hasSelectedCategoryError && (
                        <Typography
                            color="error"
                            sx={{ py: 4, textAlign: "center" }}
                        >
                            {faqs_sentences.FAQs.error[language]}
                        </Typography>
                    )}


                    {selectedCategory &&
                        !hasSelectedCategoryError && (
                            isSelectedFAQsLoading ? (
                                <Stack spacing={2} sx={{ mt: 3 }}>
                                    <Skeleton variant="rounded" height={45} />
                                    <Skeleton variant="rounded" height={60} />
                                </Stack>
                            ) : subgroups.length > 0 ? (
                                <FAQSubcategoryFilters
                                    subgroups={subgroups}
                                    selectedSubgroup={selectedSubgroup}
                                    language={language}
                                    onSelect={setSelectedSubgroup}
                                />
                            ) : null
                        )}

                    {!isSelectedFAQsLoading &&
                        !hasSelectedCategoryError && (
                            visibleItems.length > 0 ? (
                                <FAQAccordion
                                    key={`${selectedCategory ?? "all"}-${selectedSubgroup ?? "default"}`}
                                    items={visibleItems}
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
                        )}
                </>
            )}
        </Paper>
    );
}

export default FAQs;
