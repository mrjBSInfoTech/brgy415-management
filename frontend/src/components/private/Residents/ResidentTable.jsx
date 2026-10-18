import { useState } from "react";
import {
	Box,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ResidentTable({
	residents,
	households = [],
	onEdit,
	onDelete,
}) {

	const accountType = localStorage.getItem("private_account_type");
	const isAdmin = accountType === "Admin";
	const isStaff = accountType === "Staff";
	const canEdit =
		(isAdmin || isStaff) && localStorage.getItem("private_can_edit") === "1";
	const canDelete =
		(isAdmin || isStaff) && localStorage.getItem("private_can_delete") === "1";

	const getHousehold = (householdId) => {
		const household = households.find(
			(item) => item.household_id === householdId,
		);
		return household ? `House #${household.house_number}` : "No Data";
	};

	return (
		<TableContainer component={Paper} variant="outlined">
			<Table sx={{ minWidth: 900 }} aria-label="residents table">
				<TableHead>
					<TableRow sx={{ backgroundColor: "background.table" }}>
						<TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Date of Birth</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Household</TableCell>
						{(canEdit || canDelete) && (
							<TableCell sx={{ fontWeight: "bold" }} align="center">
								Actions
							</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{residents.map((resident) => (
						<TableRow
							key={resident.resident_id}
							sx={{
								"&:hover": { backgroundColor: "background.table" },
								transition: "background-color 0.2s ease",
							}}
						>
							<TableCell>
								<Typography variant="body2" sx={{ fontWeight: 500 }}>
									{resident.first_name} {resident.middle_name || ""} {resident.last_name}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{resident.email || "No email"}
								</Typography>
							</TableCell>
							<TableCell>{resident.gender || "No Data"}</TableCell>
							<TableCell>{new Date(resident.dob).toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric"
							}) || "No Data"}</TableCell>
							<TableCell>{resident.address || "No Data"}</TableCell>
							<TableCell>{resident.phone_number || "No Data"}</TableCell>
							<TableCell>{getHousehold(resident.household_id)}</TableCell>
							{(canEdit || canDelete) && (
								<TableCell align="center">
									{canEdit && (
										<Tooltip title="Edit">
											<IconButton
												size="small"
												color="success"
												onClick={() => onEdit(resident)}
											>
												<EditIcon />
											</IconButton>
										</Tooltip>
									)}

									{canDelete && (
										<Tooltip title="Delete">
											<IconButton
												size="small"
												color="error"
												onClick={() => onDelete(resident)}
											>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									)}
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
