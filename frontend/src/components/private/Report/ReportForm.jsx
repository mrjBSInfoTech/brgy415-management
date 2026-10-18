import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Slide,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

export default function ReportForm({
  open,
  handleClose,
  onSubmit,
  selectedConcern,
  selectedReport,
}) {
  const [report, setReport] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!attachment || !attachment.type?.startsWith("image/")) {
      setAttachmentPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(attachment);
    setAttachmentPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [attachment]);

  useEffect(() => {
    if (open) {
      if (selectedReport) {
        setReport(selectedReport.report || "");
        setExistingAttachment(selectedReport.attachment || null);
        setAttachment(null);
      } else {
        setReport("");
        setAttachment(null);
        setExistingAttachment(null);
      }
      setError("");
    }
  }, [open, selectedConcern, selectedReport]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose a file smaller than 5 MB.");
      return;
    }

    setError("");
    setAttachment(file);
    setExistingAttachment(null);
  };

  const handleSubmit = () => {
    if (!report.trim()) {
      setError("Please describe the report before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("report", report.trim());

    if (attachment) {
      formData.append("attachment", attachment);
    } else if (existingAttachment) {
      formData.append("attachment", existingAttachment);
    }

    const messageId =
      selectedConcern?.message_id || selectedReport?.message_id || null;
    if (messageId) {
      formData.append("message_id", messageId);
    }

    const officialId = selectedReport?.official_id || null;
    if (officialId) {
      formData.append("official_id", officialId);
    }

    onSubmit?.(formData);
    handleClose();
  };

  const isEdit = Boolean(selectedReport);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {isEdit
          ? `Edit Report #${selectedReport.report_id}`
          : selectedConcern
          ? "Report Concern"
          : "Create Report"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {isEdit
                ? "Update report details and attachment."
                : "Add details and an optional attachment for this report."}
            </Typography>
          </Box>

          {selectedConcern?.message && (
            <TextField
              label="Concern Message"
              value={selectedConcern.message}
              multiline
              minRows={2}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}

          <TextField
            label="Report Details"
            value={report}
            onChange={(event) => setReport(event.target.value)}
            multiline
            minRows={5}
            fullWidth
            required
            placeholder="Describe the report findings, resolution, or notes..."
          />

          <Box>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ textTransform: "none" }}
            >
              {attachment || existingAttachment
                ? "Replace Attachment"
                : "Add Image or File"}
              <input
                hidden
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
            </Button>
            <FormHelperText>
              Images, PDF, DOC, DOCX, or TXT files up to 5 MB.
            </FormHelperText>
          </Box>

          {/* New file attachment preview */}
          {attachment && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ sm: "center" }}
              >
                {attachmentPreview && (
                  <Box
                    component="img"
                    src={attachmentPreview}
                    alt="Selected attachment preview"
                    sx={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                )}
                <Chip
                  icon={<AttachFileIcon />}
                  label={attachment.name}
                  sx={{ maxWidth: "100%" }}
                />
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setAttachment(null)}
                  sx={{ textTransform: "none", ml: "auto" }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          )}

          {/* Existing attachment display */}
          {!attachment && existingAttachment && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                justifyContent="space-between"
              >
                <Chip
                  icon={<AttachFileIcon />}
                  label={`Existing: ${existingAttachment}`}
                  sx={{ maxWidth: "80%" }}
                />
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setExistingAttachment(null)}
                  sx={{ textTransform: "none" }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ boxShadow: "none" }}
        >
          {isEdit ? "Save Changes" : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
