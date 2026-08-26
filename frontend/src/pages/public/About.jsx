import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import GroupsIcon from "@mui/icons-material/Groups";
import BarangayIcon from "../../assets/BarangayIcon.png";
import Footer from "../../components/public/Footer";
import { fetchOfficials } from "../../api/public/officialAPI";
import OfficialCard from "../../components/public/Official/OfficialCard";

export default function About() {
  const location = useLocation();
  const [officials, setOfficials] = useState([]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const loadOfficials = async () => {
      try {
        const data = await fetchOfficials();
        setOfficials(data || []);
      } catch (err) {
        console.error("Error loading officials:", err);
      }
    };
    loadOfficials();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Helmet titleTemplate="%s - Barangay Management System">
        <title>About Us</title>
      </Helmet>

      {/* History Section - Elevated Banner with Glass Effect */}
      <Box
        id="history"
        sx={{
          background: "linear-gradient(135deg, #1e1f87 0%, #0d0e4c 100%)",
          color: "white",
          pt: { xs: 6, sm: 8, md: 10 },
          pb: { xs: 7, sm: 9, md: 11 },
          px: { xs: 2, sm: 3 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 4, md: 8 },
            }}
          >
            {/* Logo Image Frame */}
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                p: { xs: 1.5, sm: 2.5 },
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={BarangayIcon}
                alt="Barangay Logo"
                sx={{
                  height: { xs: "150px", sm: "230px", md: "290px" },
                  width: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                }}
              />
            </Box>

            {/* Content */}
            <Stack spacing={2} textAlign={{ xs: "center", md: "left" }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
                <Chip
                  icon={<HistoryEduIcon sx={{ color: "white !important" }} />}
                  label="Our History"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Box>

              <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: "2rem", sm: "2.75rem", md: "3rem" } }}>
                Barangay 415, Zone 42
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                }}
              >
                Barangay 415 is dedicated to providing efficient public service, maintaining peace and order, 
                and building a prosperous community for all residents in Sampaloc, Manila. Established with a 
                rich heritage of community collaboration, we strive to leverage digital tools to enhance administrative 
                transparency, security, and public welfare.
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Officials Section */}
      <Container maxWidth="lg" id="officials" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 5 },
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
            <Typography variant="h4" fontWeight="800" color="#1e1f87" sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
              Barangay Officials
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Meet the dedicated officials serving Barangay 415 Zone 42
            </Typography>
          </Box>

          {/* 1. BARANGAY CAPTAIN */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="overline"
              fontWeight="800"
              textAlign="center"
              component="div"
              mb={3}
              sx={{ color: "#1e1f87", letterSpacing: 1.5, fontSize: "0.9rem" }}
            >
              BARANGAY CAPTAIN
            </Typography>

            <Box sx={{ maxWidth: 360, mx: "auto" }}>
              <OfficialCard
                columns="1fr"
                officials={officials.filter(
                  (o) =>
                    o.position === "Chairman" ||
                    o.position === "Barangay Captain",
                )}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4, opacity: 0.6 }} />

          {/* 2. COUNCIL MEMBERS / OFFICIALS */}
          <Box>
            <Typography
              variant="overline"
              fontWeight="800"
              textAlign="center"
              component="div"
              mb={4}
              sx={{ color: "#1e1f87", letterSpacing: 1.5, fontSize: "0.9rem" }}
            >
              BARANGAY COUNCIL & STAFF
            </Typography>

            <OfficialCard
              columns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" }}
              officials={officials
                .filter((o) =>
                  ["Secretary", "Treasurer", "Kagawad"].includes(o.position),
                )
                .sort((a, b) => {
                  const priority = { Secretary: 1, Treasurer: 2, Kagawad: 3 };
                  return (
                    (priority[a.position] || 99) - (priority[b.position] || 99)
                  );
                })}
            />
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}