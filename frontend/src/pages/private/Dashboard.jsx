import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  Backdrop,
} from "@mui/material";
// Icons
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { fetchResidents } from "../../api/private/residentAPI";
import { fetchHouseholds } from "../../api/private/householdAPI";
import { fetchOfficials } from "../../api/private/officialAPI";
import { fetchConcerns } from "../../api/private/concernAPI";

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

export default function Dashboard() {
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [openPasswordWarning, setOpenPasswordWarning] = useState(false);
  const passwordChanged = localStorage.getItem("private_password_changed");

  useEffect(() => {
    if (passwordChanged === 0) {
      setOpenPasswordWarning(true);
    }
  }, [passwordChanged]);

  // Load residents count
  const loadResidents = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetchResidents();
      if (response) {
        setResidents(Array.isArray(response) ? response : []);
      } else {
        setResidents([]);
        setErrorMessage("0");
      }
    } catch (err) {
      console.error("0", err);
      setResidents([]);
      setErrorMessage("0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  // Load households count
  const loadHouseholds = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetchHouseholds();
      if (response) {
        setHouseholds(Array.isArray(response) ? response : []);
      } else {
        setHouseholds([]);
        setErrorMessage("0");
      }
    } catch (err) {
      console.error("0", err);
      setHouseholds([]);
      setErrorMessage("0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouseholds();
  }, []);

  // Load user accounts count
  const loadUserAccounts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetchOfficials();

      if (response) {
        setUserAccounts(Array.isArray(response) ? response : []);
      } else {
        setUserAccounts([]);
        setErrorMessage("0");
      }
    } catch (err) {
      console.error("0", err);
      setUserAccounts([]);
      setErrorMessage("0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAccounts();
  }, []);

  // Load concerns count
  const loadConcerns = async () => {
    try {
      setLoading(true);
      const response = await fetchConcerns();

      if (response) {
        setConcerns(Array.isArray(response) ? response : []);
      } else {
        setConcerns([]);
        setErrorMessage("0");
      }
    } catch (err) {
      console.error("0", err);
      setConcerns([]);
      setErrorMessage("0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcerns();
  }, []);

  const totalResidents = residents.length;
  const totalHouseholds = households.length;
  const totalUserAccounts = userAccounts.length;
  const totalConcerns = concerns.length;

  const maleCount = residents.filter(
    (resident) => resident.gender === "Male",
  ).length;
  const femaleCount = residents.filter(
    (resident) => resident.gender === "Female",
  ).length;
  const otherCount = residents.filter(
    (resident) => resident.gender === "Other",
  ).length;
  const lowCount = concerns.filter(
    (concern) =>
      concern.message_urgency === "Low" &&
      (concern.status || "").toLowerCase() === "solved",
  ).length;
  const mediumCount = concerns.filter(
    (concern) =>
      concern.message_urgency === "Medium" &&
      (concern.status || "").toLowerCase() === "solved",
  ).length;
  const highCount = concerns.filter(
    (concern) =>
      concern.message_urgency === "High" &&
      (concern.status || "").toLowerCase() === "solved",
  ).length;

  const normalizeMessageTypeLabel = (value) => {
    const raw = (value || "Other").toString().trim();
    const normalized = raw.toLowerCase();

    if (normalized.includes("complaint")) return "Complaints";
    if (normalized.includes("concern")) return "Concerns";
    if (normalized.includes("feedback")) return "Feedback";
    if (normalized.includes("request")) return "Requests";

    return raw || "Other";
  };

  const detectTopicLabel = (text) => {
    const normalized = (text || "").toLowerCase();

    if (/\b(?:murder|kill|dead|stab|shoot|shooting|attack|assault|holdap|gun)\b/.test(normalized)) {
      return "Murder / Violence";
    }
    if (/\b(?:accident|accidents|nasagasaan|nabundol|disgrasya)\b/.test(normalized)) {
      return "Accidents";
    }
    if (/\b(?:fire|sunog|burn|burning|on fire)\b/.test(normalized)) {
      return "Fire / Emergencies";
    }
    if (/\b(?:thief|thieves|magnanakaw|nanakaw|stolen|robbery|holdap)\b/.test(normalized)) {
      return "Theft / Robbery";
    }
    if (/\b(?:dispute|disputes|away|fight|bardagulan|argument|brawl)\b/.test(normalized)) {
      return "Disputes";
    }
    if (/\b(?:debt|utang|bayad|payment|pay|loan|pautang)\b/.test(normalized)) {
      return "Debts / Payments";
    }
    if (/\b(?:basura|trash|garbage|dirty|drainage|canal|sanitation)\b/.test(normalized)) {
      return "Garbage / Sanitation";
    }
    if (/\b(?:streetlight|light|ilaw|poste)\b/.test(normalized)) {
      return "Streetlight / Lighting";
    }
    if (/\b(?:noise|ingay|videoke|karaoke|loud)\b/.test(normalized)) {
      return "Noise / Disturbance";
    }
    if (/\b(?:hospital|doctor|medical|sakit|health)\b/.test(normalized)) {
      return "Medical / Health";
    }
    if (/\b(?:dog|aso|cat|pusa|animal)\b/.test(normalized)) {
      return "Animals";
    }

    return "General";
  };

  const groupedTopics = Object.entries(
    concerns.reduce((acc, concern) => {
      const typeLabel = normalizeMessageTypeLabel(concern.message_type);
      if (!acc[typeLabel]) {
        acc[typeLabel] = [];
      }
      acc[typeLabel].push(concern);
      return acc;
    }, {}),
  ).map(([typeLabel, items]) => {
    const topicCounts = items.reduce((acc, concern) => {
      const topic = detectTopicLabel(concern.message || "");
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});

    const topics = Object.entries(topicCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));

    return { type: typeLabel, topics };
  });

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>Dashboard</title>
      </Helmet>
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: { xs: 24, sm: 28, md: 32 } }}
        >
          Dashboard
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            height: { xs: 135, sm: 150 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: "#C1FFA9",
          }}
        >
          <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
            <Typography
              gutterBottom
              variant="h5"
              sx={{ fontWeight: "bold", color: "#2C8508", fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, lineHeight: 1.15 }}
            >
              Residents
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, mt: { xs: 1, sm: 2 } }}>
              <PersonIcon color="success" sx={{ fontSize: { xs: 22, sm: 26, md: 30 } }} />
              <Typography
                sx={{ fontWeight: "bold", color: "#2C8508", fontSize: { xs: 24, sm: 28, md: 30 } }}
              >
                {totalResidents}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            width: "100%",
            height: { xs: 135, sm: 150 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: "#FDCB80",
          }}
        >
          <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
            <Typography
              gutterBottom
              variant="h5"
              sx={{ fontWeight: "bold", color: "#9B5F03", fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, lineHeight: 1.15 }}
            >
              Households
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, mt: { xs: 1, sm: 2 } }}>
              <HomeIcon color="warning" sx={{ fontSize: { xs: 22, sm: 26, md: 30 } }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#9B5F03", fontSize: { xs: 24, sm: 28, md: 30 } }}
              >
                {totalHouseholds}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            width: "100%",
            height: { xs: 135, sm: 150 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: "#FC9495",
          }}
        >
          <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
            <Typography
              gutterBottom
              variant="h5"
              sx={{ fontWeight: "bold", color: "#880506", fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, lineHeight: 1.15 }}
            >
              Official Accounts
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, mt: { xs: 1, sm: 2 } }}>
              <AccountCircleIcon color="error" sx={{ fontSize: { xs: 22, sm: 26, md: 30 } }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#880506", fontSize: { xs: 24, sm: 28, md: 30 } }}
              >
                {totalUserAccounts}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          mt: 3,
        }}
      >
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            mt: 3,
            borderRadius: 2,
            width: { xs: "100%", md: "50%" },
          }}
          variant="outlined"
        >
          <Typography
            textAlign="center"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.1rem", sm: "1.35rem", md: "1.5rem" } }}
          >
            Population
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: { xs: 250, sm: 300, md: 400 },
              width: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Male", value: maleCount },
                    { name: "Female", value: femaleCount },
                    { name: "Other", value: otherCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  //label={({ name, value }) => `${name}: ${value}`} // For future use
                  outerRadius={{ xs: 50, sm: 60, md: 80 }}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#f76cbb" />
                  <Cell fill="#ff3328" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            mt: 3,
            borderRadius: 2,
            width: { xs: "100%", md: "50%" },
          }}
          variant="outlined"
        >
          <Typography
            textAlign="center"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.1rem", sm: "1.35rem", md: "1.5rem" } }}
          >
            Concerns
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: { xs: 250, sm: 300, md: 400 },
              width: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Low", value: lowCount },
                    { name: "Medium", value: mediumCount },
                    { name: "High", value: highCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={{ xs: 50, sm: 60, md: 80 }}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                  <Cell fill="#FFBB28" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mt: 3,
          borderRadius: 3,
          background: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
        }}
        variant="outlined"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Message Type Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Most frequent concern categories based on submitted message types
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.8,
              borderRadius: 999,
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 700,
            }}
          >
            {totalConcerns} total
          </Box>
        </Box>

        {groupedTopics.length > 0 ? (
          <Box sx={{ display: "grid", gap: 2 }}>
            {groupedTopics.map((group, index) => (
              <Box
                key={group.type}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  {index + 1}. {group.type}
                </Typography>
                {group.topics.length > 0 ? (
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {group.topics.map((topic) => (
                      <Box component="li" key={topic.label} sx={{ mb: 0.75 }}>
                        <Typography variant="body2">
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {topic.label}
                          </Box>
                          <Box component="span" color="text.secondary">
                            {" "}({topic.count} {topic.count === 1 ? "message" : "messages"})
                          </Box>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No topics detected yet.
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              No concern data has been submitted yet.
            </Typography>
          </Box>
        )}
      </Paper>
      {passwordChanged && (
        <Dialog
          open={openPasswordWarning}
          TransitionComponent={Transition}
          keepMounted
          disableEscapeKeyDown // Disables closing with the Escape key
          onClose={(event, reason) => {
            // Prevents closing the dialog if the user clicks outside of it
            if (reason === "backdropClick") return;
          }}
        >
          <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
            Security Action Required
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hi there, you are currently using a temporary, system-generated
              initial password. For security reasons, you must change your
              password immediately before continuing to access system management
              features.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpenPasswordWarning(false);
                setTimeout(() => {
                  navigate("/private/settings");
                }, 300);
              }}
            >
              Change Password Now
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
