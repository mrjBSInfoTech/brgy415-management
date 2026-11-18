import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import HomeIcon from "@mui/icons-material/Home";
import "./Footer.css";
import { fetchOtherInfo } from "../../api/public/otherInfoAPI";
import { subscribeConnectionError } from "../../utils/connectionErrorState";
import { useBarangayTheme } from "../../theme/BarangayThemeContext";

const isSafeUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed);
};

const Footer = () => {
  const location = useLocation();
  const { barangayInfo } = useBarangayTheme();
  const [otherInfo, setOtherInfo] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine !== false : true
  );
  const [hasPageConnectionError, setHasPageConnectionError] = useState(false);
  const prevPageErrorRef = useRef(false);
  const prevPathnameRef = useRef(location.pathname);
  const hasErrorRef = useRef(false);

  const loadOtherInfo = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setIsOnline(false);
      hasErrorRef.current = true;
      setHasError(true);
      return;
    }

    try {
      const data = await fetchOtherInfo();
      if (data) {
        setOtherInfo(data);
      }
      hasErrorRef.current = false;
      setHasError(false);
    } catch (error) {
      console.error("Error fetching other info for footer:", error);
      hasErrorRef.current = true;
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    loadOtherInfo();

    const handleOnline = () => {
      setIsOnline(true);
      loadOtherInfo();
    };
    const handleOffline = () => {
      setIsOnline(false);
      hasErrorRef.current = true;
      setHasError(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const unsubscribeError = subscribeConnectionError(setHasPageConnectionError);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribeError();
    };
  }, [loadOtherInfo]);

  useEffect(() => {
    const recoveredFromPageError = prevPageErrorRef.current && !hasPageConnectionError;
    const navigated = prevPathnameRef.current !== location.pathname;
    prevPageErrorRef.current = hasPageConnectionError;
    prevPathnameRef.current = location.pathname;

    if ((recoveredFromPageError || (navigated && hasErrorRef.current)) && isOnline) {
      loadOtherInfo();
    }
  }, [hasPageConnectionError, location.pathname, isOnline, loadOtherInfo]);

  if (!isOnline || hasError || hasPageConnectionError) {
    return null;
  }

  const address = otherInfo?.address?.trim() || "Sampaloc, Manila, Philippines";
  const telephone = otherInfo?.tp_number?.trim() || "(02) 1234-5678";
  const mobile = otherInfo?.phone_number?.trim() || "+63 912 345 6789";
  const email = otherInfo?.email?.trim() || "info@barangay415.gov.ph";

  const facebookLink = isSafeUrl(otherInfo?.facebook_link) ? otherInfo.facebook_link.trim() : null;
  const instagramLink = isSafeUrl(otherInfo?.instagram_link) ? otherInfo.instagram_link.trim() : null;
  const xLink = isSafeUrl(otherInfo?.x_link) ? otherInfo.x_link.trim() : null;

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Header Section */}
        <div className="footer-header">
          <div className="footer-header-content">
            <div className="footer-logo">
              <HomeIcon className="logo-icon" color="var(--primary-color)" />
              <h2>{barangayInfo?.brgy_name || "Barangay 415 Zone 42"}</h2>
            </div>
          </div>
          <p className="footer-description">
            Your one-stop portal for community services, announcements, and
            engagement.
          </p>
        </div>

        {/* Main Content */}
        <div className="footer-content">
          {/* 1. Contact Info - NOW FIRST */}
          <div className="footer-column">
            <h3>Contact Info</h3>
            <div className="contact-item">
              <LocationOnIcon className="contact-icon" color="var(--primary-color)" />
              <p>{address}</p>
            </div>
            {telephone && (
              <div className="contact-item">
                <PhoneIcon className="contact-icon" color="var(--primary-color)" />
                <p>{telephone}</p>
              </div>
            )}
            {mobile && (
              <div className="contact-item">
                <PhoneIphoneIcon className="contact-icon" color="var(--primary-color)" />
                <p>{mobile}</p>
              </div>
            )}
            <div className="contact-item">
              <EmailIcon className="contact-icon" color="var(--primary-color)" />
              <p>{email}</p>
            </div>
          </div>

          {/* 2. Quick Links - NOW SECOND */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/public/">Home</a>
              </li>
              <li>
                <a href="/public/about">About Us</a>
              </li>
              <li>
                <a href="/public/announcements">Announcements</a>
              </li>
              <li>
                <a href="/public/concerns">Concerns</a>
              </li>
              <li>
                <a href="/public/terms">Terms of Service</a>
              </li>
              <li>
                <a href="/public/privacy-policy">Data Privacy Policy (RA 10173)</a>
              </li>
            </ul>
            {(facebookLink || instagramLink || xLink) && (
              <div className="social-links" style={{ marginTop: "1rem" }}>
                {facebookLink && (
                  <a href={facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FacebookIcon className="social-icon" />
                  </a>
                )}
                {instagramLink && (
                  <a href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <InstagramIcon className="social-icon" />
                  </a>
                )}
                {xLink && (
                  <a href={xLink} target="_blank" rel="noopener noreferrer" aria-label="X">
                    <XIcon className="social-icon" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>
            &copy; {new Date().getFullYear()} {barangayInfo?.brgy_name || "Barangay 415 Zone 42"}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
