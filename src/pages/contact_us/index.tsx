import React from 'react';
import { Grid, Paper } from '@mui/material';
import ContactInformation from './ContactInformation';
import ContactForm from './ContactForm';
import NearestShop from './nearest_shop';
import { APIProvider } from '@vis.gl/react-google-maps';

function ContactUs(): React.ReactElement {

  return <Paper sx={{ backgroundColor: { xs: "transparent" }, overflow: { xs: "visible", md: "hidden" }, boxShadow: { xs: "none" }, padding: { xs: 0, md: "1.5rem" } }}>
    <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
      <Grid sx={{ width: { xs: "100%", md: "400px" } }}>
        <ContactInformation />
      </Grid>
      <Grid sx={{ flexGrow: 1 }}>
        <ContactForm />
      </Grid>
      <Grid size={{xs: 12}}>
        <APIProvider apiKey="" libraries={["routes"]}>
          <NearestShop />
        </APIProvider>
      </Grid>
    </Grid>
  </Paper>

}

export default ContactUs;