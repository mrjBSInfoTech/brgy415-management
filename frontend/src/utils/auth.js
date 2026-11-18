// Keys shared or used contextually (optional fallback)
const COMMON_AUTH_KEYS = ["auth_section"];

// For Public Panel
const PUBLIC_AUTH_KEYS = [
  "public_token",
  "public_logged_in",
  "public_email",
  "public_first_name",
  "public_last_name",
  "public_contact",
  "public_status",
  "public_type",
  "public_date_created",
];

// For Private Panel
const PRIVATE_AUTH_KEYS = [
  "private_token",
  "private_logged_in",
  "private_official_account_id",
  "private_password_changed",
  "private_username",
  "private_account_type",
  "private_can_add",
  "private_can_edit",
  "private_can_delete",
  "private_first_name",
  "private_last_name",
  "private_position",
  "private_image",
  "private_contact",
  "official_account_id",
  "password_changed",
  "username",
  "account_type",
  "can_add",
  "can_edit",
  "can_delete",
  "first_name",
  "last_name",
  "position",
  "image",
  "contact",
];

/**
 * Clears authentication data for a specific section.
 * If no section is provided, it completely clears everything (Global Reset).
 */
export function clearAuthData(section = null) {
  if (section === "public") {
    PUBLIC_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    if (localStorage.getItem("auth_section") === "public") {
      localStorage.removeItem("auth_section");
    }
  } else if (section === "private") {
    PRIVATE_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    if (localStorage.getItem("auth_section") === "private") {
      localStorage.removeItem("auth_section");
    }
  } else {
    PUBLIC_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    PRIVATE_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    COMMON_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("token");
  }
}

/**
 * Decodes and checks if a given JWT string is structurally sound and unexpired.
 */
export function hasValidToken(token) {
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(payload)
          .split("")
          .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      )
    );

    if (decoded.exp) {
      return Date.now() < decoded.exp * 1000;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Evaluates whether a user is currently authenticated in the targeted panel.
 * Expects explicit string parameter: "public" or "private"
 */
export function isAuthenticated(section) {
  if (!section) return false;

  if (section === "private") {
    return Boolean(
      localStorage.getItem("private_logged_in") === "true" ||
        localStorage.getItem("private_official_account_id") ||
        localStorage.getItem("private_username")
    );
  }

  if (section === "public") {
    return Boolean(
      localStorage.getItem("public_logged_in") === "true" ||
        localStorage.getItem("public_first_name") ||
        localStorage.getItem("public_email")
    );
  }

  return false;
}

export function setAuthSection(section) {
  localStorage.setItem("auth_section", section);
}

export function getAuthSection() {
  return localStorage.getItem("auth_section");
}

/**
 * Sets authenticated state for the given section without storing JWT in localStorage.
 */
export function setToken(section) {
  if (!section) return;
  localStorage.removeItem(`${section}_token`);
  localStorage.setItem(`${section}_logged_in`, "true");
  setAuthSection(section);
}

/**
 * Returns null as JWT tokens are now strictly kept in HttpOnly cookies.
 */
export function getToken() {
  return null;
}

/**
 * Clears out session marker and sections
 */
export function removeToken(section) {
  if (!section) return;

  localStorage.removeItem(`${section}_logged_in`);
  localStorage.removeItem(`${section}_token`);
  if (localStorage.getItem("auth_section") === section) {
    localStorage.removeItem("auth_section");
  }
}
