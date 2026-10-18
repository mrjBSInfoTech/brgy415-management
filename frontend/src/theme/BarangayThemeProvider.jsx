import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useLocation } from "react-router-dom";
import { fetchBrgyInfo } from "../api/private/brgyInfoAPI";
import { BarangayThemeContext } from "./BarangayThemeContext";
import { createPrivateTheme, createPublicTheme, normalizeColorScheme } from "./customTheme";
import { cacheColorScheme, readCachedColorScheme } from "./themeCache";

export default function BarangayThemeProvider({ children }) {
  const [cachedColorScheme] = useState(() => readCachedColorScheme());
  const [barangayInfo, setBarangayInfo] = useState(() =>
    cachedColorScheme ? { color_scheme: cachedColorScheme } : {},
  );
  const [themeReady, setThemeReady] = useState(cachedColorScheme !== null);
  const { pathname } = useLocation();
  const isPrivate = pathname === "/private" || pathname.startsWith("/private/");
  const colorScheme = normalizeColorScheme(barangayInfo.color_scheme);
  const privateTheme = useMemo(
    () => createPrivateTheme(colorScheme),
    [colorScheme],
  );
  const publicTheme = useMemo(() => createPublicTheme(colorScheme), [colorScheme]);

  useEffect(() => {
    let disposed = false;
    let requestId = 0;
    const refresh = async () => {
      const currentRequest = ++requestId;
      try {
        const data = await fetchBrgyInfo();
        if (!disposed && currentRequest === requestId) {
          cacheColorScheme(data?.color_scheme);
          setBarangayInfo(data || {});
        }
      } catch (error) {
        console.error("Failed to refresh barangay theme:", error);
      } finally {
        if (!disposed && currentRequest === requestId) setThemeReady(true);
      }
    };
    refresh();
    window.addEventListener("barangay-info-updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      disposed = true;
      window.removeEventListener("barangay-info-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useLayoutEffect(() => {
    const { primary, secondary, action } = publicTheme.palette;
    const variables = {
      "--primary-color": primary.main,
      "--primary-light": primary.light,
      "--primary-dark": primary.dark,
      "--primary-contrast-text": primary.contrastText,
      "--secondary-color": secondary.main,
      "--selected-color": action.selected,
    };
    Object.entries(variables).forEach(([name, value]) => {
      document.documentElement.style.setProperty(name, value);
    });
  }, [publicTheme]);

  const value = useMemo(
    () => ({ barangayInfo, colorScheme, privateTheme, publicTheme }),
    [barangayInfo, colorScheme, privateTheme, publicTheme],
  );

  return (
    <BarangayThemeContext.Provider value={value}>
      <ThemeProvider theme={isPrivate ? privateTheme : publicTheme}>
        <CssBaseline />
        {themeReady ? children : (
          <div
            role="status"
            style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#ffffff", color: "#475569" }}
          >
            Loading…
          </div>
        )}
      </ThemeProvider>
    </BarangayThemeContext.Provider>
  );
}
