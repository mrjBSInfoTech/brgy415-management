import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Slide,
  Alert,
  TextField,
  Typography,
  Card,
  CardContent,
  Container,
  IconButton,
  Divider,
  Chip,
  FormHelperText,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { addConcern } from "../../api/public/concernsAPI";
import { getToken as authGetToken } from "../../utils/auth";
import Footer from "../../components/public/Footer";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Concerns() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    message_type: "",
    message: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");

  useEffect(() => {
    if (!attachment || !attachment.type.startsWith("image/")) {
      setAttachmentPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(attachment);
    setAttachmentPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [attachment]);

  useEffect(() => {
    const storedLoggedIn = authGetToken("public");
    setLoggedIn(!!storedLoggedIn);
  }, []);

  const handleSubmitConcern = async () => {
    if (!formData.message_type) {
      showSnackbar("Please select a message type", "error");
      return;
    }
    if (!formData.message.trim()) {
      showSnackbar("Please enter your message", "error");
      return;
    }

    try {
      await addConcern(formData);
      showSnackbar("Concern successfully submitted", "success");
      setFormData({ message_type: "", message: "" });
      setAttachment(null);
    } catch (err) {
      showSnackbar(err.message || "Error saving concern", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <Helmet titleTemplate="%s - Barangay 415 Zone 42">
        <title>Concerns</title>
      </Helmet>

      <Box
        sx={{
          background: "var(--primary-color)",
          color: "white",
          pt: { xs: 5, sm: 7, md: 9 },
          pb: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 3 },
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            fontWeight="800"
            sx={{ fontSize: { xs: "2rem", sm: "2.75rem" }, mb: 1 }}
          >
            Get in Touch
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.88, fontWeight: 400 }}>
            Have a complaint, concern, or feedback? Send us a message and we'll assist you immediately.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, flex: 1 }}>
        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: 2,
                p: { xs: 2.5, sm: 4 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Please fill out the form below. Logged-in residents receive direct updates on submitted concerns.
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  if (loggedIn) {
                    handleSubmitConcern();
                  } else {
                    showSnackbar("Please log in to send a message", "error");
                  }
                }}
                sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}
              >
                <TextField
                  select
                  fullWidth
                  label="Message Type"
                  value={formData.message_type}
                  onChange={(e) => setFormData({ ...formData, message_type: e.target.value })}
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                >
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="concerns">Concerns</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Message Details"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  multiline
                  minRows={5}
                  placeholder="Describe your issue or feedback in detail..."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />

                <Box>
                  <Button component="label" variant="outlined" fullWidth startIcon={<CloudUploadIcon />} sx={{ textTransform: "none", color:"var(--primary-color)", borderColor:"var(--primary-color)"}}>
                    Add attachment
                    <input
                      hidden
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (file && file.size <= 5 * 1024 * 1024) {
                          setAttachment(file);
                        } else if (file) {
                          showSnackbar("Please choose a file smaller than 5 MB", "error");
                        }
                      }}
                    />
                  </Button>
                  <FormHelperText>Optional. Add an image or supporting file up to 5 MB.</FormHelperText>
                </Box>

                {attachment && (
                  <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                      {attachmentPreview && (
                        <Box
                          component="img"
                          src={attachmentPreview}
                          alt="Selected attachment preview"
                          sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: 1 }}
                        />
                      )}
                      <Chip icon={<AttachFileIcon />} label={attachment.name} sx={{ maxWidth: "100%" }} />
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => setAttachment(null)}
                        sx={{ textTransform: "none" }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 1.5,
                    fontWeight: "bold",
                    bgcolor: "var(--primary-color)",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(30, 31, 135, 0.35)",
                    "&:hover": { filter: "brightness(0.85)" },
                  }}
                >
                  Submit Concern
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: 2,
                p: { xs: 1, sm: 2 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent id="contact-info" sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography variant="h5" fontWeight="bold" color="var(--primary-color)" mb={3}>
                  Contact Information
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, sm: 3 } }}>
                  
                  {/* Location */}
                  <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2.5 }, alignItems: "flex-start", minWidth: 0 }}>
                    <Box
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: 1.5,
                        flexShrink: 0,
                        bgcolor: "rgba(30, 31, 135, 0.08)",
                        color: "var(--primary-color)",
                      }}
                    >
                      <PlaceIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                        Location
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Barangay 415, Zone 42, Sampaloc, Manila, Philippines
                      </Typography>
                    </Box>
                  </Box>

                  {/* Contact Numbers */}
                  <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2.5 }, alignItems: "flex-start", minWidth: 0 }}>
                    <Box
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: 1.5,
                        flexShrink: 0,
                        bgcolor: "rgba(30, 31, 135, 0.08)",
                        color: "var(--primary-color)",
                      }}
                    >
                      <CallIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                        Contact Numbers
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Main: (02) 1234-5678
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mobile: 0917-123-4567
                      </Typography>
                    </Box>
                  </Box>

                  {/* Email */}
                  <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2.5 }, alignItems: "flex-start", minWidth: 0 }}>
                    <Box
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: 1.5,
                        flexShrink: 0,
                        bgcolor: "rgba(30, 31, 135, 0.08)",
                        color: "var(--primary-color)",
                      }}
                    >
                      <EmailIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                        Email Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        info@barangay415.gov.ph
                      </Typography>
                    </Box>
                  </Box>

                  {/* Office Hours */}
                  <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2.5 }, alignItems: "flex-start", minWidth: 0 }}>
                    <Box
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: 1.5,
                        flexShrink: 0,
                        bgcolor: "rgba(30, 31, 135, 0.08)",
                        color: "var(--primary-color)",
                      }}
                    >
                      <WatchLaterIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                        Office Hours
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Monday to Sunday: 8:00 AM - 12:00 AM
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>

              <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight="700" color="text.primary" mb={1.5}>
                  Follow Our Socials
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[
                    { icon: <FacebookIcon />, href: "https://facebook.com" },
                    { icon: <InstagramIcon />, href: "https://instagram.com" },
                    { icon: <XIcon />, href: "https://x.com" },
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: "#f1f5f9",
                        color: "var(--primary-color)",
                        "&:hover": { bgcolor: "var(--primary-color)", color: "white" },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}