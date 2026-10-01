import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import {
    ChevronRight,
    SettingsOutlined,
} from "@mui/icons-material";
import { NavLink } from "react-router";
import { layout_sentences } from "../../configurations/language";
import { LanguageContext } from "../../App";
import {
    sideMenuStyles,
} from "../../theme/themes/common_components/menuItems";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { menuItems } from "../commonComponents/MenuItemsLinks";
import type { MenuKey } from "../commonComponents/types";
import MenuContent from "../commonComponents/MenuContent";

function SideMenu(): React.ReactElement {
    const lang = useContext(LanguageContext);

    if (!lang) {
        throw new Error(
            "SideMenu must be used inside LanguageContext.Provider",
        );
    }

    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const toggleMenu = (label: string) => {
        setExpandedMenus((current) =>
            current.includes(label)
                ? current.filter((item) => item !== label)
                : [...current, label],
        );
    };

    const getLabel = (label: MenuKey) =>
        layout_sentences[label]?.[lang.language] ?? label;

    return (
        <Box sx={sideMenuStyles.container}>
            {/* Scrollable Main Menu */}
            <Box sx={sideMenuStyles.scrollArea}>
                {menuItems.map((item) => {
                    const hasChildren = Boolean(item.children?.length);
                    const isExpanded = expandedMenus.includes(item.label);

                    return (
                        <Box key={item.label}>
                            {hasChildren ? (
                                <Box
                                    onClick={() => toggleMenu(item.label)}
                                    sx={sideMenuStyles.item}
                                >
                                    <MenuContent
                                        icon={item.icon}
                                        label={getLabel(item.label)}
                                    />

                                    <ChevronRight
                                        sx={{
                                            ...sideMenuStyles.arrow,
                                            transform: isExpanded
                                                ? "rotate(90deg)"
                                                : "rotate(0deg)",
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    component={NavLink}
                                    to={item.path ?? "#"}
                                    sx={sideMenuStyles.item}
                                >
                                    <MenuContent
                                        icon={item.icon}
                                        label={getLabel(item.label)}
                                    />
                                </Box>
                            )}

                            {hasChildren && isExpanded && (
                                <Box sx={sideMenuStyles.subMenuContainer}>
                                    {item.children?.map((child) => (
                                        <Box
                                            key={child.label}
                                            component={NavLink}
                                            to={child.path ?? "#"}
                                            sx={sideMenuStyles.subItem}
                                        >
                                            <MenuContent
                                                icon={child.icon}
                                                label={getLabel(child.label)}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* Bottom Menu */}
            <Box sx={sideMenuStyles.bottomSection}>
                <Box
                    component={NavLink}
                    to="/preferences"
                    sx={sideMenuStyles.preferences}
                >
                    <MenuContent
                        icon={<SettingsOutlined />}
                        label={getLabel("Preferences")}
                    />
                </Box>

                <Box sx={sideMenuStyles.logout}>
                    <MenuContent
                        icon={<LogoutOutlinedIcon />}
                        label={getLabel("Logout")}
                    />
                </Box>
            </Box>
        </Box>

    );
}

export default SideMenu;