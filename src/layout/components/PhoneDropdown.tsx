
import React, { useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Popover,
    Skeleton,
    Typography,
} from "@mui/material";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { phoneDropdownStyles } from "../../theme/themes/common_components/phoneDropdown";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useAddNumberMutation, useGetNumbersQuery } from "../../store";
import AddAccount from "../add_account";
import { useDialog } from "../../shared/dialog/hooks/useDialog";

export interface PhoneNumber {
    msisdn: string;
    isMain: boolean;
    isPrimary: boolean;
    canRemove: boolean;
    canSwitch: boolean;
}

// type PhoneDropdownProps = {
//     onRemoveAccount?: (number: string) => void;
// };
// {onRemoveAccount}: PhoneDropdownProps
function PhoneDropdown(): React.ReactElement {
    const { customDialog, closeDialog } = useDialog();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const {data: userNumbers, isFetching: isGettingNumbers} = useGetNumbersQuery();
    const [addNumber] = useAddNumberMutation();
    
    const primaryNumber = useMemo(
        () => userNumbers?.result?.numbers.find((number) => number.isPrimary)?.msisdn,
        [userNumbers]
    );

    const open = Boolean(anchorEl);

    const handleAddAccount = async () => {
        // await feedback ({
        //     title: "You have added a new account successfully.",
        //     description:
        //         "You can now manage your new account through the portal and access all your data.",
        //     variant: "success",
        // });
        // await feedback ({
        //     title: "Couldn’t add new account",
        //     description: "Please try again later or contact support.",
        //     variant: "error",
        // });
        await customDialog({
            content: <AddAccount onAddAccount={addNumber} onClose={closeDialog} />,
            closeOnBackdrop: false,
        })
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    // const handleSelect = (number: string) => {
    //     handleClose();
    // };

    return (
        <>

            {/* Header phone selector */}
            <Button
                onClick={(event) => setAnchorEl(event.currentTarget)}
                aria-label="Select phone number"
                aria-expanded={open}
                endIcon={<ArrowDropDownIcon />}
                sx={phoneDropdownStyles.trigger}
            >
                <Box sx={phoneDropdownStyles.triggerIcon}>
                    <SmartphoneOutlinedIcon fontSize="small" />
                </Box>

                {isGettingNumbers ? <Skeleton variant="text" animation="wave" width={150} /> : 
                <Typography sx={phoneDropdownStyles.triggerLabel} variant="subtitle1">
                    {primaryNumber}
                </Typography>}
            </Button>

            {/* My Numbers dropdown */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                slotProps={{
                    paper: {
                        sx: phoneDropdownStyles.popoverPaper,
                    },
                }}
            >
                <Box sx={phoneDropdownStyles.content}>
                    <Typography sx={phoneDropdownStyles.title} variant="subtitle1">
                        My Numbers
                    </Typography>

                    <Box sx={phoneDropdownStyles.accountsList}>
                        {userNumbers?.result?.numbers?.map((number) => {

                            return (
                                <Box
                                    key={number.msisdn}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            // handleSelect(number.msisdn);
                                        }
                                    }}
                                    sx={(theme) =>
                                        phoneDropdownStyles.account(
                                            theme,
                                            number.isPrimary
                                        )
                                    }
                                >
                                    <Box
                                        sx={(theme) =>
                                            phoneDropdownStyles.accountIcon(
                                                theme,
                                                number.isPrimary
                                            )
                                        }
                                    >
                                        <SmartphoneOutlinedIcon
                                            sx={{ fontSize: 23 }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="subtitle1"
                                        sx={phoneDropdownStyles.accountLabel}
                                    >
                                        {number.msisdn}
                                    </Typography>

                                    {number.isPrimary && (
                                        <Chip
                                            label="Primary"
                                            size="small"
                                            sx={phoneDropdownStyles.primaryChip}
                                        />
                                    )}

                                    {number.canRemove && (
                                        <IconButton
                                            size="small"
                                            aria-label={`Remove ${number.msisdn}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                // onRemoveAccount(number.msisdn);
                                            }}
                                            sx={phoneDropdownStyles.removeButton}
                                        >
                                            <HighlightOffIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    <Divider sx={phoneDropdownStyles.divider} />

                    <Button
                        onClick={handleAddAccount}
                        startIcon={<AddIcon />}
                        fullWidth
                        sx={phoneDropdownStyles.addAccountButton}
                    >
                        Add Account
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

export default PhoneDropdown;
