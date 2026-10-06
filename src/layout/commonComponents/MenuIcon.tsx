import type { SvgIconProps } from "@mui/material/SvgIcon";
import { LayoutIconsStyles } from "../../theme/themes/common_components/LayoutIcons";

type MenuIconProps = {
    Icon?: React.ElementType<SvgIconProps>;
};

export const MenuIcon = ({ Icon: IconComponent }: MenuIconProps) => {
    if (!IconComponent) return null;

    return <IconComponent sx={LayoutIconsStyles} />;
};