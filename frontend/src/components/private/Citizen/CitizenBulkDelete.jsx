import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Typography,
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

function CitizenBulkDelete({ open, handleClose, onSubmit, selectedCitizens }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && open) {
        event.preventDefault();
        handleBulkDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleBulkDelete = () => {
    onSubmit(selectedCitizens);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted>
      <DialogTitle sx={{ fontWeight: "bold" }}>Delete Citizens</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the selected citizen accounts? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleBulkDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CitizenBulkDelete;
