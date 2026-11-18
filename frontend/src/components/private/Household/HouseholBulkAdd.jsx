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
import { bulkAddHouseholds } from "../../../api/private/householdAPI";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HouseholdBulkAdd({ open, handleClose, onSuccess, showSnackbar }) {
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
        const wb = XLSX.read(buffer, { type: "array" });
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
            house_number: findVal(row, "House Number", "house_number", "House No", "House #", "HouseNum"),
            street_number: findVal(row, "Street Number", "street_number", "Street", "Street Name", "Street No", "Street#"),
            barangay: findVal(row, "Barangay", "barangay", "Brgy"),
            household_members: findVal(row, "Household Members", "household_members", "Members", "No. of Members", "Household Count"),
            head_family: findVal(row, "Household Head", "Head Family", "Head of Family", "head_family", "Head"),
          }))
          .filter((h) => h.house_number || h.street_number || h.head_family);

        if (formattedData.length === 0) {
          setError("No valid household records found. Please ensure the columns match the template.");
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
      await bulkAddHouseholds(parsedData);
      showSnackbar(`Successfully imported ${parsedData.length} households`, "success");
      onSuccess();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to import households.");
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
        "House Number": "1",
        "Street Number": "123",
        "Barangay": "Sampaguita",
        "Household Members": "10",
        "Household Head": "Juan Dela Cruz",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Household_Bulk_Import_Template.xlsx");
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Bulk Import Household</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Upload an Excel (.xlsx, .xls) or CSV file to add multiple households at once.
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
            {parsedData.length > 0 && `${parsedData.length} households ready to import`}
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
