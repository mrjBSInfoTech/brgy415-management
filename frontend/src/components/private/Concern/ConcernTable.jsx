import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
} from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import ReportIcon from '@mui/icons-material/Report';
import DeleteIcon from "@mui/icons-material/Delete";

const getAttachmentUrl = (concern) => {
  const value = [concern.attachment_url, concern.image_url, concern.file_url, concern.attachment, concern.image]
    .find((value) => typeof value === "string" && value.trim());
  if (!value) return null;
  const path = value.trim();
  // Relative upload URLs come from the same backend as the concerns API.
  if (!/^https?:\/\//i.test(path) && !path.startsWith("/uploads/")) return null;
  try {
    const url = new URL(path, "http://localhost:5000");
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export default function ConcernTable({
  concerns,
  onEdit,
  onDelete,
  onReport,
  onBulkSolve,
  onBulkDelete,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const closeAttachmentPreview = () => setAttachmentPreview(null);
  const open = Boolean(anchorEl);

  const getUrgentStyle = (urgency) => {
    const level = urgency ? urgency.toLowerCase() : "low";
    switch (level) {
      case "low":
        return {
          label: "Low",
          bg: "#DCFCE7",
          text: "#15803D",
          border: "1px solid #86EFAC",
        };
      case "medium":
        return {
          label: "Medium",
          bg: "#FEF9C3",
          text: "#A16207",
          border: "1px solid #FDE047",
        };
      default:
        return {
          label: "High",
          bg: "#FEE2E2",
          text: "#B91C1C",
          border: "1px solid #FCA5A5",
        };
    }
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : "pending";
    switch (normalizedStatus) {
      case "solved":
        return {
          label: "Solved",
          bg: "#c6d8ef",
          text: "#0369A1",
          border: "1px solid #0369A1",
        };
      case "pending":
      default:
        return {
          label: "Pending",
          bg: "#FED7AA",
          text: "#92400E",
          border: "1px solid #92400E",
        };
    }
  };

  const handleMenuOpen = (event, concern) => {
    setAnchorEl(event.currentTarget);
    setSelectedConcern(concern);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleSelectRow = (messageId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = new Set(concerns.map((concern) => concern.message_id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  // 🔹 Execute Bulk Solve
  const handleBulkSolveClick = () => {
    const ids = Array.from(selectedRows);
    if (onBulkSolve) {
      onBulkSolve(ids);
    }
    setSelectedRows(new Set());
  };

  // 🔹 Execute Bulk Delete
  const handleBulkDeleteClick = () => {
    const ids = Array.from(selectedRows);
    if (onBulkDelete) {
      onBulkDelete(ids);
    }
    setSelectedRows(new Set());
  };

  const hasPendingSelected = () => {
    return Array.from(selectedRows).some((messageId) => {
      const concern = concerns.find((c) => c.message_id === messageId);
      return concern && (concern.status?.toLowerCase() === "pending" || !concern.status);
    });
  };

  const isResident = (concern) => {
    if(concern.type === "resident") {
      return true;
    } 
  }

  return (
    <Box>
      {selectedRows.size > 0 && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "action.selected",
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "600" }}>
            {selectedRows.size} item{selectedRows.size !== 1 ? "s" : ""}{" "}
            selected
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {hasPendingSelected() && (
              <Button
                size="small"
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                startIcon={<CheckIcon />}
                onClick={handleBulkSolveClick}
              >
                Solve
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Table sx={{ minWidth: 950, "& .MuiTableCell-root": { verticalAlign: "middle" } }} aria-label="concerns table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell
                sx={{ fontWeight: "bold", width: 50 }}
                padding="checkbox"
              >
                <Checkbox
                  indeterminate={
                    selectedRows.size > 0 && selectedRows.size < concerns.length
                  }
                  checked={
                    concerns.length > 0 && selectedRows.size === concerns.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sender</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Resident</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 110 }} align="center">Attachment</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Posted</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Urgency
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {concerns.map((concern) => (
              <TableRow
                key={concern.message_id}
                selected={selectedRows.has(concern.message_id)}
                sx={{
                  opacity: concern.status === "solved" ? 0.7 : 1,
                  "&:hover": { backgroundColor: "action.hover" },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.has(concern.message_id)}
                    onChange={() => handleSelectRow(concern.message_id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "500" }}>
                    {concern.first_name || concern.last_name
                      ? `${concern.first_name || ""} ${concern.last_name || ""}`
                      : "Anonymous"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {isResident(concern) ? "Yes" : "No"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {concern.message_type.toUpperCase().charAt(0) +
                      concern.message_type.slice(1) || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {truncateText(concern.message, 150)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={getAttachmentUrl(concern) ? "View attachment" : "No attachment"}>
                    <span>
                      <IconButton
                        aria-label={`View attachment for concern ${concern.message_id}`}
                        disabled={!getAttachmentUrl(concern)}
                        color="primary"
                        onClick={() => {
                          const url = getAttachmentUrl(concern);
                          if (!url) return;
                          setPreviewError(false);
                          setAttachmentPreview({
                            url,
                            name: new URL(url).pathname.split("/").pop() || "Attachment",
                            messageId: concern.message_id,
                            isImage: /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(new URL(url).pathname) ||
                              (concern.attachment_mime_type || "").startsWith("image/") ||
                              url === concern.image_url || url === concern.image,
                          });
                        }}
                        sx={{ borderRadius: 2, bgcolor: "action.hover", transition: "background-color 0.2s ease", "&:hover": { bgcolor: "action.selected" } }}
                      >
                        <PhotoLibraryIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(concern.date_posted).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getUrgentStyle(concern.message_urgency).label}
                    size="small"
                    sx={{
                      width: 105,
                      px: 2,
                      py: 2,
                      backgroundColor: getUrgentStyle(concern.message_urgency).bg,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      color: getUrgentStyle(concern.message_urgency).text,
                      border: getUrgentStyle(concern.message_urgency).border,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusStyle(concern.status).label}
                    size="small"
                    sx={{
                      width: 105,
                      px: 2,
                      py: 2,
                      backgroundColor: getStatusStyle(concern.status).bg,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      color: getStatusStyle(concern.status).text,
                      border: getStatusStyle(concern.status).border,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, concern)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      open && selectedConcern?.message_id === concern.message_id
                    }
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    {(selectedConcern?.status?.toLowerCase() === "pending" ||
                      !selectedConcern?.status) && (
                      <MenuItem
                        onClick={() => {
                          onEdit(selectedConcern);
                          handleMenuClose();
                        }}
                        sx={{ color: "success.main" }}
                      >
                        <CheckIcon sx={{ mr: 1, fontSize: "20px" }} />
                        Solved
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        onReport(selectedConcern);
                        handleMenuClose();
                      }}
                      sx={{ color: "warning.main" }}
                    >
                      <ReportIcon sx={{ mr: 1, fontSize: "20px" }} />
                      Report
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onDelete(selectedConcern);
                        handleMenuClose();
                      }}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon sx={{ mr: 1, fontSize: "20px" }} />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {concerns.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No concerns found.</Typography>
          </Box>
        )}
      </TableContainer>
      <Dialog
        open={Boolean(attachmentPreview)}
        onClose={closeAttachmentPreview}
        fullWidth
        maxWidth="md"
        aria-labelledby="concern-attachment-title"
        transitionDuration={250}
        slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
      >
        <DialogTitle id="concern-attachment-title" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="span" variant="h6" fontWeight={700}>Attachment preview</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
              Concern #{attachmentPreview?.messageId} · {attachmentPreview?.name}
            </Typography>
          </Box>
          <IconButton aria-label="Close attachment preview" onClick={closeAttachmentPreview}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mt: 2, p: 2, minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover", borderRadius: 2 }}>
            {attachmentPreview?.isImage && !previewError ? (
              <Box component="img" src={attachmentPreview.url} alt={attachmentPreview.name} onError={() => setPreviewError(true)} sx={{ display: "block", maxWidth: "100%", maxHeight: "65vh", objectFit: "contain", borderRadius: 1 }} />
            ) : previewError ? (
              <Alert severity="warning">The image could not be loaded. You can try opening the file directly.</Alert>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <PhotoLibraryIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                <Typography fontWeight={600}>File attachment</Typography>
                <Typography variant="body2" color="text.secondary">Open the file to view or download it.</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={closeAttachmentPreview} color="inherit">Close</Button>
          <Button component="a" href={attachmentPreview?.url} target="_blank" rel="noopener noreferrer" variant="contained" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 2 }}>Open file</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
