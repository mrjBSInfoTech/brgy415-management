import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Stack,
} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

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

function Export({ open, handleClose, onExportExcel, onExportCSV }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Export Data</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2} mt={1}>
          <Button
            variant="contained"
            color="success"
            onClick={onExportExcel}
            sx={{
                p: 2,
                borderRadius:2,
            }}
          >
            <InsertDriveFileIcon /> Export to Excel
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={onExportCSV}
            sx={{
                p: 2,
                borderRadius:2,
            }}
          >
            <ArticleIcon /> Export to CSV
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Export;
