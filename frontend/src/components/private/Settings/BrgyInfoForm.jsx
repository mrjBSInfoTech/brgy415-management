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
  MenuItem,
} from "@mui/material";
import ChangeConfirm from "./ChangeConfirm";

const colorOptions = [
  { label: "Blue", value: "#1e1f87" },
  { label: "Red", value: "#dc2626" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#10b981" },
  { label: "Orange", value: "#ea580c" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
  { label: "Teal", value: "#0d9488" },
  { label: "Navy", value: "#0f172a" },
  { label: "Gray", value: "#64748b" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BrgyInfoForm({ open, handleClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    brgy_name: "",
    mission: "",
    vision: "",
    about: "",
    color_scheme: "#1e1f87",
    brgy_logo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!open) setPendingChanges(null);
  }, [open]);

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        brgy_name: initialData.brgy_name || "",
        mission: initialData.mission || "",
        vision: initialData.vision || "",
        about: initialData.about || "",
        color_scheme: initialData.color_scheme || "#1e1f87",
        brgy_logo: null, // Don't preset file object
      });
      if (initialData.brgy_logo) {
        if (initialData.brgy_logo === "BarangayIcon.png") {
          setImagePreview("BarangayIcon.png"); // Handled as fallback
        } else {
          setImagePreview(`http://localhost:5000/uploads/uploadOfficial/${initialData.brgy_logo}`);
        }
      }
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, brgy_logo: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pendingChanges || savingRef.current) return;
    const data = new FormData();
    data.append("brgy_name", formData.brgy_name);
    data.append("mission", formData.mission);
    data.append("vision", formData.vision);
    data.append("about", formData.about);
    data.append("color_scheme", formData.color_scheme);
    if (formData.brgy_logo) {
      data.append("brgy_logo", formData.brgy_logo);
    }
    setPendingChanges(data);
  };

  const selectedColor = (formData.color_scheme || "#1e1f87").toLowerCase();
  const isCustomColor = !colorOptions.some((option) => option.value === selectedColor);

  return (
    <>
    <Dialog open={open && !pendingChanges} onClose={saving ? undefined : handleClose} TransitionComponent={Transition} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Edit Barangay Info</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            {imagePreview && (
              <Box
                component="img"
                src={imagePreview === "BarangayIcon.png" ? "/src/assets/BarangayIcon.png" : imagePreview}
                alt="Logo Preview"
                sx={{ width: 100, height: 100, objectFit: "contain", border: "1px solid #ccc", borderRadius: 1 }}
              />
            )}
            <Button variant="outlined" component="label" size="small">
              Upload New Logo
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>

          <TextField
            label="Barangay Name"
            name="brgy_name"
            value={formData.brgy_name}
            onChange={handleChange}
            fullWidth
            required
            size="small"
          />

          <TextField
            label="Mission"
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            size="small"
          />

          <TextField
            label="Vision"
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            size="small"
          />

          <TextField
            label="About (History)"
            name="about"
            value={formData.about}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            size="small"
          />

          <Box>
            <TextField
              select
              label="Color Scheme"
              name="color_scheme"
              value={selectedColor}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: option.value, border: "1px solid", borderColor: "divider" }} />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
              {isCustomColor && (
                <MenuItem value={selectedColor} disabled>
                  Custom color ({selectedColor})
                </MenuItem>
              )}
            </TextField>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Customize color:
              </Typography>
              <input
                type="color"
                name="color_scheme"
                value={formData.color_scheme || "#1e1f87"}
                onChange={handleChange}
                style={{
                  width: "60px",
                  height: "36px",
                  padding: "0",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: "bold", color: formData.color_scheme || "#1e1f87" }}>
                {formData.color_scheme || "#1e1f87"}
              </Typography>
            </Box>
          </Box>
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
      handleClose={() => { if (!savingRef.current) setPendingChanges(null); }}
      onSubmit={handleConfirmChanges}
      selectedInfo={pendingChanges}
      saving={saving}
    />
    </>
  );
}
