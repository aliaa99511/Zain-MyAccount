import React, { useContext } from "react";
import { Box, Link, Typography } from "@mui/material";
import { NavLink } from "react-router";
import { LanguageContext } from "../../App";
import { layout_sentences } from "../../configurations/language";
import { footerStyles } from "../../theme/themes/common_components/footer";
import type { MenuKey } from "../commonComponents/types";

function Footer(): React.ReactElement {
    const lang = useContext(LanguageContext);

    if (!lang) {
        throw new Error(
            "Footer must be used inside LanguageContext.Provider",
        );
    }

    const getLabel = (label: MenuKey) =>
        layout_sentences[label]?.[lang.language] ?? label;

    return (
        <Box component="footer" sx={footerStyles.container}>
            <Box sx={footerStyles.linksContainer}>
                <Link
                    component={NavLink}
                    to="/privacy-policy"
                    sx={footerStyles.link}
                >
                    <Typography variant="subtitle1">
                        {getLabel("PrivacyPolicy")}
                    </Typography>
                </Link>

                <Typography
                    component="span"
                    sx={footerStyles.separator}
                >
                    •
                </Typography>

                <Link
                    component={NavLink}
                    to="/terms"
                    sx={footerStyles.link}
                >
                    <Typography variant="subtitle1">
                        {getLabel("TermsAndConditions")}
                    </Typography>
                </Link>
            </Box>

            <Typography
                sx={footerStyles.version}
                variant="subtitle1"
            >
                {getLabel("SystemVersion")}
            </Typography>
        </Box>
    );
}

export default Footer;