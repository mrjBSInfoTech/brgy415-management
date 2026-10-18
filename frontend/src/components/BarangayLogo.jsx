import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import DefaultLogo from "../assets/BarangayIcon.png";
import { BarangayThemeContext } from "../theme/BarangayThemeContext";

// Keep the image box independent of the uploaded image's natural dimensions.
export default function BarangayLogo({ sx = {}, style, alt = "Barangay Logo" }) {
  const context = useContext(BarangayThemeContext);
  const filename = context?.barangayInfo?.brgy_logo;
  const logoUrl = filename && filename !== "BarangayIcon.png"
    ? `http://localhost:5000/uploads/uploadOfficial/${encodeURIComponent(filename)}`
    : "";
  const [failedUrl, setFailedUrl] = useState(null);

  return (
    <Box
      component="img"
      src={(failedUrl !== logoUrl && logoUrl) || DefaultLogo}
      alt={alt}
      onError={() => setFailedUrl(logoUrl)}
      style={style}
      sx={{
        width: 50,
        height: 50,
        maxWidth: "100%",
        ...sx,
        objectFit: "contain",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
