import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";
import { headerDropdownStyles } from "../../theme/themes/common_components/header_dropdown";

export const MuiHeaderDropdown = ({ sx, ...props }: BoxProps) => {
    return (
        <Box
            {...props}
            sx={{
                ...headerDropdownStyles,
                ...sx,
            }}
        />
    );
};