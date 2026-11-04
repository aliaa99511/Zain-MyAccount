import { useState, useRef, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Menu,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import ThreadsIcon from "../../shared/icons/Threads";
import TiktokIcon from "../../shared/icons/Tiktok";


const ACCENT = "#8a2f9b";

const PLATFORMS = [
  {
    id: "facebook",
    label: "Facebook",
    Icon: <FacebookIcon />,
    shareUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  },
  {
    id: "x",
    label: "X",
    Icon: <XIcon />,
    shareUrl: (u, t) => `https://x.com/intent/post?url=${u}&text=${t}`,
  },
  { id: "instagram", label: "Instagram", Icon: <InstagramIcon /> },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: <LinkedInIcon />,
    shareUrl: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  },
  { id: "tiktok", label: "TikTok", Icon: <TiktokIcon /> },
  {
    id: "telegram",
    label: "Telegram",
    Icon: <TelegramIcon />,
    shareUrl: (u, t) => `https://t.me/share/url?url=${u}&text=${t}`,
  },
  {
    id: "threads",
    label: "Threads",
    Icon: <ThreadsIcon />,
    shareUrl: (u, t) => `https://www.threads.net/intent/post?text=${t}%20${u}`,
  },
];

export default function InviteFriends({
  anchorEl,
  setAnchorEl,
  title = "Invite Friends",
  message = "Join me!",
}) {
  const link = window.location.origin;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const open = Boolean(anchorEl);


  useEffect(() => () => clearTimeout(timer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  const share = async (platform) => {
    const u = encodeURIComponent(link);
    const t = encodeURIComponent(message);

    if (platform.shareUrl) {
      window.open(platform.shareUrl(u, t), "_blank", "noopener,noreferrer");
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url: link });
      } catch {
        /* user dismissed the share sheet */
      }
    } else {
      copyLink();
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleCloseMenu}
      anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
      }}
      transformOrigin={{
          vertical: "top",
          horizontal: "right",
      }}
      sx={{
        "& .MuiList-root": {
          p: 0
        }
      }}
  >
    <Paper
      component="section"
      aria-labelledby="invite-title"
      elevation={0}
      sx={{minWidth: '400px'}}
    >
      <Typography
        id="invite-title"
        variant="subtitle1"
        sx={{ mb: 1.5, color: "#5f5f6b" }}
      >
        {title}
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          position: "relative",
          px: 2.25,
          py: 1.75,
          bgcolor: "#f8f8fa",
          border: 1,
          borderColor: "#e2e2e8",
          borderRadius: "14px",
          alignItems: 'center',
        }}
      >
        <Typography
          dir="ltr"
          title={link}
          noWrap
          sx={{ flex: 1, minWidth: 0, fontWeight: 500, textAlign: "start" }}
        >
          {link}
        </Typography>

        <Tooltip title={copied ? "Copied" : "Copy link"}>
          <IconButton
            onClick={copyLink}
            aria-label={copied ? "Link copied" : "Copy invite link"}
            sx={{
              color: ACCENT,
              "&:hover": { bgcolor: "rgba(138, 47, 155, 0.1)" },
            }}
          >
            {copied ? <CheckIcon /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>

        <Box
          role="status"
          aria-live="polite"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clipPath: "inset(50%)",
          }}
        >
          {copied ? "Link copied" : ""}
        </Box>
      </Stack>

      <Divider sx={{ mt: 1.75, borderColor: "#e2e2e8" }} />

      <Stack
        direction="row"
        component="ul"
        sx={{ listStyle: "none", m: 0, p: 0, pt: 1.5, alignItems: 'center', justifyContent: 'space-between' }}
      >
        {PLATFORMS.map((platform) => {
          const { id, label, Icon } = platform;
          return (
          <li key={id}>
            <IconButton
              onClick={() => share(platform)}
              aria-label={`Share on ${label}`}
              sx={{
                color: "#5f5f6b",
                fontSize: { xs: 22, sm: 26 },
                "&:hover": {
                  color: ACCENT,
                  bgcolor: "rgba(138, 47, 155, 0.08)",
                },
              }}
            >
              {Icon}
            </IconButton>
          </li>
          );
        })}
      </Stack>
    </Paper>
  </Menu>
  );
}