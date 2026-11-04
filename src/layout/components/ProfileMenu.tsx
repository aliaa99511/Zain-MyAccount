import React, { useContext, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    Menu,
    Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";

import { LanguageContext } from "../../App";
import { layout_sentences } from "../../configurations/language";
import { profileMenuStyles } from "../../theme/themes/common_components/ProfileMenu";
import type { MenuKey } from "../commonComponents/types";
import MenuContent from "../commonComponents/MenuContent";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { useDialog } from "../../shared/dialog/hooks/useDialog";
import { useLogoutMutation } from "../../store";
import { useAuth } from "../../auth/useAuth";

type Appearance = "light" | "dark";

function ProfileMenu(): React.ReactElement {
    const languageContext = useContext(LanguageContext);
    const language = languageContext?.language ?? 'En';
    const theme = useTheme();
    const {customDialog, closeDialog} = useDialog();
    const {logout} = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [appearance, setAppearance] = useState<Appearance>("light");
    const navigate = useNavigate();
    const [logoutFromAccount, {isLoading: isLoggingout}] = useLogoutMutation();

    const lang = useContext(LanguageContext);

    if (!lang) {
        throw new Error(
            "ProfileMenu must be used inside LanguageContext.Provider",
        );
    }

    const open = Boolean(anchorEl);

    const getLabel = (label: MenuKey) =>
        layout_sentences[label]?.[lang.language] ?? label;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAppearanceChange = (mode: Appearance) => {
        setAppearance(mode);
    };

    const handleChangePassword = () => {
        navigate("/change_password");
    };
    const handleModifySecurityQuestions = () => {
        navigate("/modify_security_questions");
    };

    const handleLogout = async() => {
        logoutFromAccount({}).then(() => {
            logout();
            closeDialog();
        })
    }
    const handleLogoutDialog = async () => {
        await customDialog({
            title: layout_sentences.AddAccountTitle[language],
            content: layout_sentences.AddAccountDescription[language],
            actions: <Grid container sx={{width: '100%'}} spacing={2}> 
                <Grid size={{xs: 12, md: 'grow'}}>
                    <Button variant="outlined" color="error" fullWidth onClick={() => handleLogout()} loading={isLoggingout}>Logout</Button>
                </Grid>
                <Grid size={{xs: 12, md: 'grow'}}>
                    <Button variant="contained" color="info" fullWidth onClick={() => closeDialog()}>Cancel</Button>
                </Grid>
            </Grid>
        })
    }

    const appearanceOptions = [
        {
            value: "light" as const,
            label: "LightMode" as const,
            icon: <LightModeOutlinedIcon sx={profileMenuStyles.modeIcon} />,
        },
        {
            value: "dark" as const,
            label: "DarkMode" as const,
            icon: <DarkModeOutlinedIcon sx={profileMenuStyles.modeIcon} />,
        },
    ];

    return (
        <>
            {/* Profile Trigger */}
            <Avatar
                sx={profileMenuStyles.avatar}
                onClick={handleClick}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={open}>
                <Typography variant="subtitle1">
                    MT
                </Typography>
            </Avatar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: profileMenuStyles.menu,
                    },
                }}
            >
                {/* User Information */}
                <Box sx={profileMenuStyles.header}>
                    <Avatar sx={profileMenuStyles.avatar}>
                        <Typography variant="subtitle1">
                            MT
                        </Typography>
                    </Avatar>

                    <Box>
                        <Typography variant="subtitle1">
                            Muhammad Tarek
                        </Typography>

                        <Typography variant="subtitle1">
                            +249 91 234 5678
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Account Actions */}
                <Box
                    onClick={handleChangePassword}
                    sx={profileMenuStyles.item}
                >
                    <MenuContent
                        icon={<LockOutlinedIcon />}
                        label={getLabel("ChangePassword")}
                    />
                </Box>

                <Box
                    onClick={handleModifySecurityQuestions}
                    sx={profileMenuStyles.item}
                >
                    <MenuContent
                        icon={<QuizOutlinedIcon />}
                        label={getLabel("ModifySecurityQuestions")}
                    />
                </Box>

                <Divider />

                {/* Appearance */}
                <Box sx={profileMenuStyles.section}>
                    <Typography
                        variant="subtitle1"
                        sx={profileMenuStyles.sectionTitle}
                    >
                        {getLabel("SystemMode")}
                    </Typography>

                    <Box sx={profileMenuStyles.modeContainer}>
                        {appearanceOptions.map((option) => {
                            const isSelected = appearance === option.value;

                            return (
                                <Box
                                    key={option.value}
                                    component="button"
                                    type="button"
                                    onClick={() =>
                                        handleAppearanceChange(option.value)
                                    }
                                    aria-pressed={isSelected}
                                    sx={{
                                        ...profileMenuStyles.modeItem(theme, isSelected),
                                        border: 0,
                                    }}
                                >
                                    <MenuContent
                                        icon={option.icon}
                                        label={getLabel(option.label)}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <Divider />

                {/* Logout */}
                <Box sx={profileMenuStyles.bottomSection}>
                    <Box
                        onClick={handleLogoutDialog}
                        sx={profileMenuStyles.logout}
                        role="button"
                        tabIndex={0}
                    >
                        <MenuContent
                            icon={<LogoutOutlinedIcon />}
                            label={getLabel("Logout")}
                        />
                    </Box>
                </Box>
            </Menu>
        </>
    );
}

export default ProfileMenu;