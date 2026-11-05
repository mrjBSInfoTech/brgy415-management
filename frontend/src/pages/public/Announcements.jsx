import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import AnnouncementCard from "../../components/public/Announcement/AnnouncementCard";
import { fetchAnnouncements } from "../../api/public/announcementAPI";
import Footer from "../../components/public/Footer";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementErrorMessage, setAnnouncementErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all announcements
  const loadAnnouncements = async () => {
    try {
      setAnnouncementErrorMessage("");
      setLoading(true);
      const response = await fetchAnnouncements();
      if (response && Array.isArray(response)) {
        setAnnouncements(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setAnnouncements(response.data);
      } else {
        setAnnouncements([]);
        setAnnouncementErrorMessage("No data received from server.");
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setAnnouncements([]);
      setAnnouncementErrorMessage(
        `${err.message || "Failed to fetch announcements. Please try again later."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Helmet titleTemplate="%s - Barangay 415 Zone 42">
        <title>Announcements</title>
      </Helmet>

      {/* Hero Header */}
      <Box
        sx={{
          background: "var(--primary-color)",
          color: "white",
          pt: { xs: 5, sm: 7, md: 9 },
          pb: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 3 },
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: "2rem", sm: "2.75rem" }, mb: 1 }}>
            Community Announcements
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.88, fontWeight: 400 }}>
            Stay updated with the latest news, events, and advisories from Barangay 415.
          </Typography>
        </Container>
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, minHeight: "50vh" }}>
        <Box sx={{ width: "100%" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "var(--primary-color)" }} />
            </Box>
          ) : announcementErrorMessage ? (
            <Typography align="center" color="text.secondary" sx={{ py: 6, px: 2, bgcolor: "white", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              {announcementErrorMessage}
            </Typography>
          ) : announcements.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 6, px: 2, bgcolor: "white", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              No announcements found.
            </Typography>
          ) : (
            /* Keeping the original AnnouncementCard intact */
            <AnnouncementCard announcements={announcements} />
          )}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
