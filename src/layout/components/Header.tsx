import React, { useContext, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
    ArrowDropDown,
    Menu as MenuIcon,
    NotificationsNoneOutlined,
} from "@mui/icons-material";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import AccountMultiplePlusIcon from "../../shared/icons/Account_multiple_plus";
import GlobeIcon from "../../shared/icons/Globe";
import ZainLogo from "../../../public/zain-logo.png";
import { LanguageContext } from "../../App";
import { headerStyles } from "../../theme/themes/common_components/header";
import { MuiHeaderDropdown } from "../commonComponents/HeaderDropdown";
import HeaderMenu from "../commonComponents/HeaderMenu";
import ProfileMenu from "./ProfileMenu";

const phoneOptions = [
    { label: "+249 91 234 5678", value: "+249 91 234 5678" },
    { label: "+249 92 345 6789", value: "+249 92 345 6789" },
];

const languageOptions = [
    { label: "AR", value: "Ar" },
    { label: "EN", value: "En" },
];

type HeaderProps = {
    onMenuClick: () => void;
    isMobileMenuOpen: boolean;
};

function Header({
    onMenuClick,
    isMobileMenuOpen,
}: HeaderProps): React.ReactElement {
    const [numberAnchor, setNumberAnchor] = useState<null | HTMLElement>(
        null
    );

    const [languageAnchor, setLanguageAnchor] =
        useState<null | HTMLElement>(null);

    const languageContext = useContext(LanguageContext);

    const language = languageContext?.language ?? "En";
    const setLanguage = languageContext?.setLanguage;

    const handleLanguageChange = (lang: "Ar" | "En") => {
        setLanguage?.(lang);
        setLanguageAnchor(null);
    };

    const renderDropdownContent = (
        icon: React.ReactNode,
        label: string
    ) => (
        <Box sx={headerStyles.common.content}>
            <Box sx={headerStyles.common.icon}>{icon}</Box>

            <Typography
                variant="subtitle1"
                sx={headerStyles.common.label}
            >
                {label}
            </Typography>

            <ArrowDropDown />
        </Box>
    );

    return (
        <Box sx={headerStyles.container}>

            <Box sx={headerStyles.mobileMenuButton}>
                <IconButton
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                    aria-expanded={isMobileMenuOpen}
                    sx={headerStyles.iconButton}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            {/* Left Section */}
            <Box sx={headerStyles.leftSection}>
                <Box
                    component="img"
                    src={ZainLogo}
                    alt="Zain"
                    sx={headerStyles.logo}
                />

                {/* Phone Selector */}
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "flex",
                        },
                    }}
                >
                    <MuiHeaderDropdown
                        onClick={(event) =>
                            setNumberAnchor(event.currentTarget)
                        }
                        sx={headerStyles.dropdown}
                    >
                        {renderDropdownContent(
                            <IconButton
                                disableRipple
                                sx={headerStyles.iconButton}
                            >
                                <SmartphoneOutlinedIcon />
                            </IconButton>,
                            "+249 91 234 5678"
                        )}
                    </MuiHeaderDropdown>
                </Box>

                <HeaderMenu
                    anchorEl={numberAnchor}
                    onClose={() => setNumberAnchor(null)}
                    options={phoneOptions}
                    onSelect={(value) => {
                        console.log("Selected number:", value);
                        setNumberAnchor(null);
                    }}
                    paperSx={{
                        ...headerStyles.menu.paper,
                        ...headerStyles.menu.phone,
                    }}
                />
            </Box>

            {/* Right Section */}
            <Box sx={headerStyles.rightSection}>
                {/* Language Selector */}
                <MuiHeaderDropdown
                    onClick={(event) =>
                        setLanguageAnchor(event.currentTarget)
                    }
                    sx={headerStyles.languageDropdown}
                >
                    {renderDropdownContent(
                        <GlobeIcon />,
                        language.toUpperCase()
                    )}
                </MuiHeaderDropdown>

                <HeaderMenu
                    anchorEl={languageAnchor}
                    onClose={() => setLanguageAnchor(null)}
                    options={languageOptions}
                    selectedValue={language}
                    onSelect={(value) =>
                        handleLanguageChange(value as "Ar" | "En")
                    }
                    paperSx={{
                        ...headerStyles.menu.paper,
                        ...headerStyles.menu.language,
                    }}
                />

                {/* Notifications */}
                <IconButton sx={headerStyles.iconButton}>
                    <NotificationsNoneOutlined />
                </IconButton>

                {/* Invite */}
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                >
                    <IconButton sx={headerStyles.iconButton}>
                        <AccountMultiplePlusIcon
                            sx={headerStyles.inviteIcon}
                        />
                    </IconButton>
                </Box>

                {/* Profile */}
                <ProfileMenu />
            </Box>
        </Box>
    );
}

export default Header;