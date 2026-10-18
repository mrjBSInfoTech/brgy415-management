import React from "react";
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

function ChangeConfirm({
  open,
  handleClose,
  onSubmit,
  selectedInfo,
  saving = false,
}) {
  const handleChange = () => {
    if (!saving) onSubmit(selectedInfo);
  };


  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : handleClose}
      disableEscapeKeyDown={saving}
      aria-labelledby="barangay-change-confirm-title"
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      TransitionComponent={Transition}
      keepMounted
    >
      <>
        <DialogTitle id="barangay-change-confirm-title" sx={{fontWeight: "bold"}}>Change Barangay Information</DialogTitle>
        <DialogContent>
          <Typography>
            Save these changes to the barangay information? Select Cancel to return to editing without saving.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" disabled={saving} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleChange} color="primary" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Confirm Changes"}
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}

export default ChangeConfirm;
