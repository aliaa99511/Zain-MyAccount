import React from "react";
import {
    Box,
    Card,
    CardActionArea,
    Typography,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import type { FAQCategory } from "../../store/apis/faqs_api";
import { faqStyles } from "./faqStyles";

interface FAQCategoriesProps {
    categories: FAQCategory[];
    selectedCategory: string | null;
    language: "En" | "Ar";
    onCategoryClick: (code: string) => void;
}

function FAQCategories({
    categories,
    selectedCategory,
    language,
    onCategoryClick,
}: FAQCategoriesProps): React.ReactElement {
    return (
        <Box sx={faqStyles.categoriesContainer}>
            {categories.map((category) => {
                const isSelected = selectedCategory === category.code;

                return (
                    <Card
                        key={category.code}
                        elevation={0}
                        sx={(theme) =>
                            faqStyles.categoryCard(theme, isSelected)
                        }
                    >
                        <CardActionArea
                            onClick={() =>
                                onCategoryClick(category.code)
                            }
                            sx={faqStyles.categoryAction}
                        >
                            <Box
                                sx={(theme) =>
                                    faqStyles.categoryIcon(theme)
                                }
                            >
                                <HelpOutlineOutlinedIcon />
                            </Box>

                            <Typography
                                sx={(theme) =>
                                    faqStyles.categoryText(theme, isSelected)
                                }
                            >
                                {category[`name${language}`]}
                            </Typography>
                        </CardActionArea>
                    </Card>
                );
            })}
        </Box>
    );
}

export default FAQCategories;