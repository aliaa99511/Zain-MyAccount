export const MuiPaper = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: "1.5rem",
      background: "#FAFAFA",
      borderRadius: 12,
      boxShadow: "1px 1px 8px 0px #1818181F",
      "&.MuiPopover-paper" :{
        padding: 0
      },
      "&.MuiDialog-paper": {
        padding: "1rem",
      },
      "&.responsive-parent": {
        [theme.breakpoints.down("md")]: {
          backgroundColor: "transparent",
          overflow: "visible",
          boxShadow: "none",
          padding: 0,
          border: "none",
        },
      }
    }),
  },
}