import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Chip,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useBarangayTheme } from "../../theme/BarangayThemeContext";
import { fetchBrgyInfo } from "../../api/private/brgyInfoAPI";
import Footer from "../../components/public/Footer";
import ErrorCard from "../../components/public/ErrorCard";
// Icons
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

export default function TermsOfService() {
  const { barangayInfo } = useBarangayTheme();
  const [connectionError, setConnectionError] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine !== false : true
  );
  const brgyName = barangayInfo.brgy_name || "this Barangay ";

  const checkConnection = async () => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setIsOnline(false);
      setConnectionError(true);
      return;
    }
    try {
      setConnectionError(false);
      await fetchBrgyInfo();
    } catch {
      setConnectionError(true);
    }
  };

  useEffect(() => {
    checkConnection();

    const handleOnline = () => {
      setIsOnline(true);
      checkConnection();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionError(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const TERMS_SECTIONS = [
    {
      id: "accounts",
      icon: AccountCircleOutlinedIcon,
      title: "1. Citizen Account Registration & Verification",
      body: [
        `• Residents registering on the ${brgyName} Public Portal must provide truthful, accurate, and current personal information (first name, last name, active email address, and contact number).`,
        "• Newly registered citizen accounts are reviewed and verified by the barangay before full portal features, such as submitting community concerns, are enabled.",
        "• You are responsible for keeping your login password confidential and for all activities conducted under your registered account.",
      ],
    },
    {
      id: "concern-reporting",
      icon: ForumOutlinedIcon,
      title: "2. Submitting Community Concerns, Complaints & Feedback",
      body: [
        `• Verified citizens may use the Concerns page to submit legitimate community concerns, neighborhood complaints, and constructive feedback regarding ${brgyName} (Sampaloc, Manila).`,
        "• All submissions must be truthful, respectful, and relevant to barangay services, community welfare, or neighborhood matters.",
        "• Prank messages, false reports, spam, commercial advertisements, or unrelated personal posts are strictly prohibited.",
      ],
    },
    {
      id: "emergency-scope",
      icon: HelpOutlineOutlinedIcon,
      title: "3. Public Service Scope & Emergency Reminders",
      body: [
        "• The public portal is designed to help residents stay informed about barangay programs, view barangay officials and history, and communicate community concerns.",
        "• For routine medical checkups or non-urgent health inquiries, residents are encouraged to visit the Barangay Health Center or a licensed medical clinic in person.",
        "• In life-threatening situations (such as active fires, severe medical emergencies, or crimes in progress), residents should immediately call national emergency hotlines (911 / Manila DRRMO / PNP / BFP) in addition to notifying the barangay.",
      ],
    },
    {
      id: "announcements",
      icon: CampaignOutlinedIcon,
      title: "4. Public Announcements & Barangay Information",
      body: [
        `• Announcements, event schedules, and community advisories displayed on this website are published for the information and benefit of ${brgyName} residents.`,
        "• Unauthorized alteration, misrepresentation, or misuse of official barangay notices, logos, or public information is prohibited.",
      ],
    },
    {
      id: "privacy-conduct",
      icon: SecurityOutlinedIcon,
      title: "5. Data Privacy & Acceptable Use",
      body: [
        "• Your personal information is collected and processed in accordance with our Data Privacy Policy and the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).",
        "• Harassment, abusive language, impersonation of other residents, or repeated submission of false reports may result in the suspension or deactivation of your citizen portal account.",
      ],
    },
  ];

  if (!isOnline || connectionError) {
    return (
      <Box sx={{ minWidth: 0 }}>
        <Helmet titleTemplate="%s - Error">
          <title>Terms of Service</title>
        </Helmet>
        <ErrorCard title="Terms of Service Unavailable" onRetry={checkConnection} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Helmet titleTemplate={`%s - ${barangayInfo.brgy_name}`}>
        <title>Terms of Service</title>
      </Helmet>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 }, flex: 1 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(30, 31, 135, 0.1)",
                    color: "var(--primary-color)",
                  }}
                >
                  <GavelOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: 24, sm: 30 } }}>
                    Terms of Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Public Citizen Portal Guidelines &amp; Community Responsibilities
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider />

            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              By creating a citizen account or using the <strong>{barangayInfo.brgy_name || "this Barangay "} Public Portal</strong>{" "}
              (Sampaloc, Manila), you agree to follow these Terms of Service and acknowledge how your
              personal information is handled under our Data Privacy Policy (RA 10173).
            </Typography>

            <Stack spacing={3}>
              {TERMS_SECTIONS.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Box
                    key={section.id}
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                      <IconComponent sx={{ color: "var(--primary-color)", fontSize: 22 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 17 }}>
                        {section.title}
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      {section.body.map((paragraph, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {paragraph}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>

            <Divider />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <Stack direction="row" spacing={2}>
                <Link
                  component={RouterLink}
                  to="/public/privacy-policy"
                  underline="hover"
                  sx={{ fontWeight: 700, fontSize: 13, color: "var(--primary-color)" }}
                >
                  Data Privacy Policy (RA 10173)
                </Link>
                <Link
                  component={RouterLink}
                  to="/public/concerns"
                  underline="hover"
                  sx={{ fontWeight: 700, fontSize: 13, color: "var(--primary-color)" }}
                >
                  Contact &amp; Concerns
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}
