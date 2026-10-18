import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Divider,
    Avatar,
    Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import dayjs from "dayjs";
import ReportInfo from "./ReportInfo";

export default function ReportCard({ reports = [], onEdit, onDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event, report) => {
        setAnchorEl(event.currentTarget);
        setSelectedReport(report);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const accountType = localStorage.getItem("private_account_type");
    const isAdmin = accountType === "Admin";
    const isStaff = accountType === "Staff";
    const canEdit =
        (isAdmin || isStaff) && localStorage.getItem("private_can_edit") === "1";
    const canDelete =
        (isAdmin || isStaff) && localStorage.getItem("private_can_delete") === "1";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
            }}
        >
            {reports.map((report) => {
                const officialName =
                    report.first_name && report.last_name
                        ? `${report.first_name} ${report.middle_name ? report.middle_name.charAt(0) + ". " : ""}${report.last_name}`
                        : report.official_id
                            ? `Official ID #${report.official_id}`
                            : "Unknown Official";

                const position = report.position || "Barangay Official";

                const attachmentUrl = report.attachment
                    ? `http://localhost:5000/uploads/uploadReport/${encodeURIComponent(
                        report.attachment
                    )}`
                    : null;

                const formattedDate = report.date_created
                    ? dayjs(report.date_created).format("MMMM DD, YYYY • hh:mm A")
                    : "No Date";

                return (
                    <Card
                        key={report.report_id}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            p: { xs: 2, sm: 2.5 },
                            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                            },
                        }}
                    >
                        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            {/* Header: Official Details & Actions */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    justifyContent: "space-between",
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    gap: 1.5,
                                    mb: 1.5,
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar
                                        sx={{
                                            width: 44,
                                            height: 44,
                                        }}
                                        alt={report.first_name.charAt(0).toUpperCase()}
                                        src={
                                            report.image
                                                ? `http://localhost:5000/uploads/uploadOfficial/${encodeURIComponent(report.image)}`
                                                : `http://localhost:5000/uploads/uploadOfficial/profile.jpg`
                                        }
                                    />
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                                        >
                                            {officialName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {position} • {formattedDate}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        label={`Report #${report.report_id}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />

                                    {report.message_id && (
                                        <Chip
                                            label={`Concern #${report.message_id}`}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    )}

                                    {(canEdit || canDelete) && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, report)}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            {/* Report Description */}
                            <Box sx={{ my: 2 }}>
                                <Typography
                                    variant="body1"
                                    color="text.primary"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.7,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {report.report || "No report description provided."}
                                </Typography>
                            </Box>

                            {/* Bottom: Attachment Button */}
                            {attachmentUrl ? (
                                <Box
                                    sx={{
                                        mt: 2,
                                        pt: 1.5,
                                        borderTop: "1px dashed",
                                        borderColor: "divider",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1.5,
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <AttachFileIcon color="action" fontSize="small" />
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Attachment: <strong>{report.attachment}</strong>
                                        </Typography>
                                    </Stack>

                                    <Button
                                        component="a"
                                        href={attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        endIcon={<OpenInNewIcon fontSize="small" />}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 1.5,
                                            px: 2,
                                        }}
                                    >
                                        View Attachment
                                    </Button>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        mt: 1.5,
                                        pt: 1.5,
                                        borderTop: "1px dashed",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        No file / image attached
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Options Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
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
                {canEdit && (
                    <MenuItem
                        onClick={() => {
                            onEdit?.(selectedReport);
                            handleMenuClose();
                        }}
                        sx={{ color: "success.main" }}
                    >
                        <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                        Edit
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem
                        onClick={() => {
                            onDelete?.(selectedReport);
                            handleMenuClose();
                        }}
                        sx={{ color: "error.main" }}
                    >
                        <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                        Delete
                    </MenuItem>
                )}
            </Menu>

            {/* Report Info Dialog */}
            <ReportInfo
                open={openInfoDialog}
                handleClose={() => setOpenInfoDialog(false)}
                selectedReport={selectedReport}
            />
        </Box>
    );
}
