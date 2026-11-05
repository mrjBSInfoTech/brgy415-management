import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Slide,
  Typography,
  Alert,
} from "@mui/material";
import ChangeConfirm from "./ChangeConfirm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OtherInfoForm({ open, handleClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    email: "",
    tp_number: "",
    phone_number: "",
    facebook_link: "",
    instagram_link: "",
    x_link: "",
    address: "",
  });
  const [socialError, setSocialError] = useState("");
  const [pendingChanges, setPendingChanges] = useState(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setPendingChanges(null);
      setSocialError("");
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || "",
        tp_number: initialData.tp_number || "",
        phone_number: initialData.phone_number || "",
        facebook_link: initialData.facebook_link || "",
        instagram_link: initialData.instagram_link || "",
        x_link: initialData.x_link || "",
        address: initialData.address || "",
      });
      setSocialError("");
    }
  }, [initialData, open]);

  const handleConfirmChanges = async (data) => {
    if (!data || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await onSubmit(data);
    } finally {
      savingRef.current = false;
      setSaving(false);
      setPendingChanges(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (["facebook_link", "instagram_link", "x_link"].includes(name)) {
      setSocialError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (pendingChanges || savingRef.current) return;

    const facebook = formData.facebook_link.trim();
    const instagram = formData.instagram_link.trim();
    const x = formData.x_link.trim();

    if (!facebook && !instagram && !x) {
      setSocialError("Please provide at least one social media link.");
      return;
    }

    setSocialError("");

    const payload = {
      email: formData.email.trim(),
      tp_number: formData.tp_number.trim(),
      phone_number: formData.phone_number.trim(),
      facebook_link: facebook,
      instagram_link: instagram,
      x_link: x,
      address: formData.address.trim(),
    };

    setPendingChanges(payload);
  };

  return (
    <>
      <Dialog
        open={open && !pendingChanges}
        onClose={saving ? undefined : handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Other Information</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {socialError && (
              <Alert severity="error" sx={{ py: 0.5, px: 1.5 }}>
                {socialError}
              </Alert>
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Telephone Number"
              name="tp_number"
              value={formData.tp_number}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Facebook Link"
              name="facebook_link"
              value={formData.facebook_link}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="https://facebook.com/yourpage"
              error={Boolean(socialError)}
            />

            <TextField
              label="Instagram Link"
              name="instagram_link"
              value={formData.instagram_link}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="https://instagram.com/yourpage"
              error={Boolean(socialError)}
            />

            <TextField
              label="X / Twitter Link"
              name="x_link"
              value={formData.x_link}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="https://x.com/yourpage"
              error={Boolean(socialError)}
              helperText={socialError ? socialError : "At least one social media link is required"}
            />

            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              size="small"
            />

            <Typography variant="caption" color={socialError ? "error" : "text.secondary"}>
              At least one social media link is required. Unused links can be left blank to hide them.
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="secondary" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving || Boolean(pendingChanges)}>
              Save Changes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ChangeConfirm
        open={open && Boolean(pendingChanges)}
        handleClose={() => {
          if (!savingRef.current) setPendingChanges(null);
        }}
        onSubmit={handleConfirmChanges}
        selectedInfo={pendingChanges}
        saving={saving}
      />
    </>
  );
}
