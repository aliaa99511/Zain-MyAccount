import React from "react";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";

import { floatingActionsStyles } from "../../theme/themes/common_components/floatingActions";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ZainChatbot from "../../../public/zain-chatbot.png";

function FloatingActions(): React.ReactElement {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box sx={floatingActionsStyles.container}>
            {/* Live Chat */}
            <IconButton
                onClick={() => navigate("/support/live-chat")}
                sx={{
                    ...floatingActionsStyles.actionButton(theme),
                    ...floatingActionsStyles.liveChatButton(theme),
                }}
            >
                <ChatOutlinedIcon />
            </IconButton>

            {/* Chatbot */}
            <IconButton
                sx={{
                    ...floatingActionsStyles.actionButton(theme),
                    ...floatingActionsStyles.chatbotButton(theme),
                }}
            >
                <Box
                    component="img"
                    src={ZainChatbot}
                    alt="Zain"
                    sx={floatingActionsStyles.chatbotImage}
                />
            </IconButton>
        </Box>
    );
}

export default FloatingActions;