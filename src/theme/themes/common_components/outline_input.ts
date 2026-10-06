export const MuiOutlinedInput = {
  styleOverrides: {
    root: ({theme}) => ({
      borderRadius: '8px',
      fontSize: "1.125rem",
      "& .MuiInputBase-input": {
        paddingTop: theme.spacing(1.2),
        paddingBottom: theme.spacing(1.2),
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #A3A3A3",
      },
      "&.important .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #525252",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        border: `1.8px solid ${theme.palette.primary.light}`,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: `1.8px solid ${theme.palette.primary.light}`,
      },
      "& .MuiInputAdornment-root": {
        fontSize: "1rem",
        display: "flex",
        alginItems: "center"
      }
    })
  }
};