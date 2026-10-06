export const MuiPaper = {
  styleOverrides: {
    root: {
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
        backgroundColor: {xs: "transparent"}, 
        overflow: {xs: "visible", md: "hidden"}, 
        boxShadow:{xs:"none"}, 
        padding: {xs: 0, md:"1.5rem"},
        border: {xs: "none"},
      }
    },
  },
}