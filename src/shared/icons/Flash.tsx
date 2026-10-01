import { SvgIcon, type SvgIconProps } from "@mui/material";
import type { ReactElement } from "react";

function FlashIcon(props: SvgIconProps): ReactElement {
    return (
        <SvgIcon  {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>flash-outline</title>
            <path d="M7,2H17L13.5,9H17L10,22V14H7V2M9,4V12H12V14.66L14,11H10.24L13.76,4H9Z" />
        </SvgIcon>
    );
}

export default FlashIcon;