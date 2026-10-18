import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Alert,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

// Styled component for the drop zone
const DropZone = styled(Box)(({ theme, isDragActive, hasError }) => ({
  width: "100%",
  minHeight: 200,
  border: `2px dashed ${
    hasError
      ? theme.palette.error.main
      : isDragActive
        ? theme.palette.primary.main
        : theme.palette.grey[400]
  }`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  backgroundColor: isDragActive ? theme.palette.action.hover : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Image preview container
const ImagePreview = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 200,
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  "& .overlay": {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
  },
  "&:hover .overlay": {
    display: "flex",
  },
}));

// Animation transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      timeout={500}
      easing={{
        enter: "cubic-bezier(0.4, 0, 0.2, 1)",
        exit: "ease-out",
      }}
    />
  );
});

function HouseholdForm({
  open,
  handleClose,
  onSubmit,
  selectedHousehold,
  residents = [],
  mode = "form",
  onOpenBulkImport,
}) {
  const [formData, setFormData] = useState({
    house_number: "",
    street_number: "",
    barangay: "",
    household_members: "",
    head_family: "",
  });
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Prefill data when editing
  useEffect(() => {
    if (selectedHousehold) {
      setFormData({
        house_number: selectedHousehold.house_number
          ? String(selectedHousehold.house_number)
          : "",
        street_number: selectedHousehold.street_number
          ? String(selectedHousehold.street_number)
          : "",
        barangay: selectedHousehold.barangay
          ? String(selectedHousehold.barangay)
          : "",
        household_members: selectedHousehold.household_members
          ? String(selectedHousehold.household_members)
          : "",
        head_family: selectedHousehold.head_family
          ? String(selectedHousehold.head_family)
          : "",
      });
    } else {
      setFormData({
        house_number: "",
        street_number: "",
        barangay: "",
        household_members: "",
        head_family: "",
      });
    }
    setError(""); // Clear error when opening dialog
  }, [selectedHousehold, open]);

  // Handle Enter key for submit
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && open) {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, formData]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const getResidentLabel = (resident) => {
    const parts = [resident?.first_name, resident?.last_name].filter(Boolean);
    return parts.join(" ") || `Resident #${resident?.resident_id || ""}`.trim();
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.house_number.trim()) {
      setError("House number is required");
      return;
    }
    if (!formData.street_number.trim()) {
      setError("Street number is required");
      return;
    }
    if (!formData.barangay.trim()) {
      setError("Barangay is required");
      return;
    }
    if (!formData.household_members.trim()) {
      setError("Household members is required");
      return;
    }
    if (!formData.head_family.trim()) {
      setError("Head of family is required");
      return;
    }
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: { minWidth: "500px" },
      }}
    >
      <>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {selectedHousehold ? "Edit Household" : "Add Household"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "row",
              gap: 2,
            }}
          >
            {/* House Number */}
            <TextField
              label="House Number"
              name="house_number"
              value={formData.house_number}
              onChange={handleChange}
              fullWidth
              margin="dense"
              autoFocus
            />

            {/* Street Number */}
            <TextField
              label="Street Number"
              name="street_number"
              value={formData.street_number}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />

            {/* Barangay */}
            <TextField
              label="Barangay"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />

            {/* Household Members */}
            <TextField
              label="Household Members"
              name="household_members"
              type="number"
              value={formData.household_members}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />

            {/* Head of Family */}
            <FormControl fullWidth margin="dense">
              <InputLabel id="head-family-label">Head of Family</InputLabel>
              <Select
                labelId="head-family-label"
                label="Head of Family"
                name="head_family"
                value={formData.head_family}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select a resident</em>
                </MenuItem>
                {residents.map((resident) => (
                  <MenuItem
                    key={resident.resident_id}
                    value={getResidentLabel(resident)}
                  >
                    {getResidentLabel(resident)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {!selectedHousehold && onOpenBulkImport && (
                <Button
                  onClick={() => {
                    handleClose();
                    onOpenBulkImport();
                  }}
                  color="info"
                  variant="outlined"
                >
                  Bulk Import
                </Button>
              )}
            </Box>
            
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                {selectedHousehold ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </>
    </Dialog>
  );
}

export default HouseholdForm;
