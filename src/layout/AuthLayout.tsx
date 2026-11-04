import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import LoginImg from "../assets/imgs/login.png";
import CreateAccountImg from "../assets/imgs/create_account.png";
import LogoImg from "../assets/imgs/zain-logo.png"
import { ArrowDropDown } from '@mui/icons-material';
import { LanguageContext } from '../App';
import GlobeIcon from '../shared/icons/Globe';
import HeaderMenu from './commonComponents/HeaderMenu';
import { MuiHeaderDropdown } from './commonComponents/HeaderDropdown';
import { Outlet, useLocation } from 'react-router';

const languageOptions = [
  { label: "AR", value: "Ar" },
  { label: "EN", value: "En" },
];

const renderDropdownContent = (label: string, icon: React.ReactNode) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
    {icon}
    <Typography variant="subtitle1" sx={{ color: "#181818" }}>
      {label}
    </Typography>
    <ArrowDropDown sx={{ color: "#181818 !important", mb: 0.5 }} />
  </Box>
);

function AuthLayout(): React.ReactElement {
  const location = useLocation();
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? "En";
  const setLanguage = languageContext?.setLanguage;
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (lang: "Ar" | "En") => {
    setLanguage?.(lang);
    setLanguageAnchor(null);
  };

  return (
    <Grid container sx={{ height: { xs: "auto", md: "100vh" }, maxHeight: { xs: "auto", md: "100vh" }, width: { xs: "100vw", md: "auto" }, overflow: 'hidden' }}>
      <Grid size="auto" sx={{ height: { xs: "auto", md: "100vh" }, maxHeight: { xs: "auto", md: "100vh" }, width: { xs: "100vw", md: "auto" }, position: "relative" }}>
        <Box
          component="img"
          src={location.pathname.startsWith("/create_account") ? CreateAccountImg : LoginImg }
          sx={{
            display: "block",
            objectFit: "cover",
            height: { xs: "auto", md: "100%" },
            width: { xs: "100%", md: "auto" },
            aspectRatio: { xs: "16/11", md: "7/8" },
          }}
        />
        <Box sx={{
          position: "absolute", inset: 0,
          background: `
          linear-gradient(142.56deg, rgba(24, 24, 24, 0.5) 0%, rgba(66, 66, 66, 0) 80.29%),
          linear-gradient(217.44deg, rgba(66, 66, 66, 0) 0%, rgba(24, 24, 24, 0.5) 100%)`,
          p: 3,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between"
        }}
        >
          <img src={LogoImg} width="120" height="35" />
          <MuiHeaderDropdown
            sx={{ width: "90px", backgroundColor: "#fff", color: "#181818", "&:hover": { backgroundColor: "#fff" } }}
            onClick={(event) =>
              setLanguageAnchor(event.currentTarget)
            }
          >
            {renderDropdownContent(
              language.toUpperCase(),
              <GlobeIcon fontSize="small" sx={{ mb: 0.5, color: "#181818 !important" }} />
            )}
          </MuiHeaderDropdown>
          <HeaderMenu
            anchorEl={languageAnchor}
            onClose={() => setLanguageAnchor(null)}
            options={languageOptions}
            selectedValue={language}
            onSelect={(value) =>
              handleLanguageChange(value as "Ar" | "En")
            }
            paperSx={{ width: "90px", textAlign: "center" }}
          />
        </Box>
      </Grid>
      <Grid
        size={{ xs: 12, md: "grow" }}
        sx={{
          p: 3,
          height: { xs: "auto", md: "100vh" },
          minHeight: 0,
          boxSizing: "border-box",
        }}
      >
        <Paper
          className="responsive-parent"
          sx={{
            boxShadow: "none",
            border: "1px solid #E3E3E3",
            height: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default AuthLayout