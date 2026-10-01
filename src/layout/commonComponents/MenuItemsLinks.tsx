import { LayoutIconsStyles } from '../../theme/themes/common_components/LayoutIcons';
import TicketPercentIcon from "../../shared/icons/Ticket_percent";
import StickerAlertIcon from "../../shared/icons/Sticker_alert";
import CommentPlusIcon from "../../shared/icons/Comment_plus";
import CashIcon from "../../shared/icons/Cash";
import FlashIcon from "../../shared/icons/Flash";
import InvoiceListIcon from "../../shared/icons/Invoice_list";
import WalletIcon from "../../shared/icons/Wallet";
import { SupportAgentOutlined } from "@mui/icons-material";
import TooltipQuestionIcon from "../../shared/icons/Tooltip_question";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import type { MenuItem } from './types';

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        icon: <SpaceDashboardOutlinedIcon sx={LayoutIconsStyles} />,
        path: "/",
    },
    {
        label: "Offerings",
        icon: <TicketPercentIcon sx={LayoutIconsStyles} />,
        path: "/offerings",
    },
    {
        label: "Complaints",
        icon: <StickerAlertIcon sx={LayoutIconsStyles} />,
        children: [
            {
                label: "SubmitComplaint",
                icon: <CommentPlusIcon sx={LayoutIconsStyles} />,
                path: "/contact-us",
            },
            {
                label: "ComplaintsHistory",
                icon: <ListAltOutlinedIcon sx={LayoutIconsStyles} />,
                path: "/live-chat",
            },
        ],
    },
    {
        label: "PaymentsAndRecharge",
        icon: <CashIcon sx={LayoutIconsStyles} />,
        children: [
            {
                label: "Recharge",
                icon: <FlashIcon sx={LayoutIconsStyles} />,
                path: "/recharge",
            },
            {
                label: "PayBill",
                icon: <InvoiceListIcon sx={LayoutIconsStyles} />,
                path: "/payments",
            },
            {
                label: "Transfer",
                icon: <SwapVertOutlinedIcon sx={LayoutIconsStyles} />,
                path: "/payments",
            },
            {
                label: "BalanceEnquiry",
                icon: <WalletIcon sx={LayoutIconsStyles} />,
                path: "/recharge",
            },
            {
                label: "TransactionsLog",
                icon: <ListAltOutlinedIcon sx={LayoutIconsStyles} />,
                path: "/recharge",
            },
        ],
    },
    {
        label: "Support",
        icon: <SupportAgentOutlined sx={LayoutIconsStyles} />,
        children: [
            {
                label: "ContactUs",
                icon: <LocalPhoneOutlinedIcon sx={LayoutIconsStyles} />,
                path: "/contact-us",
            },
            {
                label: "FAQ",
                icon: <TooltipQuestionIcon sx={LayoutIconsStyles} />,
                path: "/faq",
            },
        ],
    },
];