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
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";

export default function PrivacyPolicy() {
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

  const POLICY_SECTIONS = [
    {
      id: "collection",
      icon: StorageOutlinedIcon,
      title: "1. Personal Information We Collect",
      body: [
        `In compliance with the Data Privacy Act of 2012 (Republic Act No. 10173), ${brgyName} collects only the personal information necessary to provide public community services in Sampaloc, Manila:`,
        "• Citizen Account Registration: First name, last name, email address, and contact number provided when you register for a public citizen account.",
        "• Community Concerns & Feedback: Message category (complaint, concern, or feedback), message details, submission date, and any optional supporting attachment you voluntarily submit through the Concerns page.",
        "• Account Profile Information: Your account status, account type, and registration date displayed in your citizen profile.",
      ],
    },
    {
      id: "purpose",
      icon: AssignmentTurnedInOutlinedIcon,
      title: "2. Purpose of Collecting & Processing Your Data",
      body: [
        "Your personal information is processed strictly for legitimate public service and barangay communication purposes:",
        "• Verifying your residency and identity to grant access to citizen portal services.",
        "• Receiving, reviewing, and responding to your submitted community concerns, complaints, and feedback.",
        "• Providing you with official barangay announcements, community updates, and public service advisories.",
      ],
    },
    {
      id: "rights",
      icon: VerifiedUserOutlinedIcon,
      title: "3. Your Rights as a Data Subject (RA 10173, Sec. 16–18)",
      body: [
        "Under the Philippine Data Privacy Act of 2012, every resident and registered citizen user is entitled to exercise the following rights:",
        `• Right to Be Informed: To know how your personal data is collected, used, stored, and protected by ${brgyName}.`,
        "• Right to Access & Rectification: To view your personal profile details and request corrections to any inaccurate or outdated information.",
        "• Right to Object: To withhold consent or object to the processing of your personal information for non-essential purposes.",
        "• Right to Erasure or Blocking: To request the deactivation or removal of your citizen portal account, subject to applicable government record-keeping laws.",
        "• Right to Damages & Lodge a Complaint: To seek redress before the National Privacy Commission (NPC) for any violation of your data privacy rights.",
      ],
    },
    {
      id: "security",
      icon: GppGoodOutlinedIcon,
      title: "4. Account Protection & Data Retention",
      body: [
        `${brgyName} implements appropriate organizational, physical, and technical safeguards to protect your personal information:`,
        "• Password & Session Security: Your account password is encrypted before storage, and your login session is protected using secure, HTTP-only authentication cookies.",
        "• Confidentiality: Your personal contact details and submitted concerns are treated as confidential and are only accessed to address your requests and deliver barangay services.",
        "• Retention Period: Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected or as required by applicable local government regulations.",
      ],
    },
    {
      id: "dpo",
      icon: ContactMailOutlinedIcon,
      title: "5. Privacy Inquiries & Contact Information",
      body: [
        `In accordance with National Privacy Commission (NPC) guidelines, ${brgyName} is committed to addressing any privacy concerns and notifying affected residents in the event of a qualifying personal data breach.`,
        `For privacy questions, account updates, or data requests, please visit the ${brgyName} Hall in Sampaloc, Manila, or reach out through the official contact details listed on our Concerns page.`,
      ],
    },
  ];

  if (!isOnline || connectionError) {
    return (
      <Box sx={{ minWidth: 0 }}>
        <Helmet titleTemplate="%s - Error">
          <title>Data Privacy Policy (RA 10173)</title>
        </Helmet>
        <ErrorCard title="Privacy Policy Unavailable" onRetry={checkConnection} />
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
        <title>Data Privacy Policy (RA 10173)</title>
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
                  <ShieldOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: 24, sm: 30 } }}>
                    Data Privacy Policy
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Republic Act No. 10173 — Data Privacy Act of 2012 Compliance Notice
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label="RA 10173 Compliant"
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: "rgba(30, 31, 135, 0.1)",
                  color: "var(--primary-color)",
                }}
              />
            </Stack>

            <Divider />

            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              <strong>{barangayInfo.brgy_name || "this Barangay "}</strong> (Sampaloc, Manila) is committed to protecting the
              fundamental right to privacy of every resident and citizen using our public community
              portal, in strict adherence to the{" "}
              <strong>Philippine Data Privacy Act of 2012 (RA 10173)</strong> and its Implementing
              Rules and Regulations.
            </Typography>

            <Stack spacing={3}>
              {POLICY_SECTIONS.map((section) => {
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
                  to="/public/terms"
                  underline="hover"
                  sx={{ fontWeight: 700, fontSize: 13, color: "var(--primary-color)" }}
                >
                  Terms of Service
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
