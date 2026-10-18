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
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { Slide } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ResidentCard from "../../components/private/Residents/ResidentCard";
import ResidentTable from "../../components/private/Residents/ResidentTable";
import ResidentsForm from "../../components/private/Residents/ResidentsForm";
import ResidentBulkAdd from "../../components/private/Residents/ResidentBulkAdd";
import ResidentsDelete from "../../components/private/Residents/ResidentsDelete";
import {
  fetchResidents,
  addResident,
  bulkAddResidents,
  updateResident,
  deleteResident,
} from "../../api/private/residentAPI";
import { fetchHouseholds } from "../../api/private/householdAPI";
import { useRef } from "react";
import * as XLSX from "xlsx";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TableRowsIcon from "@mui/icons-material/TableRows";

// Slide Transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Resident() {
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [openResidentForm, setOpenResidentForm] = useState(false);
  const [openBulkAdd, setOpenBulkAdd] = useState(false);
  const [openResidentDelete, setOpenResidentDelete] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [residentErrorMessage, setResidentErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Fetch all households from API
  const loadHouseholds = async () => {
    try {
      const data = await fetchHouseholds();
      console.log("Households loaded:", data);
      setHouseholds(data || []);
    } catch (err) {
      console.error("Error loading households:", err);
      setHouseholds([]);
    }
  };

  // Fetch all residents from API
  const loadResidents = async () => {
    try {
      setLoading(true);
      const data = await fetchResidents();
      console.log("Residents loaded:", data);
      setResidents(data || []);
    } catch (err) {
      console.error("Error loading residents:", err);
      setResidentErrorMessage(
        "Failed to load residents: " + err.message,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Load residents and households
  useEffect(() => {
    loadResidents();
    loadHouseholds();
  }, []);

  // ========== RESIDENT HANDLERS ==========
  // ➕ Open Add Resident Modal
  const handleOpenResidentAdd = () => {
    setSelectedResident(null);
    setOpenResidentForm(true);
  };

  // ✏️ Open Edit Resident Modal
  const handleOpenResidentEdit = (resident) => {
    setSelectedResident(resident);
    setOpenResidentForm(true);
  };

  // 🗑️ Open Delete Resident Modal
  const handleOpenResidentDelete = (resident) => {
    setSelectedResident(resident);
    setOpenResidentDelete(true);
  };

  // Submit (Add or Edit) Resident
  const handleSubmitResident = async (formData) => {
    try {
      if (selectedResident) {
        await updateResident(selectedResident.resident_id, formData);
        showSnackbar("Resident updated successfully", "success");
      } else {
        await addResident(formData);
        showSnackbar("Resident added successfully", "success");
      }
      await loadResidents();
      setOpenResidentForm(false);
    } catch (err) {
      console.error("Error saving resident:", err);
      setResidentErrorMessage(err.message || "Error saving resident", "error");
    }
  };

  // Delete Resident
  const handleDeleteResident = async (id) => {
    try {
      await deleteResident(id);
      await loadResidents();
      setOpenResidentDelete(false);
      showSnackbar("Resident deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting resident:", err, "error");
      setResidentErrorMessage(
        err.message || "Error deleting resident",
        "error",
      );
    }
  };

  // Filter residents based on search query and gender filter
  const filteredResidents = residents.filter((resident) => {
    const fullName =
      `${resident.first_name || ""} ${resident.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());

    const matchesGender =
      genderFilter === "" || resident.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  const accountType = localStorage.getItem("private_account_type");
  const isAdmin = accountType === "Admin";
  const isStaff = accountType === "Staff";
  const canAdd =
    (isAdmin || isStaff) && localStorage.getItem("private_can_add") === "1";

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
        <title>Resident</title>
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
          Residents
        </Typography>
        {canAdd && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenResidentAdd}
            sx={{
              width: { xs: "100%", sm: 150 },
              height: { xs: 35, sm: 45 },
              minWidth: { xs: 45, sm: 50 },
              fontSize: { xs: 12, sm: 16 },
              padding: 0,
            }}
          >
            Add Resident
          </Button>
        )}
      </Box>

      {/* Filter Section */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
        <Typography variant="h6">Filter</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            mb: 2,
            mt: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search residents..."
            size="small"
            sx={{
              width: { xs: "100%", sm: 300 },
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
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 180 } }}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                label="Gender"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* View modes */}
      <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }} variant="outlined">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={viewMode === "grid" ? "contained" : "outlined"}
            startIcon={<ViewModuleIcon />}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "table" ? "contained" : "outlined"}
            startIcon={<TableRowsIcon />}
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
        </Box>
      </Paper>

      {/* Residents Display */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resident List
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : residentErrorMessage ? (
          <Typography align="center" color="error" sx={{ py: 3 }}>
            {residentErrorMessage}
          </Typography>
        ) : filteredResidents.length > 0 ? (
          viewMode === "table" ? (
            <ResidentTable
              residents={filteredResidents}
              onEdit={handleOpenResidentEdit}
              onDelete={handleOpenResidentDelete}
              households={households}
            />
          ) : (
            <ResidentCard
              residents={filteredResidents}
              onEdit={handleOpenResidentEdit}
              onDelete={handleOpenResidentDelete}
              households={households}
            />
          )
        ) : (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            {searchQuery || genderFilter
              ? "No residents match your search."
              : "No residents found. Add your first resident!"}
          </Typography>
        )}
      </Paper>

      {/* ========== RESIDENT MODALS ========== */}
      <ResidentsForm
        open={openResidentForm}
        handleClose={() => setOpenResidentForm(false)}
        onSubmit={handleSubmitResident}
        selectedResident={selectedResident}
        households={households}
        onOpenBulkImport={() => setOpenBulkAdd(true)}
      />
      
      <ResidentBulkAdd 
        open={openBulkAdd}
        handleClose={() => setOpenBulkAdd(false)}
        onSuccess={loadResidents}
        showSnackbar={showSnackbar}
      />

      <ResidentsDelete
        open={openResidentDelete}
        handleClose={() => setOpenResidentDelete(false)}
        onSubmit={handleDeleteResident}
        selectedResident={selectedResident}
        mode="delete"
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
