import React from "react";
import { Menu, MenuItem } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export type HeaderMenuOption = {
    label: string;
    value: string;
};

type HeaderMenuProps = {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    options: HeaderMenuOption[];
    onSelect: (value: string) => void;
    selectedValue?: string;
    paperSx?: SxProps<Theme>;
};

function HeaderMenu({
    anchorEl,
    onClose,
    options,
    onSelect,
    selectedValue,
    paperSx,
}: HeaderMenuProps): React.ReactElement {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: paperSx,
                },
            }}
        >
            {options.map((option) => (
                <MenuItem
                    key={option.value}
                    selected={selectedValue === option.value}
                    onClick={() => {
                        onSelect(option.value);
                        onClose();
                    }}
                >
                    {option.label} </MenuItem>
            ))} </Menu>
    );
}

export default HeaderMenu;
