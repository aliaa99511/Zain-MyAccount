import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Outlet } from "react-router";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";

function Layout(): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((current) => !current);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Box>
      <Header
        onMenuClick={handleMobileMenuToggle}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <Box
        sx={{
          height: "calc(100vh - 70px)",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Desktop Sidebar */}
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            height: "100%",
          }}
        >
          <SideMenu />
        </Box>

        {/* Mobile Sidebar */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            "& .MuiDrawer-paper": {
              width: "212px",
            },
          }}
        >
          <SideMenu />
        </Drawer>

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
              p: {
                xs: "12px",
                sm: "16px",
                md: "20px",
              },
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