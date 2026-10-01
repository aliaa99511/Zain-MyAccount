import React from "react";
import { Box, Typography } from "@mui/material";
import { sideMenuStyles } from "../../theme/themes/common_components/menuItems";

type MenuContentProps = {
    icon: React.ReactNode;
    label: string;
};

function MenuContent({
    icon,
    label,
}: MenuContentProps): React.ReactElement {
    return (
        <Box sx={sideMenuStyles.common.itemContent}>
            <Box sx={sideMenuStyles.common.icon}>
                {icon}
            </Box>

            <Typography
                variant="subtitle1"
                sx={sideMenuStyles.common.label}
            >
                {label}
            </Typography>
        </Box>
    );
}

export default MenuContent;