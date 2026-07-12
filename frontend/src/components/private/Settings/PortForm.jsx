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

function ToDoForm({
  open,
  handleClose,
  onSubmit,
  selectedPort,
  userId,
  mode = "form",
}) {
    const [formData, setFormData] = useState({
    port_number: "",
  });

  const [error, setError] = useState("");

  // Prefill data when editing
  useEffect(() => {
    if (selectedPort) {
      setFormData({
        port_number: selectedPort.port_number || "",
      });
    } else {
      setFormData({ port_number: "" });
    }
    setError(""); // Clear error when opening dialog
  }, [selectedPort, open, userId]);

  // Handle Enter key for both delete and submit
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && open) {
        event.preventDefault();
        if (mode === "delete") {
          handleDelete();
        } else {
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, mode, formData]);

  // Handle Escape key for both delete and submit
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
    setError(""); // Clear error when user types
  };

  const handleSubmit = () => {
    // Validate input
    if (!formData.port_number.trim()) {
      setError("Port number is required");
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
      
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "background.modal",
        },
      }}
    >
      <>
        <DialogTitle sx={{fontWeight: "bold"}}>Edit Port</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Port Number"
            name="port_number"
            value={formData.port_number || ""}
            onChange={handleChange}
            sx={{ width: "300px", mt: 2 }}
            margin="dense"
            autoFocus
            error={!!error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary"
            sx={{
              boxShadow: 'none !important', 
              border: 'none !important'
            }}
          >
            Update
          </Button>
        </DialogActions>
        </>
    </Dialog>
  );
}

export default ToDoForm;
