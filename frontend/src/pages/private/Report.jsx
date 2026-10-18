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
} from "@mui/material";
import { fetchReports, updateReport, deleteReport } from "../../api/private/reportAPI";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Export from "../../components/private/Report/Export";
import SearchIcon from "@mui/icons-material/Search";
import ReportCard from "../../components/private/Report/ReportCard";
import ReportForm from "../../components/private/Report/ReportForm";
import ReportDelete from "../../components/private/Report/ReportDelete";


// Slide Transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Report() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openReportForm, setOpenReportForm] = useState(false);
  const [openReportDelete, setOpenReportDelete] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [reportErrorMessage, setReportErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  // Fetch all reports from API
  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data || []);
      setReportErrorMessage("");
    } catch (err) {
      console.error("Error loading reports:", err);
      setReportErrorMessage("Failed to load reports: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Open Edit Report Modal
  const handleOpenReportEdit = (report) => {
    setSelectedReport(report);
    setOpenReportForm(true);
  };

  // Open Delete Report Modal
  const handleOpenReportDelete = (report) => {
    setSelectedReport(report);
    setOpenReportDelete(true);
  };

  // Open Export Data Dialog
  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  // Submit Edit Report
  const handleSubmitReport = async (formData) => {
    try {
      if (!selectedReport) return;
      await updateReport(selectedReport.report_id, formData);
      showSnackbar("Report updated successfully", "success");
      setOpenReportForm(false);
      await loadReports();
    } catch (err) {
      console.error("Error saving report:", err);
      showSnackbar(err.message || "Error saving report", "error");
    }
  };

  // Delete Report
  const handleDeleteReport = async (reportToDelete) => {
    const reportId = reportToDelete?.report_id || selectedReport?.report_id;
    try {
      await deleteReport(reportId);
      setOpenReportDelete(false);
      showSnackbar("Report deleted successfully", "success");
      await loadReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      showSnackbar(err.message || "Error deleting report", "error");
    }
  };

  const exportLogsCSV = () => {
    if (reports.length === 0) return;

    const headers = [
      "Report ID",
      "Date Created",
      "Official Name",
      "Position",
      "Concern ID",
      "Report Content",
      "Attachment",
    ];

    const reportRows = reports.map((r) => [
      String(r.report_id || ""),
      r.date_created ? dayjs(r.date_created).format("YYYY-MM-DD HH:mm:ss") : "",
      r.first_name ? `${r.first_name} ${r.last_name || ""}`.trim() : (r.official_id ? `ID #${r.official_id}` : "N/A"),
      String(r.position || "N/A"),
      String(r.message_id || "N/A"),
      String(r.report || "").replace(/\n/g, " "),
      String(r.attachment || "None"),
    ]);

    const csvContent =
      headers.join(",") +
      "\n" +
      reportRows
        .map((row) =>
          row
            .map((value) => {
              const safeValue = String(value).replace(/"/g, '""');
              return `"${safeValue}"`;
            })
            .join(","),
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Reports.csv";
    link.click();
    URL.revokeObjectURL(url);
    setOpenExportDialog(false);
  };

  const exportLogsExcel = () => {
    if (reports.length === 0) return;

    const data = reports.map((r) => ({
      "Report ID": r.report_id,
      "Date Created": r.date_created
        ? dayjs(r.date_created).format("YYYY-MM-DD HH:mm:ss")
        : "",
      "Official Name": r.first_name
        ? `${r.first_name} ${r.last_name || ""}`.trim()
        : r.official_id
        ? `ID #${r.official_id}`
        : "N/A",
      Position: r.position || "N/A",
      "Concern ID": r.message_id || "N/A",
      "Report Content": r.report || "",
      Attachment: r.attachment || "None",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "All Reports");
    XLSX.writeFile(workbook, "Reports.xlsx");
    setOpenExportDialog(false);
  };

  // Filter & sort reports
  const filteredReports = reports
    .filter((r) => {
      const searchLower = searchQuery.toLowerCase();
      const reportText = (r.report || "").toLowerCase();
      const reportId = String(r.report_id || "");
      const officialId = String(r.official_id || "");
      const messageId = String(r.message_id || "");

      return (
        reportText.includes(searchLower) ||
        reportId.includes(searchLower) ||
        officialId.includes(searchLower) ||
        messageId.includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date_created || 0);
      const dateB = new Date(b.date_created || 0);
      return sortOption === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Snackbar helpers
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
        return "success.light";
      case "error":
        return "error.light";
      default:
        return "primary.light";
    }
  };

  return (
    <Box p={3}>
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>Reports</title>
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
          sx={{ fontWeight: "bold", fontSize: { xs: 24, sm: 32 } }}
        >
          Reports
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenExportDialog}
          color="primary"
          sx={{
            width: { xs: "100%", sm: 150 },
            height: { xs: 35, sm: 45 },
            minWidth: { xs: 45, sm: 50 },
            fontSize: { xs: 12, sm: 16 },
            padding: 0,
          }}
        >
          Export Data
        </Button>
      </Box>

      {/* Filter Section (First Paper) */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Filter
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search reports by content, ID, or official..."
            size="small"
            sx={{
              width: { xs: "100%", sm: 360 },
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
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Reports Display Section (Second Paper) */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} variant="outlined">
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2.5 }}>
          Report List
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : reportErrorMessage ? (
          <Typography align="center" color="error" sx={{ py: 4 }}>
            {reportErrorMessage}
          </Typography>
        ) : filteredReports.length > 0 ? (
          <ReportCard
            reports={filteredReports}
            onEdit={handleOpenReportEdit}
            onDelete={handleOpenReportDelete}
          />
        ) : (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 6 }}
          >
            {searchQuery
              ? "No reports match your search criteria."
              : "No reports found."}
          </Typography>
        )}
      </Paper>

      {/* ========== REPORT MODALS ========== */}
      <ReportForm
        open={openReportForm}
        handleClose={() => setOpenReportForm(false)}
        onSubmit={handleSubmitReport}
        selectedReport={selectedReport}
      />
      <ReportDelete
        open={openReportDelete}
        handleClose={() => setOpenReportDelete(false)}
        onSubmit={handleDeleteReport}
        selectedReport={selectedReport}
      />
      <Export
        open={openExportDialog}
        handleClose={() => setOpenExportDialog(false)}
        onExportCSV={exportLogsCSV}
        onExportExcel={exportLogsExcel}
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
