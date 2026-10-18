import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Slide,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { bulkAddResidents } from "../../../api/private/residentAPI";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResidentBulkAdd({ open, handleClose, onSuccess, showSnackbar }) {
  const fileInputRef = useRef(null);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: false });

        const formattedData = data.map((row) => ({
          first_name: row["First Name"] || row.first_name || "",
          middle_name: row["Middle Name"] || row.middle_name || "",
          last_name: row["Last Name"] || row.last_name || "",
          gender: row["Gender"] || row.gender || "",
          dob: row["Date of Birth"] || row.dob || "",
          address: row["Address"] || row.address || "",
          phone_number: String(row["Phone Number"] || row.phone_number || ""),
          email: row["Email"] || row.email || "",
        }));

        setParsedData(formattedData);
      } catch (err) {
        setError("Failed to parse the file. Ensure it is a valid Excel or CSV file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) {
      setError("No valid data found to import.");
      return;
    }

    setIsSubmitting(true);
    try {
      await bulkAddResidents(parsedData);
      showSnackbar(`Successfully imported ${parsedData.length} residents`, "success");
      onSuccess();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to import residents.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setParsedData([]);
    setFileName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    handleClose();
  };

  const downloadTemplate = () => {
    const template = [
      {
        "First Name": "Juan",
        "Middle Name": "Rizal",
        "Last Name": "Dela Cruz",
        "Gender": "Male",
        "Date of Birth": "1990-01-15",
        "Address": "123 Sampaguita St",
        "Phone Number": "09123456789",
        "Email": "juan@example.com",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Resident_Bulk_Import_Template.xlsx");
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Bulk Import Residents</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Upload an Excel (.xlsx, .xls) or CSV file to add multiple residents at once.
          Ensure your column headers match the required format.
        </Typography>

        <Button variant="text" size="small" onClick={downloadTemplate} sx={{ mb: 3 }}>
          Download Template
        </Button>

        <Box
          onClick={() => fileInputRef.current.click()}
          sx={{
            border: "2px dashed",
            borderColor: "primary.main",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "accent.subtle",
            "&:hover": { backgroundColor: "action.selected" },
          }}
        >
          <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" color="primary">
            {fileName ? fileName : "Click to select a file"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {parsedData.length > 0 && `${parsedData.length} residents ready to import`}
          </Typography>
        </Box>
        
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={parsedData.length === 0 || isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Import Data"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}