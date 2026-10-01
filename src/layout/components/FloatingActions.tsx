import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import { floatingActionsStyles } from "../../theme/themes/common_components/floatingActions";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ZainChatbot from "../../../public/zain-chatbot.png";

function FloatingActions(): React.ReactElement {
    const navigate = useNavigate();

    return (
        <Box sx={floatingActionsStyles.container}>
            {/* Live Chat */}
            <IconButton
                onClick={() => navigate("/support/live-chat")}
                sx={{
                    ...floatingActionsStyles.actionButton,
                    ...floatingActionsStyles.liveChatButton,
                }}
            >
                <ChatOutlinedIcon />
            </IconButton>

            {/* Chatbot */}
            <IconButton
                sx={{
                    ...floatingActionsStyles.actionButton,
                    ...floatingActionsStyles.chatbotButton,
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