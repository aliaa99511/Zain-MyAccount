
import React, { useContext, useState } from "react";
import {
    Box,
    IconButton,
    Typography,
} from "@mui/material";
import {
    ArrowDropDown,
    Menu as MenuIcon,
    NotificationsNoneOutlined,
} from "@mui/icons-material";
import AccountMultiplePlusIcon from "../../shared/icons/Account_multiple_plus";
import GlobeIcon from "../../shared/icons/Globe";
import ZainLogo from "../../../src/assets/imgs/zain-logo.png";
import { LanguageContext } from "../../App";
import { headerStyles } from "../../theme/themes/common_components/header";
import { MuiHeaderDropdown } from "../commonComponents/HeaderDropdown";
import HeaderMenu from "../commonComponents/HeaderMenu";
import ProfileMenu from "./ProfileMenu";
import PhoneDropdown from "./PhoneDropdown";
// import { useDialog } from "../../shared/dialog/hooks/useDialog";
// import DeleteAccount from "../delete_account";
import InviteFriends from "../invite_friends";

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
    // const { customDialog, closeDialog } = useDialog();
    const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
    const [inviteAnchor, setInviteAnchor] = useState<null | HTMLElement>(null);

    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? "En";
    const setLanguage = languageContext?.setLanguage;

    const handleLanguageChange = (lang: "Ar" | "En") => {
        setLanguage?.(lang);
        setLanguageAnchor(null);
    };
    const handleInviteFriends = (event: React.MouseEvent<HTMLElement>) => {
        setInviteAnchor(event.currentTarget)
    }
    // const handleDeleteAccount = async () => {
    //     await customDialog({
    //         content: <DeleteAccount onClose={closeDialog} />,
    //         closeOnBackdrop: false,
    //     });
    // };

    const renderDropdownContent = (
        icon: React.ReactNode,
        label: string
    ) => (
        <Box sx={headerStyles.common.content}>
            <Box sx={headerStyles.common.icon}>
                {icon}
            </Box>

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
            {/* Mobile Menu */}
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
                {/* Zain Logo */}
                <Box
                    component="img"
                    src={ZainLogo}
                    alt="Zain"
                    sx={headerStyles.logo}
                />

                {/* Phone Dropdown */}
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "flex",
                        },
                    }}
                >
                    <PhoneDropdown
                        // onRemoveAccount={handleDeleteAccount}
                    />
                </Box>
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
                        handleLanguageChange(
                            value as "Ar" | "En"
                        )
                    }
                    paperSx={{
                        ...headerStyles.menu.paper,
                        ...headerStyles.menu.language,
                    }}
                />

                {/* Notifications */}
                <IconButton
                    aria-label="Notifications"
                    sx={headerStyles.iconButton}
                >
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
                    <IconButton
                        aria-label="Invite account"
                        sx={headerStyles.iconButton}
                        onClick={handleInviteFriends}
                    >
                        <AccountMultiplePlusIcon
                            sx={headerStyles.inviteIcon}
                        />
                    </IconButton>
                    <InviteFriends anchorEl={inviteAnchor} setAnchorEl={setInviteAnchor} />
                </Box>

                {/* Profile */}
                <ProfileMenu />
            </Box>
        </Box>
    );
}

export default Header;
