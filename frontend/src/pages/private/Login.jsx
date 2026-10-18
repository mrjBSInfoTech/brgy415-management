import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
  Slide,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { loginUser } from "../../api/private/authenticationAPI";
import BarangayIcon from "../../assets/BarangayIcon.png";
import { hasValidToken, setToken } from "../../utils/auth";

// Slide Transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Check if user is already logged in with a valid token
  useEffect(() => {
    const privateToken = localStorage.getItem("private_token");
    if (privateToken && hasValidToken(privateToken)) {
      navigate("/private/dashboard", { replace: true });
    }
  }, [navigate]);

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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "success":
        return "success.light"; // Green
      case "error":
        return "error.light"; // Red
      default:
        return "primary.light";
    }
  };

  const handleLogin = async (event) => {
    event?.preventDefault();
    if (loading) return;
    if (!username || !password) {
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ username, password });

      setToken("private", data.token);

      localStorage.setItem("private_official_account_id", data.official_account_id);
      localStorage.setItem("private_password_changed", data.password_changed);
      localStorage.setItem("private_username", data.username);
      localStorage.setItem("private_account_type", data.account_type);
      localStorage.setItem("private_can_add", data.can_add);
      localStorage.setItem("private_can_edit", data.can_edit);
      localStorage.setItem("private_can_delete", data.can_delete);
      localStorage.setItem("private_first_name", data.first_name);
      localStorage.setItem("private_last_name", data.last_name);
      localStorage.setItem("private_position", data.position);
      localStorage.setItem("private_image", data.image);

      showSnackbar("Login successful!", "success");
      navigate("/private/dashboard", { replace: true });
    } catch (error) {
      showSnackbar(`Login failed: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        background: theme.palette.primary.main,
        overflowY: "auto",
      }}
    >
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>Login</title>
      </Helmet>

      <Paper
        elevation={24}
        style={{
          backgroundColor: theme.palette.background.paper,
          padding: isMobile ? "25px 20px" : "40px 35px", // Reduced padding
          borderRadius: "20px", // Slightly smaller radius
          width: "100%",
          maxWidth: "450px", // Reduced max width
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)", // Reduced shadow
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2, // Reduced margin
          }}
        >
          <Box
            component="img"
            src={BarangayIcon}
            alt="Barangay Logo"
            sx={{
              height: 50,
              width: "auto",
            }}
          />
        </Box>

        {/* Login Title */}
        <Typography
          variant="h6" // Changed from h5 to h6
          align="center"
          gutterBottom
          sx={{
            fontWeight: "600",
            color: "text.primary",
            mb: 3, // Reduced margin
            fontSize: { xs: "1.2rem", sm: "1.4rem" }, // Smaller font
          }}
        >
          Log In
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5, // Reduced gap
          }}
        >
          {/* Username Field */}
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                color: "text.primary",
                mb: 0.75, // Reduced margin
                ml: 0.5,
                fontSize: "0.95rem", // Smaller font
              }}
            >
              Username
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small" // Added small size
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon
                      sx={{ color: "primary.main", fontSize: "1.25rem" }}
                    />{" "}
                    {/* Smaller icon */}
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "10px", // Smaller radius
                  backgroundColor: "action.hover",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                    borderWidth: "2px",
                  },
                  fontSize: "0.95rem", // Smaller text
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                color: "text.primary",
                mb: 0.75, // Reduced margin
                ml: 0.5,
                fontSize: "0.95rem", // Smaller font
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              variant="outlined"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small" // Added small size
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "primary.main", fontSize: "1.25rem" }} />{" "}
                    {/* Smaller icon */}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((visible) => !visible)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "10px", // Smaller radius
                  backgroundColor: "action.hover",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                    borderWidth: "2px",
                  },
                  fontSize: "0.95rem", // Smaller text
                },
              }}
            />
          </Box>

          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={loading}
            aria-busy={loading}
            sx={{
              height: "48px", // Reduced height
              fontWeight: "700",
              textTransform: "none",
              fontSize: "16px", // Smaller font
              backgroundColor: "primary.main",
              borderRadius: "10px", // Smaller radius
              mt: 1.5, // Reduced margin
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-1px)", // Reduced lift
                boxShadow: `0px 8px 15px ${alpha(theme.palette.primary.main, 0.2)}`, // Reduced shadow
              },
              transition: "all 0.2s ease",
              boxShadow: `0px 4px 10px ${alpha(theme.palette.primary.main, 0.15)}`, // Reduced shadow
            }}
          >
            {loading ? <CircularProgress size={24} color="primary" aria-label="Logging in" /> : "Login"}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        severity={snackbarSeverity}
        variant="filled"
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
    </Container>
  );
};

export default Login;
