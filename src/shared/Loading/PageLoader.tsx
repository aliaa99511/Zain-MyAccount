import { Box, CircularProgress } from "@mui/material";

function PageLoader(): React.ReactElement {
    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default PageLoader;