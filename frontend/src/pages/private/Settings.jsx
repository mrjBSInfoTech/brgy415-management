import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
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
import { fetchAlarmStatus, sendAlarmCommand } from "../../api/private/alarmAPI";
import { changePassword } from "../../api/private/authenticationAPI";
import { fetchBrgyInfo, updateBrgyInfo } from "../../api/private/brgyInfoAPI";
import ChangePassword from "../../components/private/Settings/ChangePassword";
import PortForm from "../../components/private/Settings/PortForm";
import BrgyInfoForm from "../../components/private/Settings/BrgyInfoForm";
import InfoIcon from "@mui/icons-material/Info";

// Slide Transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Settings() {
  const location = useLocation();
  const [port, setPort] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portErrorMessage, setPortErrorMessage] = useState("");
  const [openPortForm, setOpenPortForm] = useState(false);
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [openBrgyInfoForm, setOpenBrgyInfoForm] = useState(false);
  const [brgyInfo, setBrgyInfo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [profile, setProfile] = useState({});
  const [alarmStatus, setAlarmStatus] = useState(null);
  const [alarmError, setAlarmError] = useState("");
  const [alarmLoading, setAlarmLoading] = useState(true);
  const [alarmCommandLoading, setAlarmCommandLoading] = useState("");
  const refreshAlarmRef = useRef(null);

  useEffect(() => {
    if (location.state?.changePassword) setOpenPasswordForm(true);
  }, [location.key, location.state]);

  // Fetch all ports from API
  const loadPort = async () => {
    try {
      setLoading(true);
      const data = await fetchPorts();
      setPort(data?.[0] || {});
      setPortErrorMessage("");
    } catch (err) {
      console.error("Error loading ports:", err);
      setPortErrorMessage("Failed to load ports: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Barangay Info
  const loadBrgyInfo = async () => {
    try {
      setLoading(true);
      const data = await fetchBrgyInfo();
      setBrgyInfo(data || {});
    } catch (err) {
      console.error("Error loading brgy info:", err);
      showSnackbar("Failed to load barangay info", "error");
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
      showSnackbar("Wi-Fi/IP address updated successfully", "success");
      await loadPort();
      setOpenPortForm(false);
    } catch (err) {
      console.error("Error saving port:", err);
      setPortErrorMessage(err.message || "Error saving port");
    }
  };

  // ========== BRGY INFO HANDLERS ==========
  const handleOpenBrgyInfoEdit = () => {
    setOpenBrgyInfoForm(true);
  };

  const handleSubmitBrgyInfo = async (formData) => {
    try {
      if (!brgyInfo || !brgyInfo.info_id) {
        throw new Error("No barangay info found to update.");
      }
      await updateBrgyInfo(brgyInfo.info_id, formData);
      showSnackbar("Barangay info updated successfully", "success");
      await loadBrgyInfo();
      setOpenBrgyInfoForm(false);
    } catch (err) {
      console.error("Error saving barangay info:", err);
      showSnackbar("Error saving barangay info: " + err.message, "error");
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
    let active = true;
    let inFlight = false;
    let controller;

    const refresh = async () => {
      if (!active || inFlight) return;
      inFlight = true;
      controller = new AbortController();
      setAlarmLoading(true);
      try {
        const status = await fetchAlarmStatus({ signal: controller.signal });
        if (!active) return;
        setAlarmStatus(status);
        setAlarmError("");

        // A local IP is only used by the original HTTP connection.
        if (status.transport === "http") {
          try {
            const data = await fetchPorts();
            if (active) {
              setPort(data?.[0] || {});
              setPortErrorMessage("");
            }
          } catch (error) {
            if (active) setPortErrorMessage(error.message);
          }
        }
      } catch (error) {
        if (active) setAlarmError(error.message);
      } finally {
        inFlight = false;
        if (active) setAlarmLoading(false);
      }
    };

    refreshAlarmRef.current = refresh;
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => {
      active = false;
      clearInterval(interval);
      controller?.abort();
      refreshAlarmRef.current = null;
    };
  }, []);

  const handleAlarmCommand = async (level) => {
    if (alarmCommandLoading) return;
    setAlarmCommandLoading(level);
    try {
      const result = await sendAlarmCommand(level);
      const severity =
        result.status === "confirmed"
          ? "success"
          : result.status === "unavailable"
            ? "error"
            : result.status === "unconfirmed"
              ? "warning"
              : "info";
      showSnackbar(result.message || "Alarm request completed.", severity);
      refreshAlarmRef.current?.();
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setAlarmCommandLoading("");
    }
  };

  useEffect(() => {
    loadBrgyInfo();
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

  const alarmDeviceStatus =
    alarmError || !alarmStatus?.connected ? "unknown" : alarmStatus.deviceStatus;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "success":
        return "success.light"; // Green
      case "error":
        return "error.light"; // Red
      case "warning":
        return "warning.dark";
      default:
        return "primary.light";
    }
  };

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
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                  fontWeight: 700,
                  boxShadow: (theme) => `0 0 0 6px ${theme.palette.action.hover}`,
                  mb: 2,
                }}
              >
                {profileInitials}
              </Avatar>

              <Typography variant="h6" fontWeight="700" color="primary.main">
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
                    bgcolor: "primary.main",
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
                    color: "primary.main",
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
                      color: "primary.main",
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
                      bgcolor: "action.hover",
                      color: "primary.main",
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
                    bgcolor: "primary.main",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 2.5,
                    alignSelf: { xs: "stretch", sm: "auto" },
                    boxShadow: "none",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Paper>

            {/* IoT Alarm Configuration Card */}
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
                IoT Alarm
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
                      bgcolor: "action.hover",
                      color: "primary.main",
                    }}
                  >
                    <RouterIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight="700">
                      {alarmStatus?.transport === "mqtt"
                        ? "MQTT connection"
                        : alarmStatus?.transport === "http"
                          ? "Wi-Fi/IP address"
                          : "Alarm connection"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {alarmStatus?.transport === "mqtt" ? (
                        "The device connects through the internet. Its Wi-Fi address can change."
                      ) : alarmStatus?.transport === "http" ? (
                        <>Current address: <strong>{port?.port_number || "Not available"}</strong></>
                      ) : alarmError ? (
                        "Unable to check the alarm connection."
                      ) : (
                        "Checking the alarm connection..."
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  {alarmStatus?.transport === "mqtt" && (
                    <Chip
                      size="small"
                      label={`MQTT ${alarmDeviceStatus === "online" ? "Online" : alarmDeviceStatus === "offline" ? "Offline" : "Unknown"}`}
                      color={alarmDeviceStatus === "online" ? "success" : alarmDeviceStatus === "offline" ? "warning" : "default"}
                    />
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => refreshAlarmRef.current?.()}
                    disabled={alarmLoading}
                    sx={{ textTransform: "none" }}
                  >
                    {alarmLoading ? "Checking..." : "Refresh"}
                  </Button>
                  {alarmStatus?.transport === "http" && !alarmError && (
                    <Button
                      variant="contained"
                      disabled={!port?.port_id}
                      onClick={() => handleOpenPortEdit(port)}
                      sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
                    >
                      Configure
                    </Button>
                  )}
                </Stack>
              </Box>

              {alarmError && <Alert severity="warning" sx={{ mt: 2 }}>{alarmError}</Alert>}
              {!alarmError && alarmStatus?.transport === "http" && portErrorMessage && (
                <Alert severity="warning" sx={{ mt: 2 }}>{portErrorMessage}</Alert>
              )}
              {alarmStatus?.transport === "mqtt" && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {!alarmError && (!alarmStatus.configured || !alarmStatus.connected) && (
                    <Alert severity="warning">
                      {alarmStatus.message || (alarmStatus.configured
                        ? "The alarm server is disconnected. Alarm delivery is unavailable."
                        : "MQTT setup is incomplete. Configure it on the server first.")}
                    </Alert>
                  )}
                  {alarmStatus.lastDelivery && (
                    <Typography variant="body2" color="text.secondary">
                      Last alarm: {alarmStatus.lastDelivery.message || ({
                        confirmed: "Confirmed by the device.",
                        unconfirmed: "No confirmation received from the device.",
                        unavailable: "Alarm delivery unavailable.",
                        sent: "Command sent.",
                      }[alarmStatus.lastDelivery.status] || "Delivery status unknown.")}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Test alarm sounds the buzzer. Stop it with Clear alarm or the device button.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      variant="contained"
                      disabled={Boolean(alarmCommandLoading) || Boolean(alarmError) || !alarmStatus.configured || !alarmStatus.connected}
                      onClick={() => handleAlarmCommand("high")}
                      sx={{ textTransform: "none" }}
                    >
                      {alarmCommandLoading === "high" ? "Testing..." : "Test alarm"}
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={Boolean(alarmCommandLoading) || Boolean(alarmError) || !alarmStatus.configured || !alarmStatus.connected}
                      onClick={() => handleAlarmCommand("clear")}
                      sx={{ textTransform: "none" }}
                    >
                      {alarmCommandLoading === "clear" ? "Clearing..." : "Clear alarm"}
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Paper>


          </Stack>
        </Grid>
      </Grid>

      {/* Barangay Information Configuration Card (Admin Only) */}
      {profile.accountType === "Admin" && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: { xs: 2, md: 3 },
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
            Barangay Information Configuration
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
                  bgcolor: "action.hover",
                  color: "primary.main",
                }}
              >
                <InfoIcon />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight="700">
                  {brgyInfo?.brgy_name || "Barangay Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alter mission, vision, history, logo, and color scheme.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleOpenBrgyInfoEdit}
              sx={{
                    bgcolor: "primary.main",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 2.5,
                    alignSelf: { xs: "stretch", sm: "auto" },
                    boxShadow: "none",
                    "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Configure
            </Button>
          </Box>
        </Paper>
      )}

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
      <BrgyInfoForm
        open={openBrgyInfoForm}
        handleClose={() => setOpenBrgyInfoForm(false)}
        onSubmit={handleSubmitBrgyInfo}
        initialData={brgyInfo}
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
          sx={{
            width: "100%",
            backgroundColor: getSeverityColor(snackbarSeverity),
            color: "#fff",
            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
