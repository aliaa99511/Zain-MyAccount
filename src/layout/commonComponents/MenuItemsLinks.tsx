import TicketPercentIcon from "../../shared/icons/Ticket_percent";
import StickerAlertIcon from "../../shared/icons/Sticker_alert";
import CommentPlusIcon from "../../shared/icons/Comment_plus";
import CashIcon from "../../shared/icons/Cash";
import InvoiceListIcon from "../../shared/icons/Invoice_list";
import WalletIcon from "../../shared/icons/Wallet";
import { SupportAgentOutlined } from "@mui/icons-material";
import TooltipQuestionIcon from "../../shared/icons/Tooltip_question";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import type { MenuItem } from './types';
import { MenuIcon } from './MenuIcon';
import FlashIcon from '../../shared/icons/Flash';

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        icon: <MenuIcon Icon={SpaceDashboardOutlinedIcon} />,
        path: "/",
    },
    {
        label: "Offerings",
        icon: <MenuIcon Icon={TicketPercentIcon} />,
        path: "/offerings",
    },
    {
        label: "Complaints",
        icon: <MenuIcon Icon={StickerAlertIcon} />,
        children: [
            {
                label: "SubmitComplaint",
                icon: <MenuIcon Icon={CommentPlusIcon} />,
                path: "/contact-us",
            },
            {
                label: "ComplaintsHistory",
                icon: <MenuIcon Icon={ListAltOutlinedIcon} />,
                path: "/live-chat",
            },
        ],
    },
    {
        label: "PaymentsAndRecharge",
        icon: <MenuIcon Icon={CashIcon} />,
        children: [
            {
                label: "Recharge",
                icon: <MenuIcon Icon={FlashIcon} />,
                path: "/recharge",
            },
            {
                label: "PayBill",
                icon: <MenuIcon Icon={InvoiceListIcon} />,
                path: "/payments",
            },
            {
                label: "Transfer",
                icon: <MenuIcon Icon={SwapVertOutlinedIcon} />,
                path: "/payments",
            },
            {
                label: "BalanceEnquiry",
                icon: <MenuIcon Icon={WalletIcon} />,
                path: "/recharge",
            },
            {
                label: "TransactionsLog",
                icon: <MenuIcon Icon={ListAltOutlinedIcon} />,
                path: "/recharge",
            },
        ],
    },
    {
        label: "Support",
        icon: <SupportAgentOutlined />,
        children: [
            {
                label: "ContactUs",
                icon: <MenuIcon Icon={LocalPhoneOutlinedIcon} />,
                path: "/contact-us",
            },
            {
                label: "FAQ",
                icon: <MenuIcon Icon={TooltipQuestionIcon} />,
                path: "/faq",
            },
        ],
    },
];