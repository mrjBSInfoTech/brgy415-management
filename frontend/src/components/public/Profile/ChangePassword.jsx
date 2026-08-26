import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";

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

export default function ChangePassword({
  open,
  handleClose,
  onSubmit,
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  const validateForm = () => {
    if (!currentPassword.trim()) {
      setError("Current password is required.");
      return false;
    }

    if (!newPassword.trim()) {
      setError("New password is required.");
      return false;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        currentPassword,
        newPassword,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }

    if (event.key === "Escape") {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 4,
          pt: 4,
          pb: 1,
          fontWeight: 800,
          fontSize: "1.5rem",
        }}
      >
        Change Password
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setError("");
            }}
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setError("");
            }}
            helperText="Use at least 6 characters"
            fullWidth
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError("");
            }}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={isSubmitting}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            px: 3,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: "#1e1f87",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#151663",
              boxShadow: "none",
            },
          }}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}