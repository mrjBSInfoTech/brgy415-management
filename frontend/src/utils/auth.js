// Keys shared or used contextually (optional fallback)
const COMMON_AUTH_KEYS = ["auth_section"];

// For Public Panel
const PUBLIC_AUTH_KEYS = [
  "public_token",
  "public_email",
  "public_account_type",
  "public_first_name",
  "public_last_name",
  "public_contact",
  "email",
  "account_type",
  "first_name",
  "last_name",
  "contact",
];

// For Private Panel
const PRIVATE_AUTH_KEYS = [
  "private_token",
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

const TOKEN_KEYS = {
  public: "public_token",
  private: "private_token",
};

/**
 * Clears authentication data for a specific section.
 * If no section is provided, it completely clears everything (Global Reset).
 */
export function clearAuthData(section = null) {
  if (section === "public") {
    PUBLIC_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    // If the active track matches, clear the section marker too
    if (localStorage.getItem("auth_section") === "public") {
      localStorage.removeItem("auth_section");
    }
  } else if (section === "private") {
    PRIVATE_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    // If the active track matches, clear the section marker too
    if (localStorage.getItem("auth_section") === "private") {
      localStorage.removeItem("auth_section");
    }
  } else {
    // Brutal cleanup: Wipe absolutely everything out to be completely safe
    PUBLIC_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    PRIVATE_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    COMMON_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("token"); // Clean up legacy key remnants
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
          .join(""),
      ),
    );

    if (decoded.exp) {
      return Date.now() < decoded.exp * 1000;
    }

    return true;
  } catch (error) {
    console.warn("Invalid token format evaluation failed.", error);
    return false;
  }
}

/**
 * Evaluates whether a user has permission to access a targeted section.
 * Expects explicit string parameter: "public" or "private"
 */
export function isAuthenticated(section) {
  if (!section) return false;

  const token = getToken(section);
  if (!hasValidToken(token)) return false;

  // Ensure they possess the token assigned specifically to this sub-route segment
  return true;
}

export function setAuthSection(section) {
  localStorage.setItem("auth_section", section);
}

export function getAuthSection() {
  return localStorage.getItem("auth_section");
}

/**
 * Sets a token to its dedicated key assignment based on panel scope
 */
export function setToken(section, token) {
  if (!token || !TOKEN_KEYS[section]) return;
  localStorage.setItem(TOKEN_KEYS[section], token);
  setAuthSection(section);
}

/**
 * Gets a token strictly matching the requested panel scope
 */
export function getToken(section) {
  const key = TOKEN_KEYS[section];
  return key ? localStorage.getItem(key) : null;
}

/**
 * Clears out individual token data and sections
 */
export function removeToken(section) {
  if (!section || !TOKEN_KEYS[section]) return;
  
  localStorage.removeItem(TOKEN_KEYS[section]);
  if (localStorage.getItem("auth_section") === section) {
    localStorage.removeItem("auth_section");
  }
}