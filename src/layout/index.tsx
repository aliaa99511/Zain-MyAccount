import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";

function Layout(): React.ReactElement {
  return (
    <Box>
      <Header />

      <Box
        sx={{
          height: "calc(100vh - 70px)",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <SideMenu />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              p: "20px",
            }}
          >
            <Outlet />
          </Box>

          <Footer />
        </Box>
      </Box>

      <FloatingActions />
    </Box>
  );
}

export default Layout;
