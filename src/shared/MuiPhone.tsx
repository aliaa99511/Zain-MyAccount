import {
  type BaseTextFieldProps,
  MenuItem,
  InputAdornment,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import {
  FlagImage,
  type CountryIso2,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';

export interface MUIPhoneProps extends BaseTextFieldProps {
  defaultCountry: string | undefined,
  value: string;
  withCountries: boolean;
  onChange: (phone: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({
  defaultCountry,
  value,
  withCountries,
  onChange,
  ...restProps
}) => {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: defaultCountry,
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
      forceDialCode: true,
    });

  return (
    <TextField
      variant="outlined"
      color="primary"
      fullWidth
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      slotProps={{
        htmlInput: {
          placeholder: "9xxxxxxx",
        },
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{ mr: "2px", ml: "-8px" }}
            >
              {withCountries ? <Select
                MenuProps={{
                  sx: {
                    "& .MuiMenu-paper": {
                      mt: "10px",
                      ml: "-34px",
                    },
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
                sx={{
                  width: "max-content",
                  "& fieldset": {
                    display: "none",
                  },
                  "&.Mui-focused:has(div[aria-expanded='false']) fieldset": {
                    display: "block",
                  },
                  "& .MuiSelect-select": {
                    p: "8px",
                    pr: "24px !important",
                  },
                  "& .MuiSelect-icon": {
                    right: 0,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none !important",
                  }
                }}
                value={country.iso2}
                onChange={(e: SelectChangeEvent<CountryIso2>) =>
                  setCountry(e.target.value as CountryIso2)
                }
                renderValue={(value) => (
                  <FlagImage
                    iso2={value}
                    style={{ display: "flex" }}
                  />
                )}
              >
                {defaultCountries.map((c) => {
                  const item = parseCountry(c);

                  return (
                    <MenuItem key={item.iso2} value={item.iso2}>
                      <FlagImage
                        iso2={item.iso2}
                        style={{ marginRight: "8px" }}
                      />
                      <Typography sx={{ mr: "8px" }}>
                        {item.name}
                      </Typography>
                      <Typography color="gray">
                        +{item.dialCode}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>:
                <SmartphoneOutlinedIcon fontSize='small' sx={{marginInlineStart: 0.5, marginBlockEnd: 0.5}} />
              }
            </InputAdornment>
          ),
        },
      }}
      {...restProps}
    />
  );
};