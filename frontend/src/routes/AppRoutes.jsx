import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CircularProgress, Box } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../theme/fontTheme";

// Layouts
import PublicLayout from "../layout/PublicLayout";
import PrivateLayout from "../layout/PrivateLayout";

// Route Guards
import PublicRoute from "../middleware/PublicRoute";
import PrivateRoute from "../middleware/PrivateRoute";

// Private Pages
import PrivateDashboard from "../pages/private/Dashboard";
import PrivateResident from "../pages/private/Resident";
import PrivateHousehold from "../pages/private/Household";
import PrivateFiles from "../pages/private/Files";
import PrivateAnnouncements from "../pages/private/Announcements";
import PrivateConcern from "../pages/private/Concern";
import PrivateOfficials from "../pages/private/Officials";
import PrivateCitizens from "../pages/private/Citizens";
import PrivateSettings from "../pages/private/Settings";
import PrivateLogin from "../pages/private/Login";

// Public Pages
import PublicMain from "../pages/public/Main";
import PublicConcerns from "../pages/public/Concerns";
import PublicAnnouncements from "../pages/public/Announcements";
import PublicAbout from "../pages/public/About";
import PublicProfile from "../pages/public/Profile";
import PublicLogin from "../pages/public/Login";
import PublicRegister from "../pages/public/Register";
import PublicSuccessPending from "../pages/public/SuccessPending";

export default function AppRoutes() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Root Route */}
          <Route path="/" element={<Navigate to="/public/main" replace />} />

          {/* Public Routes */}
          <Route path="/public">
            <Route element={<PublicRoute />}>
              <Route path="login" element={<PublicLogin />} />
              <Route path="register" element={<PublicRegister />} />
              <Route path="success" element={<PublicSuccessPending />} />
            </Route>

            <Route element={<PublicLayout />}>
              <Route index element={<Navigate to="main" replace />} />
              <Route path="main" element={<PublicMain />} />
              <Route path="concerns" element={<PublicConcerns />} />
              <Route path="announcements" element={<PublicAnnouncements />} />
              <Route path="about" element={<PublicAbout />} />
              <Route path="profile" element={<PublicProfile />} />
            </Route>
          </Route>

          {/* Private Routes */}
          <Route path="/private">
            <Route path="login" element={<PrivateLogin />} />

            <Route element={<PrivateRoute />}>
              <Route element={<PrivateLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<PrivateDashboard />} />
                <Route path="records/resident" element={<PrivateResident />} />
                <Route
                  path="records/household"
                  element={<PrivateHousehold />}
                />
                <Route path="records/files" element={<PrivateFiles />} />
                <Route
                  path="announcements"
                  element={<PrivateAnnouncements />}
                />
                <Route path="concern" element={<PrivateConcern />} />
                <Route path="officials" element={<PrivateOfficials />} />
                <Route path="citizens" element={<PrivateCitizens />} />
                <Route path="settings" element={<PrivateSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Will be used for 404 pages or catch-all routes */}
          <Route path="*" element={<Navigate to="/public/main" replace />} />
        </Routes>
      </ThemeProvider>
    </HelmetProvider>
  );
}
