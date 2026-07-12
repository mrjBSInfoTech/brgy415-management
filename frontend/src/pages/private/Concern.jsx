import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Slide,
  Snackbar,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Card,
  CardContent,
  Divider,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchConcerns, updateConcern, deleteConcern } from "../../api/private/concernAPI";
import ConcernDelete from "../../components/private/Concern/ConcernDelete";
import ConcernCard from "../../components/private/Concern/ConcernCard";
import ConcernTable from "../../components/private/Concern/ConcernTable";

// Slide Transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Concern() {
  const [concerns, setConcerns] = useState([]);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [openConcernDelete, setOpenConcernDelete] = useState(false);
  const [concernErrorMessage, setConcernErrorMessage] = useState("");
  const [date, setDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [part, setPart] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch all residents from API
  const loadConcerns = async () => {
    try {
      setLoading(true);
      const data = await fetchConcerns();
      console.log("Concerns loaded:", data);
      setConcerns(data || []);
    } catch (err) {
      console.error("Error loading concerns:", err);
      setConcernErrorMessage(
        "Failed to load concerns: " + err.message,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcerns();
  }, []);

  // Open Delete Concern Modal
  const handleOpenConcernDelete = (concern) => {
    setSelectedConcern(concern);
    setOpenConcernDelete(true);
  };

  // ========== CONCERN HANDLERS ==========
  // Submit Concern
  const handleSubmitConcern = async (formData) => {
    try {
      await updateConcern(selectedConcern.message_id, formData);
      showSnackbar("Concern updated successfully", "success");
      await loadConcerns();
    } catch (err) {
      console.error("Error saving concern:", err, "error");
      setConcernErrorMessage(err.message || "Error saving concern", "error");
    }
  };
  // Handle marking concern as solved
  const handleSolveConcern = async (concern) => {
    try {
      await updateConcern(concern.message_id, { status: "solved" });
      showSnackbar("Concern marked as solved", "success");
      await loadConcerns();
    } catch (err) {
      console.error("Error updating concern:", err, "error");
      setConcernErrorMessage(err.message);
    }
  };

  // Delete concern
  const handleDeleteConcern = async (concern) => {
    try {
      // You'll need to add a deleteConcern API function
      await deleteConcern(concern.message_id);
      setOpenConcernDelete(false);
      showSnackbar("Concern deleted", "success");
      await loadConcerns();
    } catch (err) {
      console.error("Error deleting concern:", err, "error");
      setConcernErrorMessage(err.message);
    }
  };

  // Filter concerns by status, search query and urgency
  const filteredPendingConcerns = concerns.filter((concern) => {
    const fullName =
      `${concern.first_name || ""} ${concern.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesUrgency =
      urgencyFilter === "" || concern.message_urgency === urgencyFilter;
    const matchesType =
      typeFilter === "" ||
      concern.message_type?.toLowerCase() === typeFilter.toLowerCase();

    const isPending = concern.status === "pending" || !concern.status;

    if (!date) {
      return matchesSearch && matchesUrgency && matchesType && isPending;
    }

    const concernDate = new Date(concern.date_posted).toDateString();
    const selectedDate = date.toDate().toDateString();

    return (
      matchesSearch &&
      matchesUrgency &&
      matchesType &&
      isPending &&
      concernDate === selectedDate
    );
  });

  const filteredSolvedConcerns = concerns.filter((concern) => {
    const fullName =
      `${concern.first_name || ""} ${concern.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesUrgency =
      urgencyFilter === "" || concern.message_urgency === urgencyFilter;
    const matchesType =
      typeFilter === "" ||
      concern.message_type?.toLowerCase() === typeFilter.toLowerCase();

    const isSolved = concern.status === "solved";

    if (!date) {
      return matchesSearch && matchesUrgency && matchesType && isSolved;
    }

    const concernDate = new Date(concern.date_posted).toDateString();
    const selectedDate = date.toDate().toDateString();

    return (
      matchesSearch &&
      matchesUrgency &&
      matchesType &&
      isSolved &&
      concernDate === selectedDate
    );
  });

  // Toggle handlers
  const goToPartTwo = () => setPart(2);
  const goToPartOne = () => setPart(1);

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

  return (
    <Box p={3}>
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>Concern</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: { xs: 24, sm: 32 } }}
        >
          {part === 1 ? "Concern - Pending" : "Concern - Solved"}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={part === 1 ? goToPartTwo : goToPartOne}
          sx={{
            width: { xs: "100%", sm: 150 },
            height: { xs: 35, sm: 45 },
            minWidth: { xs: 45, sm: 50 },
            fontSize: { xs: 12, sm: 16 },
            padding: 0,
          }}
        >
          {part === 1 ? "Solved" : "Back"}
        </Button>
      </Box>

      {/* Conditional Content */}
      {part === 1 && (
        <>
          {/* Filter Section */}
          <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
            <Typography variant="h6">Filter</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", lg: "center" },
                gap: 2,
                mb: 2,
                mt: 2,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search concerns..."
                size="small"
                sx={{
                  width: { xs: "100%", lg: 300 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                  gap: 2,
                  width: { xs: "100%", lg: "auto" },
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    enableAccessibleFieldDOMStructure={false}
                    slots={{ textField: TextField }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                    sx={{
                      width: { xs: "100%", lg: 200 },
                    }}
                  />
                </LocalizationProvider>
                <FormControl
                  size="small"
                  sx={{ width: { xs: "100%", lg: 180 } }}
                >
                  <InputLabel>Urgency</InputLabel>
                  <Select
                    name="urgency"
                    label="Urgency"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  size="small"
                  sx={{ width: { xs: "100%", lg: 180 } }}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    label="Type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="complaint">Complaint</MenuItem>
                    <MenuItem value="concerns">Concerns</MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Concern List
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : concernErrorMessage ? (
              <Typography align="center" color="error" sx={{ py: 3 }}>
                {concernErrorMessage}
              </Typography>
            ) : filteredPendingConcerns.length > 0 ? (
              <ConcernTable
                concerns={filteredPendingConcerns}
                onEdit={handleSolveConcern}
                onDelete={handleOpenConcernDelete}
              />
            ) : (
              <Typography
                color="textSecondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                No pending concerns found
              </Typography>
            )}
          </Paper>
        </>
      )}

      {part === 2 && (
        <>
          {/* Filter Section */}
          <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
            <Typography variant="h6">Filter</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", lg: "center" },
                gap: 2,
                mb: 2,
                mt: 2,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search concerns..."
                size="small"
                sx={{
                  width: { xs: "100%", lg: 300 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                  gap: 2,
                  width: { xs: "100%", lg: "auto" },
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    enableAccessibleFieldDOMStructure={false}
                    slots={{ textField: TextField }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                    sx={{
                      width: { xs: "100%", lg: 200 },
                    }}
                  />
                </LocalizationProvider>
                <FormControl
                  size="small"
                  sx={{ width: { xs: "100%", lg: 180 } }}
                >
                  <InputLabel>Urgency</InputLabel>
                  <Select
                    name="urgency"
                    label="Urgency"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  size="small"
                  sx={{ width: { xs: "100%", lg: 180 } }}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    label="Type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="complaint">Complaint</MenuItem>
                    <MenuItem value="concerns">Concerns</MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Solved Concern List
            </Typography>
            {loading ? (
              <LinearProgress />
            ) : concernErrorMessage ? (
              <Typography align="center" color="error" sx={{ py: 3 }}>
                {concernErrorMessage}
              </Typography>
            ) : filteredSolvedConcerns.length > 0 ? (
              <ConcernTable
                concerns={filteredSolvedConcerns}
                onEdit={handleSolveConcern}
                onDelete={handleOpenConcernDelete}
              />
            ) : (
              <Typography
                color="textSecondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                No solved concerns found
              </Typography>
            )}
          </Paper>
        </>
      )}
      {/* Concern Modals */}
      <ConcernDelete
        open={openConcernDelete}
        handleClose={() => setOpenConcernDelete(false)}
        onSubmit={handleDeleteConcern}
        selectedConcern={selectedConcern}
      />
      {/* Snackbar Notification */}
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
    </Box>
  );
}
