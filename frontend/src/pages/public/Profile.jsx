import { useEffect, useState } from "react";
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
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

// Icons
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import { changePassword } from "../../api/public/authenticationAPI";
import ChangePassword from "../../components/public/Profile/ChangePassword";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const getStoredValue = (key) => {
    const value = localStorage.getItem(key);

    return value && value !== "undefined" && value !== "null" ? value : "";
  };

  useEffect(() => {
    setProfile({
      first_name: getStoredValue("public_first_name"),
      last_name: getStoredValue("public_last_name"),
      email: getStoredValue("public_email"),
      contact: getStoredValue("public_contact"),
      status: getStoredValue("public_status"),
      type:
        getStoredValue("public_type") ||
        getStoredValue("public_account_type"),
      date_created: getStoredValue("public_date_created"),
    });
  }, []);

  const profileName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "User Profile";

  const initials =
    profileName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSubmitPassword = async ({ currentPassword, newPassword }) => {
    try {
      await changePassword(currentPassword, newPassword);

      setOpenPasswordForm(false);
      showSnackbar("Password updated successfully.", "success");
    } catch (error) {
      console.error("Error updating password:", error);

      showSnackbar(
        `Failed to update password: ${error.message || "Please try again."}`,
        "error",
      );
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not specified";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const profileFields = [
    {
      label: "First Name",
      value: profile.first_name,
      icon: <PersonOutlineIcon />,
    },
    {
      label: "Last Name",
      value: profile.last_name,
      icon: <BadgeOutlinedIcon />,
    },
    {
      label: "Email Address",
      value: profile.email,
      icon: <EmailOutlinedIcon />,
    },
    {
      label: "Contact Number",
      value: profile.contact,
      icon: <PhoneOutlinedIcon />,
    },
    {
      label: "Account Status",
      value: profile.status,
      icon: <VerifiedUserOutlinedIcon />,
      isStatus: true,
    },
    {
      label: "Account Type",
      value: profile.type,
      icon: <BadgeOutlinedIcon />,
    },
    {
      label: "Date Created",
      value: formatDate(profile.date_created),
      icon: <CalendarMonthOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          "linear-gradient(135deg, #f5f7ff 0%, #ffffff 55%, #eef1ff 100%)",
      }}
    >
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>Profile</title>
      </Helmet>

      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#151663",
              fontWeight: 800,
              fontSize: { xs: "1.8rem", sm: "2.25rem" },
            }}
          >
            My Profile
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.7 }}>
            View your account information and manage your password.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: 4,
                  border: "1px solid rgba(30, 31, 135, 0.08)",
                  boxShadow: "0 12px 35px rgba(30, 31, 135, 0.08)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#151663",
                    fontWeight: 800,
                    mb: 3,
                  }}
                >
                  Personal Information
                </Typography>

                <Grid container spacing={2}>
                  {profileFields.map((field) => (
                    <Grid
                      key={field.label}
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          minHeight: 76,
                          p: 2,
                          borderRadius: 3,
                          bgcolor: "#f8f9ff",
                          border: "1px solid rgba(30, 31, 135, 0.06)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2.5,
                            color: "#1e1f87",
                            bgcolor: "rgba(30, 31, 135, 0.1)",
                          }}
                        >
                          {field.icon}
                        </Box>

                        <Box sx={{ minWidth: 0, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              mb: 0.3,
                            }}
                          >
                            {field.label}
                          </Typography>

                          {field.isStatus && field.value ? (
                            <Chip
                              label={field.value}
                              size="small"
                              color={
                                field.value.toLowerCase() === "verified"
                                  ? "success"
                                  : "warning"
                              }
                              sx={{
                                fontWeight: 700,
                                textTransform: "capitalize",
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 700,
                                color: "#252733",
                                wordBreak: "break-word",
                                textTransform:
                                  field.label === "Account Type"
                                    ? "capitalize"
                                    : "none",
                              }}
                            >
                              {field.value || "Not specified"}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: 4,
                  border: "1px solid rgba(30, 31, 135, 0.08)",
                  boxShadow: "0 12px 35px rgba(30, 31, 135, 0.08)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 3,
                        color: "#1e1f87",
                        bgcolor: "rgba(30, 31, 135, 0.1)",
                      }}
                    >
                      <LockResetIcon />
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#151663",
                          fontWeight: 800,
                        }}
                      >
                        Password & Security
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Keep your account secure by updating your password.
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<LockResetIcon />}
                    onClick={() => setOpenPasswordForm(true)}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      px: 2.5,
                      py: 1.2,
                      borderRadius: 2.5,
                      bgcolor: "#1e1f87",
                      textTransform: "none",
                      fontWeight: 800,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#151663",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <ChangePassword
        open={openPasswordForm}
        handleClose={() => setOpenPasswordForm(false)}
        onSubmit={handleSubmitPassword}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
