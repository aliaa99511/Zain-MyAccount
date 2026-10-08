import React, { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { FAQItem } from "../../store/apis/faqs_api";
import { faqStyles } from "./faqStyles";

interface FAQAccordionProps {
    items: FAQItem[];
    language: "En" | "Ar";
}

function FAQAccordion({
    items,
    language,
}: FAQAccordionProps): React.ReactElement {
    const [expanded, setExpanded] = useState<number | false>(false);

    const handleChange =
        (panel: number) =>
            (_event: React.SyntheticEvent, isExpanded: boolean) => {
                setExpanded(
                    isExpanded ? panel : false
                );
            };

    return (
        <Box sx={faqStyles.accordionContainer}>
            {items.map((item) => {
                const question =
                    item[`question${language}`];

                const answer =
                    item[`answer${language}`];

                return (
                    <Accordion
                        key={item.id}
                        expanded={expanded === item.id}
                        onChange={
                            handleChange(item.id)
                        }
                        disableGutters
                        elevation={0}
                        sx={(theme) =>
                            faqStyles.accordion(theme)
                        }
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={(theme) => faqStyles.accordionSummary(theme)}
                        >
                            <Typography
                                sx={(theme) =>
                                    faqStyles.question(theme, language)
                                }
                            >
                                {question}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                            sx={faqStyles.accordionDetails}
                        >
                            <Typography
                                sx={(theme) =>
                                    faqStyles.answer(theme, language)
                                }
                            >
                                {answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
}

export default FAQAccordion;