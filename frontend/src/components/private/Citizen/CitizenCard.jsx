import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import CitizenForm from "./CitizenForm";
import CitizenBulkVerify from "./CitizenBulkVerify";
import CitizenBulkDelete from "./CitizenBulkDelete";

const getStatusStyle = (status) => {
  switch (status) {
    case "verified":
      return {
        label: "Verified",
        bg: "#c6d8ef",
        text: "#0369A1",
        border: "1px solid #0369A1",
        cardBorder: "4px solid #0369A1",
      };
    case "pending":
    default:
      return {
        label: "Pending",
        bg: "#FED7AA",
        text: "#92400E",
        border: "1px solid #92400E",
        cardBorder: "4px solid #92400E",
      };
  }
};

// Helper component for info display
const InfoRow = ({ label, value }) => (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
    <strong>{label}:</strong> {value}
  </Typography>
);

export default function CitizenCard({
  citizens,
  residents = [],
  onEdit,
  onDelete,
  onBulkVerify,
  onBulkDelete,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    resident_id: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [openBulkVerify, setOpenBulkVerify] = useState(false);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [selectedCitizenIds, setSelectedCitizenIds] = useState([]);
  const open = Boolean(anchorEl);

  // Helper function to get resident info
  const getResidentInfo = (residentId) => {
    if (!residentId) return "Not Found";
    const resident = residents.find((r) => r.resident_id === residentId);
    return resident ? `${resident.first_name} ${resident.last_name}` : "Not Found";
  };

  const normalizeName = (value = "") =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const getMatchingResidents = (citizen) => {
    if (!citizen) return [];

    const citizenName = normalizeName(
      `${citizen.first_name || ""} ${citizen.last_name || ""}`,
    );

    if (!citizenName) return [];

    return residents.filter((resident) => {
      const residentName = normalizeName(
        `${resident.first_name || ""} ${resident.last_name || ""}`,
      );

      if (!residentName) return false;

      return (
        residentName === citizenName ||
        residentName.includes(citizenName) ||
        citizenName.includes(residentName)
      );
    });
  };

  const handleMatchResident = (citizen, resident) => {
    if (!onEdit || !citizen || !resident) return;

    onEdit(citizen, {
      type: "resident",
      resident_id: resident.resident_id,
    });
  };

  useEffect(() => {
    if (selectedCitizen) {
      setFormData({
        type: selectedCitizen.type || "",
        resident_id: selectedCitizen.resident_id || "",
      });
    } else {
      setFormData({
        type: "",
        resident_id: "",
      });
    }
  }, [selectedCitizen]);

  // Update selectedCitizen when citizens prop changes to keep it fresh
  useEffect(() => {
    if (selectedCitizen && citizens.length > 0) {
      const updatedCitizen = citizens.find(
        (c) => c.user_id === selectedCitizen.user_id
      );
      if (updatedCitizen) {
        setSelectedCitizen(updatedCitizen);
      }
    }
  }, [citizens]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuOpen = (event, citizen) => {
    setAnchorEl(event.currentTarget);
    setSelectedCitizen(citizen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectRow = (citizenId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(citizenId)) {
        return prevSelected.filter((id) => id !== citizenId);
      }
      return [...prevSelected, citizenId];
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(citizens.map((citizen) => citizen.user_id));
    } else {
      setSelectedRows([]);
    }
  };

  const openBulkVerifyModal = () => {
    setSelectedCitizenIds(selectedRows);
    setOpenBulkVerify(true);
  };

  const openBulkDeleteModal = () => {
    setSelectedCitizenIds(selectedRows);
    setOpenBulkDelete(true);
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  // Open Citizen Form dialog
  const handleFormOpen = (citizen) => {
    setSelectedCitizen(citizen);
    setOpenFormDialog(true);
  };

  const handleFormClose = () => {
    setOpenFormDialog(false);
    setSelectedCitizen(null); 
  };

  const handleAfterBulkAction = () => {
    clearSelection();
  };

  const showBulkVerify = citizens.some((citizen) => citizen.status !== "verified");

  const residentOptions = residents.map((resident) => ({
    id: resident.resident_id,
    label: `${resident.first_name} ${resident.last_name}`,
  }));

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: "background.table",
          borderRadius: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox
            indeterminate={
              selectedRows.length > 0 && selectedRows.length < citizens.length
            }
            checked={
              citizens.length > 0 && selectedRows.length === citizens.length
            }
            onChange={handleSelectAll}
          />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Select all
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ({selectedRows.length} {selectedRows.length === 1 ? "account" : "accounts"} selected)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {showBulkVerify && (
            <Button
              size="small"
              variant="contained"
              color="success"
              sx={{ color: "white" }}
              onClick={openBulkVerifyModal}
              disabled={selectedRows.length === 0 || !onBulkVerify}
            >
              Verify
            </Button>
          )}
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={openBulkDeleteModal}
            disabled={selectedRows.length === 0 || !onBulkDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
      {citizens.map((citizen) => {
        const matchingResidents = getMatchingResidents(citizen);

        return (
          <Card
            key={citizen.user_id}
            sx={{
              width: "100%",
              opacity: citizen.status === "solved" ? 0.75 : 1,
              borderLeft: getStatusStyle(citizen.status).cardBorder,
              transition: "box-shadow 0.2s ease",
              "&:hover": { boxShadow: 4 },
            }}
          >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 2 }}>
            <Checkbox
              checked={selectedRows.includes(citizen.user_id)}
              onChange={() => handleSelectRow(citizen.user_id)}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {citizen.status === "verified" ? "Verified" : "Pending"}
            </Typography>
          </Box>
          {/* Citizen Details */}
          <CardContent sx={{ flex: 1, overflow: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {citizen.first_name} {citizen.last_name}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, citizen)}
                    sx={{
                      ml: "auto",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Citizen Info */}
                <Box sx={{ mb: 2 }}>
                  <InfoRow label="Email" value={citizen.email} />
                  <InfoRow label="Contact" value={citizen.contact} />
                  {citizen.status === "verified" && (
                    <>
                      <InfoRow
                        label="Type"
                        value={
                          citizen.type.toUpperCase().charAt(0) +
                          citizen.type.slice(1)
                        }
                      />
                      <InfoRow label="Resident" value={getResidentInfo(citizen.resident_id)} />
                    </>
                  )}
                  {citizen.status !== "verified" && (
                    <Box sx={{ mt: 1.2 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: "text.secondary" }}
                      >
                        Possible resident match
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                        {matchingResidents.length > 0 ? (
                          matchingResidents.slice(0, 3).map((resident) => (
                            <Button
                              key={resident.resident_id}
                              size="small"
                              variant="contained"
                              onClick={() => handleMatchResident(citizen, resident)}
                              sx={{
                                textTransform: "none",
                                borderRadius: "999px",
                                fontSize: "0.75rem",
                                py: 0.35,
                                px: 1.1,
                                backgroundColor: "#a9f735",
                                color: "#16a34a",
                                boxShadow: "none",
                                border: "1px solid #16a34a",
                                fontWeight: 700,
                                letterSpacing: "0.25px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#15803d",
                                  boxShadow: "none",
                                },
                              }}
                            >
                              {resident.first_name} {resident.last_name}
                            </Button>
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No matching resident record found
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.5,
                      py: 0.4,
                      mt: 1,                      
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      backgroundColor: getStatusStyle(citizen.status).bg,
                      color: getStatusStyle(citizen.status).text,
                      border: getStatusStyle(citizen.status).border,
                      userSelect: "none",
                    }}
                  >
                    {getStatusStyle(citizen.status).label}
                  </Box>
                </Box>

                {/* Info Button */}
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<InfoIcon />}
                  onClick={() => handleFormOpen(citizen)}
                  sx={{ mb: -5 }}
                >
                  Update Info
                </Button>
              </Box>
            </Box>

            {/* Options Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open && selectedCitizen?.user_id === citizen.user_id}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {citizen.status !== "verified" && (
                <MenuItem
                  onClick={() => {
                    onEdit(citizen, { status: "verified", resident_id: citizen.resident_id || "" });
                    handleMenuClose();
                  }}
                  sx={{ color: "success.main" }}
                >
                  <CheckIcon sx={{ mr: 1, fontSize: "20px" }} />
                  Verify
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  onDelete(selectedCitizen.user_id);
                  handleMenuClose();
                }}
                sx={{
                  color: "error.main",
                }}
              >
                <DeleteIcon sx={{ mr: 1, fontSize: "20px" }} />
                {citizen.status === "verified" ? "Remove" : "Delete"}
              </MenuItem>
            </Menu>
          </CardContent>
        </Card>
        );
      })}
      </Box>
      {/* Citizen Form Dialog */}
      <CitizenForm
        open={openFormDialog}
        handleClose={() => setOpenFormDialog(false)}
        onSubmit={onEdit}
        selectedCitizen={selectedCitizen}
        residents={residents}
      />
      <CitizenBulkVerify
        open={openBulkVerify}
        handleClose={() => {
          setOpenBulkVerify(false);
          clearSelection();
        }}
        onSubmit={(ids) => {
          onBulkVerify(ids);
          handleAfterBulkAction();
        }}
        selectedCitizens={selectedCitizenIds}
      />
      <CitizenBulkDelete
        open={openBulkDelete}
        handleClose={() => {
          setOpenBulkDelete(false);
          clearSelection();
        }}
        onSubmit={(ids) => {
          onBulkDelete(ids);
          handleAfterBulkAction();
        }}
        selectedCitizens={selectedCitizenIds}
      />
    </Box>
  );
}
