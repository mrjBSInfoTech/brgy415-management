import React, { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import HomeIcon from "@mui/icons-material/Home";
import "./Footer.css";
import { fetchOtherInfo } from "../../api/public/otherInfoAPI";

const Footer = () => {
  const [otherInfo, setOtherInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const getOtherInfo = async () => {
      try {
        const data = await fetchOtherInfo();
        if (isMounted && data) {
          setOtherInfo(data);
        }
      } catch (error) {
        console.error("Error fetching other info for footer:", error);
      }
    };
    getOtherInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  const address = otherInfo?.address?.trim() || "Sampaloc, Manila, Philippines";
  const telephone = otherInfo?.tp_number?.trim() || "(02) 1234-5678";
  const mobile = otherInfo?.phone_number?.trim() || "+63 912 345 6789";
  const email = otherInfo?.email?.trim() || "info@barangay415.gov.ph";

  const facebookLink = otherInfo?.facebook_link?.trim();
  const instagramLink = otherInfo?.instagram_link?.trim();
  const xLink = otherInfo?.x_link?.trim();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Header Section */}
        <div className="footer-header">
          <div className="footer-header-content">
            <div className="footer-logo">
              <HomeIcon className="logo-icon" color="var(--primary-color)" />
              <h2>Barangay 415 Zone 42</h2>
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
            </ul>
            {(facebookLink || instagramLink || xLink) && (
              <div className="social-links" style={{ marginTop: '1rem' }}>
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
            &copy; {new Date().getFullYear()} Barangay 415 Zone 42. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
