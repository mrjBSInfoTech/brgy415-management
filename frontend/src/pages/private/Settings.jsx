import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Snackbar,
  Slide,
  IconButton,
  Tooltip,
} from "@mui/material";

// Icons
import LockResetIcon from "@mui/icons-material/LockReset";
import RouterIcon from "@mui/icons-material/Router";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import SecurityIcon from "@mui/icons-material/Security";
import EditIcon from "@mui/icons-material/Edit";

import { fetchPorts, updatePort } from "../../api/private/portAPI";
import { changePassword } from "../../api/private/authenticationAPI";
import ChangePassword from "../../components/private/Settings/ChangePassword";
import PortForm from "../../components/private/Settings/PortForm";

// Slide Transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Settings() {
  const [port, setPort] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portErrorMessage, setPortErrorMessage] = useState("");
  const [openPortForm, setOpenPortForm] = useState(false);
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [profile, setProfile] = useState({});

  // Fetch all ports from API
  const loadPort = async () => {
    try {
      setLoading(true);
      const data = await fetchPorts();
      setPort(data?.[0] || {});
    } catch (err) {
      console.error("Error loading ports:", err);
      setPortErrorMessage("Failed to load ports: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== PASSWORD HANDLERS ==========
  const handleOpenPasswordEdit = () => {
    setOpenPasswordForm(true);
  };

  const handleSubmitPassword = async (formData) => {
    try {
      const { currentPassword, newPassword } = formData;
      if (currentPassword && newPassword) {
        await changePassword(currentPassword, newPassword);
      }
      showSnackbar("Password updated successfully", "success");
      setOpenPasswordForm(false);
    } catch (err) {
      console.error("Error updating password:", err);
      showSnackbar("Failed to update password: " + err.message, "error");
    }
  };

  // ========== PORT HANDLERS ==========
  const handleOpenPortEdit = (selectedPort) => {
    setPort(selectedPort);
    setOpenPortForm(true);
  };

  const handleSubmitPort = async (formData) => {
    try {
      await updatePort(port.port_id, formData);
      showSnackbar("Port updated successfully", "success");
      await loadPort();
      setOpenPortForm(false);
    } catch (err) {
      console.error("Error saving port:", err);
      setPortErrorMessage(err.message || "Error saving port");
    }
  };

  // Snackbar handlers
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const getStoredValue = (key) => {
    const value = localStorage.getItem(key);
    return value && value !== "undefined" && value !== "null" ? value : "";
  };

  useEffect(() => {
    loadPort();
    setProfile({
      firstName: getStoredValue("private_first_name"),
      lastName: getStoredValue("private_last_name"),
      username: getStoredValue("private_username"),
      accountType: getStoredValue("private_account_type") || "Administrator",
      position: getStoredValue("private_position"),
      contact: getStoredValue("private_contact"),
      image: getStoredValue("private_image"),
    });
  }, []);

  const profileName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.username ||
    "Current user";

  const profileInitials = profileName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Box p={3}>
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>Settings</title>
      </Helmet>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: { xs: 24, sm: 32 } }}
        >
          Settings
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="700"
              color="text.primary"
              mb={3}
            >
              Profile Overview
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={
                  profile.image
                    ? `http://localhost:5000/uploads/uploadOfficial/${encodeURIComponent(profile.image)}`
                    : undefined
                }
                imgProps={{
                  onError: (event) => {
                    event.currentTarget.style.display = "none";
                  },
                }}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#1e1f87",
                  fontSize: "2rem",
                  fontWeight: 700,
                  boxShadow: "0 0 0 6px rgba(30, 31, 135, 0.1)",
                  mb: 2,
                }}
              >
                {profileInitials}
              </Avatar>

              <Typography variant="h6" fontWeight="700" color="#1e1f87">
                {profileName}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                mt={1}
                justifyContent="center"
                flexWrap="wrap"
              >
                <Chip
                  label={profile.accountType}
                  size="small"
                  sx={{
                    bgcolor: "#1e1f87",
                    color: "white",
                    fontWeight: 700,
                  }}
                />
                {profile.position && (
                  <Chip
                    label={profile.position}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Stack>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    color: "#1e1f87",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonOutlineIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Username
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {profile.username || "Not specified"}
                  </Typography>
                </Box>
              </Box>

              {profile.contact && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "background.default",
                      color: "#1e1f87",
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Contact Number
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {profile.contact}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="700"
                color="text.primary"
                mb={2}
              >
                Security Settings
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                  justifyContent: "space-between",
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: "rgba(30, 31, 135, 0.08)",
                      color: "#1e1f87",
                    }}
                  >
                    <LockResetIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight="700">
                      Account Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Change your password regularly to secure your account.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleOpenPasswordEdit}
                  sx={{
                    bgcolor: "#1e1f87",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 2.5,
                    alignSelf: { xs: "stretch", sm: "auto" },
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#151663" },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Paper>

            {/* Server / Port Configuration Card */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="700"
                color="text.primary"
                mb={2}
              >
                System Configuration
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                  justifyContent: "space-between",
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: "rgba(30, 31, 135, 0.08)",
                      color: "#1e1f87",
                    }}
                  >
                    <RouterIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight="700">
                      Port Configuration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Port:{" "}
                      <strong>{port?.port_number || "Loading..."}</strong>
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => handleOpenPortEdit(port)}
                  sx={{
                    borderColor: "#1e1f87",
                    color: "#1e1f87",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 2.5,
                    alignSelf: { xs: "stretch", sm: "auto" },
                    "&:hover": {
                      bgcolor: "rgba(30, 31, 135, 0.05)",
                      borderColor: "#1e1f87",
                    },
                  }}
                >
                  Configure
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      {/* MODALS */}
      <ChangePassword
        open={openPasswordForm}
        handleClose={() => setOpenPasswordForm(false)}
        onSubmit={handleSubmitPassword}
      />
      <PortForm
        open={openPortForm}
        handleClose={() => setOpenPortForm(false)}
        onSubmit={handleSubmitPort}
        selectedPort={port}
      />

      {/* SNACKBAR NOTIFICATION */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
