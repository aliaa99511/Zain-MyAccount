
import React from "react";
import { Box, Button } from "@mui/material";

import type { FAQSubGroup } from "../../store/apis/faqs_api";
import { faqStyles } from "./faqStyles";

interface FAQSubcategoryFiltersProps {
    subgroups: FAQSubGroup[];
    selectedSubgroup: string | null;
    language: "En" | "Ar";
    onSelect: (code: string) => void;
}

function FAQSubcategoryFilters({
    subgroups,
    selectedSubgroup,
    language,
    onSelect,
}: FAQSubcategoryFiltersProps): React.ReactElement {
    const sortedSubgroups = [...subgroups].sort(
        (a, b) => a.sortOrder - b.sortOrder
    );

    return (
        <Box
            role="group"
            aria-label={
                language === "Ar"
                    ? "تصفية الأسئلة الشائعة"
                    : "FAQ filters"
            }
            sx={faqStyles.subcategoryFilters}
        >
            {sortedSubgroups.map((subgroup) => (
                <Button
                    key={subgroup.id}
                    onClick={() => onSelect(subgroup.code)}
                    aria-pressed={selectedSubgroup === subgroup.code}
                    sx={(theme) =>
                        faqStyles.subcategoryButton(
                            theme,
                            selectedSubgroup === subgroup.code
                        )
                    }
                >
                    {subgroup[`name${language}`]}
                </Button>
            ))}
        </Box>
    );
}

export default FAQSubcategoryFilters;
