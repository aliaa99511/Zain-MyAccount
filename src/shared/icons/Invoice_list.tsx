import { SvgIcon, type SvgIconProps } from "@mui/material";
import type { ReactElement } from "react";
import { LayoutIconsStyles } from "../../theme/themes/common_components/LayoutIcons";

function InvoiceListIcon(props: SvgIconProps): ReactElement {
    return (
        <SvgIcon sx={LayoutIconsStyles} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>invoice-list-outline</title>
            <path d="M17 7V9H15V7H17M13 7V9H7V7H13M13 11H7V13H13V11M15 11V13H17V11H15M21 22L18 20L15 22L12 20L9 22L6 20L3 22V3H21V22M19 18.26V5H5V18.26L6 17.6L9 19.6L12 17.6L15 19.6L18 17.6L19 18.26Z" /></SvgIcon>
    );
}

export default InvoiceListIcon;