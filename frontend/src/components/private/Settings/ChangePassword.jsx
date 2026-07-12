import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Alert,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

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

function ChangePassword({
  open,
  handleClose,
  onSubmit,
  selectedPassword,
  userId,
}) {
  const [formData, setFormData] = useState({
    password: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Prefill data when editing
  useEffect(() => {
    if (selectedPassword) {
      setFormData({
        password: "",
      });
    } else {
      setFormData({
        password: "",
      });
    }
    setError("");
    setSuccess("");
    setNewPassword("");
    setConfirmPassword("");
  }, [selectedPassword, open]);

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
  }, [handleClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError("Current password is required");
      return false;
    }
    if (!newPassword.trim()) {
      setError("New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = {
      currentPassword: formData.password,
      newPassword: newPassword,
    };

    onSubmit(submitData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "background.modal",
        },
      }}
    >
      <>
        <DialogTitle sx={{fontWeight: "bold"}}>Change Password</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="dense"
              error={!!error && error.includes("Current")}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              fullWidth
              margin="dense"
              helperText="At least 6 characters"
              error={!!error && error.includes("New")}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              fullWidth
              margin="dense"
              error={!!error && error.includes("Passwords")}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              boxShadow: "none !important",
              border: "none !important",
            }}
          >
            Update
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}

export default ChangePassword;
