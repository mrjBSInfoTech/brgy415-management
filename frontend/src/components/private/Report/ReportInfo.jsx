import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Box,
  Typography,
  Chip,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Animation transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReportInfo({ open, handleClose, selectedReport }) {
  if (!selectedReport) return null;

  const isImageAttachment = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  };

  const attachmentUrl = selectedReport.attachment
    ? `http://localhost:5000/uploads/uploadReport/${encodeURIComponent(
        selectedReport.attachment
      )}`
    : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ArticleIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Report Details #{selectedReport.report_id}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Metadata Badges */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedReport.date_created && (
              <Chip
                icon={<CalendarTodayIcon fontSize="small" />}
                label={new Date(selectedReport.date_created).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                size="small"
                variant="outlined"
              />
            )}
            {selectedReport.official_id && (
              <Chip
                icon={<BadgeIcon fontSize="small" />}
                label={`Official ID: ${selectedReport.official_id}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {selectedReport.message_id && (
              <Chip
                icon={<ChatBubbleOutlineIcon fontSize="small" />}
                label={`Concern/Message ID: ${selectedReport.message_id}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>

          {/* Report Body */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Report Description:
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "action.hover",
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  color: "text.primary",
                }}
              >
                {selectedReport.report || "No details provided."}
              </Typography>
            </Box>
          </Box>

          {/* Attachment Section */}
          {selectedReport.attachment && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Attachment:
              </Typography>
              {isImageAttachment(selectedReport.attachment) ? (
                <Box
                  sx={{
                    borderRadius: 1.5,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    maxHeight: 300,
                    bgcolor: "grey.100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={attachmentUrl}
                    alt="Report attachment"
                    sx={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : null}

              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                  <AttachFileIcon color="action" fontSize="small" />
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {selectedReport.attachment}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  component="a"
                  href={attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  sx={{ ml: 1, textTransform: "none", flexShrink: 0 }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
