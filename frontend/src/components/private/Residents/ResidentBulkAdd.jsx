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

// Helper to reliably format Excel dates into YYYY-MM-DD for MySQL
const normalizeDate = (val) => {
  if (!val) return "";
  if (val instanceof Date && !isNaN(val.getTime())) {
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, "0");
    const day = String(val.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // Check MM/DD/YYYY or DD/MM/YYYY
  const parts = str.split(/[/.-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
    } else if (parts[2].length === 4) {
      // MM/DD/YYYY or DD/MM/YYYY
      const year = parts[2];
      const month = parts[0].padStart(2, "0");
      const day = parts[1].padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str;
};

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
        const buffer = evt.target.result;
        const wb = XLSX.read(buffer, { type: "array", cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: false });

        const findVal = (row, ...keys) => {
          for (const k of keys) {
            if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
              return String(row[k]).trim();
            }
          }
          return "";
        };

        const formattedData = data
          .map((row) => ({
            first_name: findVal(row, "First Name", "first_name", "FirstName", "First"),
            middle_name: findVal(row, "Middle Name", "middle_name", "MiddleName", "Middle"),
            last_name: findVal(row, "Last Name", "last_name", "LastName", "Last", "Surname"),
            gender: findVal(row, "Gender", "gender", "Sex", "sex"),
            dob: normalizeDate(findVal(row, "Date of Birth", "dob", "Birthday", "BirthDate", "Birth Date")),
            address: findVal(row, "Address", "address"),
            phone_number: String(findVal(row, "Phone Number", "phone_number", "Phone", "Contact Number", "Mobile")),
            email: findVal(row, "Email", "email", "Email Address"),
          }))
          .filter((r) => r.first_name || r.last_name);

        if (formattedData.length === 0) {
          setError("No valid resident records found. Please ensure the columns match the template.");
        }

        setParsedData(formattedData);
      } catch (err) {
        setError("Failed to parse the file. Ensure it is a valid Excel or CSV file.");
      }
    };
    reader.readAsArrayBuffer(file);
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
