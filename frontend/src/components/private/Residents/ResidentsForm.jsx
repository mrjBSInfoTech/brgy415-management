import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Slide,
  Alert,
  Box,
  Typography,
  IconButton,
  CircularProgress,
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

function ResidentsForm({
  open,
  handleClose,
  onSubmit,
  selectedResident,
  households = [],
  mode = "form",
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    dob: "",
    address: "",
    phone_number: "",
    email: "",
    household_id: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Prefill data when editing
  useEffect(() => {
    if (selectedResident) {
      setFormData({
        first_name: selectedResident.first_name
          ? String(selectedResident.first_name)
          : "",
        middle_name: selectedResident.middle_name
          ? String(selectedResident.middle_name)
          : "",
        last_name: selectedResident.last_name
          ? String(selectedResident.last_name)
          : "",
        gender: selectedResident.gender
          ? String(selectedResident.gender).toLowerCase()
          : "",
        dob: selectedResident.dob
          ? String(selectedResident.dob)
          : "",
        address: selectedResident.address
          ? String(selectedResident.address)
          : "",
        phone_number: selectedResident.phone_number
          ? String(selectedResident.phone_number)
          : "",
        email: selectedResident.email ? String(selectedResident.email) : "",
        household_id: selectedResident.household_id || "",
        image: selectedResident.image ? String(selectedResident.image) : "",
      });

      // Set image preview for existing resident
      if (selectedResident.image) {
        setImagePreview(selectedResident.image);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        dob: "",
        address: "",
        phone_number: "",
        email: "",
        household_id: "",
        image: "",
      });
      setImagePreview(null);
    }
    setError(""); // Clear error when opening dialog
  }, [selectedResident, open]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(
          `File size exceeds 2MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          "error",
        );
        setImagePreview(null);
        setFormData((prev) => ({
          ...prev,
          file: null,
          image: "",
        }));
        return;
      }

      setUploadError(""); // Clear error if file is valid

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result); // <-- IMPORTANT
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.first_name.trim()) {
      setError("First name is required");
      return;
    }
    if (!formData.last_name.trim()) {
      setError("Last name is required");
      return;
    }
    if (!formData.gender.trim()) {
      setError("Gender is required");
      return;
    }
    if (!formData.dob.trim()) {
      setError("Date of birth is required");
      return;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }
    if (!formData.phone_number.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          minWidth: { xs: "90%", sm: "600px", md: "600px" },
          width: "100%",
        },
      }}
    >
      <>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {selectedResident ? "Edit Resident" : "Add Resident"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {uploadError && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {uploadError}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "300px" }}>
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  border: "1px solid #555",
                  borderRadius: 1,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  color: "#aaa",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Resident Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography variant="body2">No Image Uploaded</Typography>
                )}
              </Box>

              {/* Choose File Button */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ width: "100%" }}
              />
            </Box>

            {/* INPUT GRID */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "600px",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {/* First Name */}
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                autoFocus
              />

              {/* Middle Name */}
              <TextField
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />

              {/* Last Name */}
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />

              {/* Date of Birth*/}
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
              />

              {/* Gender - Full Width */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              {/* Household - Full Width */}
              <FormControl fullWidth margin="dense" sx={{ minHeight: 56 }}>
                <InputLabel>Household</InputLabel>
                <Select
                  label="Household"
                  name="household_id"
                  value={formData.household_id || ""}
                  onChange={handleChange}
                  sx={{ minHeight: 56 }}
                >
                  <MenuItem value="">
                    <em>No Household</em>
                  </MenuItem>
                  {households.map((household) => (
                    <MenuItem
                      key={household.household_id}
                      value={household.household_id}
                    >
                      House #{household.house_number} - {household.head_family}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Email */}
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />

              {/* Phone Number */}
              <TextField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />

              {/* Address - Full Width */}
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="dense"
                multiline
                rows={2}
                sx={{ gridColumn: "1 / -1" }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedResident ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}

export default ResidentsForm;
