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

function ConcernBulkSolved({
  open,
  handleClose,
  onSubmit,
  selectedConcerns,
}) {
  // Handle Enter key for delete
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && open) {
        event.preventDefault();
        handleBulkSolve();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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

  // 🔴 Delete confirmation submit
  const handleBulkSolve = () => {
    onSubmit(selectedConcerns);
    handleClose();
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
    >
      <>
        <DialogTitle sx={{fontWeight: "bold"}}>Solve Concerns</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to solve these concerns? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBulkSolve} color="primary" variant="contained">
            Solve
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}

export default ConcernBulkSolved;
