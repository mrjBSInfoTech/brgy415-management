import {
  Avatar,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import BarangayIcon from "../../../assets/BarangayIcon.png";

export default function AnnouncementCard({ announcements }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack cards vertically like a feed
        alignItems: "center",     // Center the cards horizontally
        gap: { xs: 2.5, sm: 4 },
        width: "100%",
      }}
    >
      {announcements.map((announcement) => (
        <Card
          key={announcement.announcement_id}
          sx={{
            width: "100%",
            maxWidth: 860,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)",
          }}
        >
          {/* Announcement Details (Top) */}
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Avatar
                src={BarangayIcon}
                alt="Barangay Logo"
                sx={{ width: { xs: 42, sm: 50 }, height: { xs: 42, sm: 50 }, mr: { xs: 1.5, sm: 2 }, border: "1px solid #eee", flexShrink: 0 }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.25, overflowWrap: "anywhere" }}>
                  {announcement.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(announcement.date_posted)}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "text.primary",
              }}
            >
              {announcement.description}
            </Typography>
          </CardContent>

          {/* Image (Bottom) */}
          <Box
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              backgroundColor: "#f0f2f5",
              overflow: "hidden",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              image={
                announcement.image
                  ? `http://localhost:5000/uploads/uploadAnnouncement/${encodeURIComponent(announcement.image)}`
                  : BarangayIcon
              }
              alt={announcement.title}
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
}