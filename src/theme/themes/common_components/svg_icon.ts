export const MuiSvgIcon= {
  styleOverrides: {
    root: ({theme}) => ({
      ...(theme.direction == "rtl" ? {transform: "rotateY(0deg)"}:{})
    })
  }
}