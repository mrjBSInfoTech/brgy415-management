import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BarangayIcon from "../../assets/BarangayIcon.png";
import Footer from "../../components/public/Footer";
import { fetchAnnouncements } from "../../api/public/announcementAPI";

export default function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [announcements, setAnnouncements] = useState([]);
  const [announcementErrorMessage, setAnnouncementErrorMessage] = useState("");

  const loadAnnouncements = async () => {
    try {
      setAnnouncementErrorMessage("");
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
        `${err.message || "Failed to fetch announcements. Please try again later."}`
      );
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Helmet titleTemplate="%s - Barangay 415 Zone 42">
        <title>Home</title>
      </Helmet>

      {/* HERO SECTION */}
      <Box
        id="hero"
        sx={{
          background: "linear-gradient(135deg, #1e1f87 0%, #0d0e4c 100%)",
          color: "white",
          pt: { xs: 7, sm: 10, md: 14 },
          pb: { xs: 8, sm: 12, md: 16 },
          px: { xs: 2, sm: 3 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="800"
            gutterBottom
            sx={{
              letterSpacing: "-1px",
              fontSize: { xs: "2.25rem", sm: "3.25rem", md: "4rem" },
            }}
          >
            Discover Barangay 415
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: 650,
              mx: "auto",
              mb: 5,
              opacity: 0.85,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Empowerment through transparent governance, responsive public services, and community engagement in Zone 42, Sampaloc, Manila.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "white",
                color: "#1e1f87",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
              }}
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ContactSupportIcon />}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.4)",
                color: "white",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => {
                navigate("/public/concerns");
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ABOUT US SECTION */}
      <Container maxWidth="lg" id="about" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, mb: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: { xs: 2.5, sm: 4, md: 6 },
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 6 },
          }}
        >
          {/* LOGO FRAME */}
          <Box
            sx={{
              bgcolor: "#f1f5f9",
              borderRadius: 4,
              p: 3,
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
                height: { xs: "150px", sm: "220px", md: "280px" },
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* TEXT CONTENT */}
          <Stack spacing={2} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h4" fontWeight="800" color="#1e1f87">
              About Our Barangay
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.8 }}>
              Barangay 415 Zone 42 is committed to serving the community through
              transparent governance, inclusive programs, and sustainable
              development. We strive to improve the quality of life of our
              residents by providing efficient public services and fostering unity
              within the community.
            </Typography>
          </Stack>
        </Box>
      </Container>

      {/* MISSION & VISION */}
      <Container maxWidth="lg" id="mission-vision" sx={{ px: { xs: 2, sm: 3 }, mb: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Vision */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                p: { xs: 1, sm: 2 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "rgba(30, 31, 135, 0.08)",
                    color: "#1e1f87",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <VisibilityIcon fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="#1e1f87" mb={1.5}>
                  Our Vision
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  A progressive and sustainable Barangay 415 where residents enjoy
                  improved quality of life, equal opportunities, and a strong
                  sense of unity in a safe and clean environment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Mission */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                p: { xs: 1, sm: 2 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "rgba(30, 31, 135, 0.08)",
                    color: "#1e1f87",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <TrackChangesIcon fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="#1e1f87" mb={1.5}>
                  Our Mission
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  To provide efficient and accountable public service that
                  empowers residents and promotes community development through
                  inclusive governance and collaborative partnerships.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ANNOUNCEMENTS PREVIEW */}
      <Box id="announcements" sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: "#f1f5f9" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" fontWeight="800" color="#1e1f87" mb={1}>
              Latest Announcements
            </Typography>
            <Typography color="text.secondary">
              Keep updated with recent developments and community events
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
            {announcements.slice(0, 3).map((announcement) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={announcement.announcement_id || announcement.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, color: "text.secondary" }}>
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" fontWeight="600">
                        {new Date(announcement.date_posted).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary" sx={{ lineHeight: 1.3 }}>
                      {announcement.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
                      {announcement.description?.length > 110
                        ? `${announcement.description.substring(0, 110)}...`
                        : announcement.description}
                    </Typography>

                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/public/announcements")}
                      sx={{
                        alignSelf: "flex-start",
                        fontWeight: "bold",
                        color: "#1e1f87",
                        textTransform: "none",
                        p: 0,
                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                      }}
                    >
                      Read Announcement
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/public/announcements")}
              sx={{
                borderRadius: 2.5,
                px: 4,
                py: 1,
                borderColor: "#1e1f87",
                color: "#1e1f87",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(30, 31, 135, 0.05)",
                  borderColor: "#1e1f87",
                },
              }}
            >
              View All Announcements
            </Button>
          </Box>
        </Container>
      </Box>

      {/* MAP SECTION */}
      <Box sx={{ width: "100%", mb: -10, p: 0 }} id="location">
        <Box
          sx={{
            width: "100%",
            height: "300px",
            overflow: "hidden",
          }}
        >
          <iframe
            title="Barangay 415 Location"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.9445419181066!2d120.9934460044199!3d14.60223508063279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90044880705%3A0x360b0bb9a22a7732!2sBarangay%20Hall%20Barangay%20415-Zone%2042!5e0!3m2!1sen!2sph!4v1759467000487!5m2!1sen!2sph"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}